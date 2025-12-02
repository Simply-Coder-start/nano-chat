require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const { registerUser, authenticateUser } = require('./auth');
const fs = require('fs').promises;
const fsExtra = require('fs-extra');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["https://nano-chat-wine.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3002;
const MESSAGES_FILE = path.join(__dirname, 'messages.json');

// Middleware
app.use(cors());
app.use(express.json());

// Initialize messages file
async function initMessagesFile() {
  try {
    await fs.access(MESSAGES_FILE);
  } catch (error) {
    await fs.writeFile(MESSAGES_FILE, JSON.stringify([]));
  }
}

// Read messages from file
async function readMessages() {
  try {
    const data = await fs.readFile(MESSAGES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Write messages to file
async function writeMessages(messages) {
  await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}

// Authentication routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await registerUser(username, password);
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await authenticateUser(username, password);
    res.json({ success: true, user });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send message history when user connects
  socket.on('getMessageHistory', async () => {
    try {
      const messages = await readMessages();
      socket.emit('messageHistory', messages);
    } catch (error) {
      console.error('Error loading message history:', error);
    }
  });

  // Handle new encrypted message
  socket.on('encryptedMessage', async (data) => {
    try {
      const messages = await readMessages();

      // Store the encrypted message (server never sees plaintext)
      const messageData = {
        id: Date.now().toString(),
        username: data.username,
        encryptedMessage: data.encryptedMessage,
        timestamp: new Date().toISOString()
      };

      messages.push(messageData);
      await writeMessages(messages);

      // Broadcast encrypted message to all clients
      io.emit('newEncryptedMessage', messageData);
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  // Handle delete chat
  socket.on('deleteChat', async () => {
    try {
      await writeMessages([]);
      io.emit('chatDeleted');
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});



// ... existing code ...

// Upload Init
app.post('/api/upload/init', async (req, res) => {
  try {
    const uploadId = uuidv4();
    const { filename } = req.body;
    await fsExtra.ensureDir(path.join(__dirname, 'temp_uploads', uploadId));
    res.json({ success: true, uploadId });
  } catch (error) {
    console.error('Upload init error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Upload Chunk
app.post('/api/upload/chunk', express.raw({ type: 'application/octet-stream', limit: '50mb' }), async (req, res) => {
  try {
    const { uploadId, chunkIndex } = req.query;
    if (!uploadId || chunkIndex === undefined) {
      return res.status(400).json({ success: false, error: 'Missing uploadId or chunkIndex' });
    }
    const chunkPath = path.join(__dirname, 'temp_uploads', uploadId, `chunk-${chunkIndex}`);
    await fsExtra.writeFile(chunkPath, req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Upload chunk error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Upload Complete
app.post('/api/upload/complete', async (req, res) => {
  try {
    const { uploadId, filename } = req.body;
    const chunksDir = path.join(__dirname, 'temp_uploads', uploadId);

    if (!await fsExtra.pathExists(chunksDir)) {
      return res.status(404).json({ success: false, error: 'Upload session not found' });
    }

    const chunks = await fsExtra.readdir(chunksDir);
    chunks.sort((a, b) => parseInt(a.split('-')[1]) - parseInt(b.split('-')[1]));

    const finalFilename = `${uploadId}-${filename}`;
    const finalFilePath = path.join(__dirname, 'uploads', finalFilename);

    // Reassemble
    const writeStream = fsExtra.createWriteStream(finalFilePath);
    for (const chunk of chunks) {
      const chunkData = await fsExtra.readFile(path.join(chunksDir, chunk));
      writeStream.write(chunkData);
    }
    writeStream.end();

    // Wait for stream to finish
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    // Cleanup temp
    await fsExtra.remove(chunksDir);

    // Mock Virus Scan
    console.log(`Scanning file ${finalFilename}...`);
    // if (virusDetected) throw new Error('Virus detected');

    res.json({ success: true, url: `/api/files/${finalFilename}`, filename: finalFilename });
  } catch (error) {
    console.error('Upload complete error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve Files
app.get('/api/files/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  res.sendFile(filePath);
});

server.listen(PORT, () => {
  console.log(`Secure chat server running on port ${PORT}`);
  initMessagesFile();
  fsExtra.ensureDir(path.join(__dirname, 'uploads'));
  fsExtra.ensureDir(path.join(__dirname, 'temp_uploads'));
});
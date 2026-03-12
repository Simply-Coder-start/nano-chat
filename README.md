<div align="center">

# 💬 Nano-Chat

### A lightweight, real-time encrypted chat application

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://nano-chat-wine.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://nano-chat-xl61.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-71.6%25-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://github.com/Simply-Coder-start/nano-chat)
[![CSS](https://img.shields.io/badge/CSS-27.4%25-1572B6?style=for-the-badge&logo=css3)](https://github.com/Simply-Coder-start/nano-chat)

*Real-time messaging · End-to-end encryption · Google OAuth · Emoji support*

</div>

---

## ✨ Overview

**Nano-Chat** is a full-stack, real-time chat application that demonstrates the core concepts of modern messaging systems. Built with a React frontend and a Node.js/Socket.io backend, it offers **client-side encrypted messaging**, **Google OAuth login**, and a clean, minimal interface — all deployable in minutes.

> Whether you're a developer exploring WebSocket-based architectures or looking for a lightweight chat starter, Nano-Chat's beginner-friendly structure makes it easy to understand and extend.

---

## 🚀 Features

| Feature | Description |
|---|---|
| ⚡ **Real-time Messaging** | Instant bi-directional communication powered by Socket.io |
| 🔒 **End-to-End Encryption** | Messages are encrypted client-side using CryptoJS before transmission |
| 🔑 **Google OAuth Login** | One-click sign-in with your Google account |
| 😊 **Emoji Picker** | Built-in emoji support for expressive conversations |
| 👤 **User Authentication** | Secure registration & login with bcrypt-hashed passwords |
| 🗄️ **Persistent Storage** | Messages and user data stored reliably in MongoDB |
| 🌐 **Deployed & Live** | Frontend on Vercel, backend on Render — ready to use now |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | Component-based UI framework |
| **Socket.io-client** | Real-time WebSocket communication |
| **CryptoJS** | Client-side message encryption/decryption |
| **emoji-picker-react** | Emoji support in the chat input |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | RESTful API and HTTP server |
| **Socket.io** | WebSocket server for real-time events |
| **Mongoose** | MongoDB ODM for data modeling |
| **bcryptjs** | Secure password hashing |
| **UUID** | Unique message/session ID generation |
| **dotenv** | Environment variable management |

### Infrastructure
| Service | Role |
|---|---|
| **MongoDB** | Database (cloud-hosted via MongoDB Atlas) |
| **Google OAuth 2.0** | Third-party authentication |
| **Vercel** | Frontend deployment & hosting |
| **Render** | Backend deployment & hosting |

---

## 📂 Project Structure

```
nano-chat/
│
├── frontend/                  # React client application
│   ├── public/                # Static public assets
│   └── src/                   # React source files
│       ├── components/        # Reusable UI components
│       ├── pages/             # Application pages/views
│       └── index.js           # Application entry point
│
├── backend/                   # Node.js server application
│   ├── config/                # Database & app configuration
│   ├── models/                # Mongoose data models
│   ├── auth.js                # Authentication logic (incl. Google OAuth)
│   ├── server.js              # Main server entry point
│   └── .env.example           # Environment variable template
│
├── .env.example               # Root environment variable template
├── GOOGLE_OAUTH_SETUP.md      # Detailed Google OAuth setup guide
├── chatapp.txt                # Project notes
└── README.md                  # Project documentation
```

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier works)
- A [Google Cloud Console](https://console.cloud.google.com/) project for OAuth

---

### 1. Clone the Repository

```bash
git clone https://github.com/Simply-Coder-start/nano-chat.git
cd nano-chat
```

---

### 2. Configure the Backend

```bash
cd backend
```

Copy the environment variable template and fill in your values:

```bash
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=3002
MONGODB_URI=your_mongodb_connection_string

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3002/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

Install dependencies and start the server:

```bash
npm install
npm run dev       # Development (with nodemon hot-reload)
# or
npm start         # Production
```

The backend will be running at `http://localhost:3002` ✅

---

### 3. Configure the Frontend

Open a new terminal:

```bash
cd frontend
```

Copy the environment variable template:

```bash
cp ../.env.example .env
```

Edit `frontend/.env`:

```env
REACT_APP_ENCRYPTION_KEY=your_secret_encryption_key
```

> ⚠️ **Important:** This key is used for client-side message encryption. Use a long, random string and keep it secret.

Install dependencies and start the app:

```bash
npm install
npm start
```

The frontend will be running at `http://localhost:3000` ✅

---

## 🔑 Google OAuth Setup

For detailed instructions on setting up Google OAuth credentials, refer to the dedicated guide:

📄 **[GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)**

**Quick summary:**
1. Create an OAuth 2.0 Client ID in [Google Cloud Console](https://console.cloud.google.com/)
2. Set Authorized JavaScript Origins: `http://localhost:3000`
3. Set Authorized Redirect URI: `http://localhost:3002/api/auth/google/callback`
4. Copy `Client ID` and `Client Secret` into your `backend/.env`

---

## 🌐 Live Deployment

| Service | URL |
|---|---|
| **Frontend** (Vercel) | [https://nano-chat-wine.vercel.app](https://nano-chat-wine.vercel.app) |
| **Backend API** (Render) | [https://nano-chat-xl61.onrender.com](https://nano-chat-xl61.onrender.com) |

> 💡 The backend may take 30–60 seconds to wake up on the first request if it has been idle (Render free tier spin-down behavior).

---

## 🔒 Security Notes

- All messages are **encrypted client-side** using CryptoJS before being sent over the socket — the server never sees plaintext messages.
- Passwords are hashed with **bcrypt** before being stored in MongoDB.
- Google OAuth users are assigned a random password internally; they authenticate exclusively through Google.
- **Never commit your `.env` file.** It is listed in `.gitignore` by default.
- Keep `GOOGLE_CLIENT_SECRET` and `REACT_APP_ENCRYPTION_KEY` private and secure.

---

## 🎯 Purpose of the Project

Nano-Chat was created to explore the fundamentals of building modern real-time applications. Key learning areas include:

- **WebSocket communication** with Socket.io
- **Client-side encryption** for message privacy
- **OAuth 2.0 integration** with Google
- **Full-stack architecture** connecting React, Node.js, and MongoDB
- **Deployment workflows** using Vercel and Render

---

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m 'Add some feature'`
4. **Push** to your branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request

Please make sure your code follows the existing style and that you test your changes before submitting.

---

## 📄 License

This project is open source and licensed under the **[MIT License](LICENSE)**.

---

<div align="center">

Made with ❤️ by [Simply-Coder-start](https://github.com/Simply-Coder-start)

⭐ **Star this repo if you found it helpful!** ⭐

</div>

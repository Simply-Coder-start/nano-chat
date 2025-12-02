import CryptoJS from 'crypto-js';

// In a real application, this key should be securely exchanged or derived.
// For this demo, we use a shared key from environment variables.
const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'secure-chat-demo-secret-key';

export const encryptMessage = (message) => {
  try {
    return CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
  } catch (error) {
    console.error('Encryption failed:', error);
    return null;
  }
};

export const decryptMessage = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText) throw new Error('Decryption resulted in empty string');
    return originalText;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw error;
  }
};

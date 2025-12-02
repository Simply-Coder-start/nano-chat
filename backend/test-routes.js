// Test script to verify Google OAuth routes are loaded
const express = require('express');
const app = express();

// Load the Google Auth router
const googleAuthRouter = require('./routes/googleAuth');
app.use('/api/auth', googleAuthRouter);

// List all routes
console.log('\n=== Registered Routes ===');
app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        console.log(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
        middleware.handle.stack.forEach((handler) => {
            if (handler.route) {
                const path = middleware.regexp.source.replace('\\/?', '').replace('(?=\\/|$)', '');
                console.log(`${Object.keys(handler.route.methods)} ${path}${handler.route.path}`);
            }
        });
    }
});

console.log('\n=== Environment Variables ===');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Set' : 'NOT SET');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'NOT SET');
console.log('GOOGLE_REDIRECT_URI:', process.env.GOOGLE_REDIRECT_URI || 'Using default');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'Using default');

console.log('\n✅ Routes loaded successfully!');

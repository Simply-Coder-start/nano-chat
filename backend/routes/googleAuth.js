const express = require('express');
const router = express.Router();

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'https://nano-chat-xl61.onrender.com/api/auth/google/callback';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://nano-chat-wine.vercel.app';

// Google OAuth login endpoint
router.get('/google', (req, res) => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&` +
        `response_type=code&` +
        `scope=profile email&` +
        `access_type=offline&` +
        `prompt=consent`;

    res.redirect(googleAuthUrl);
});

// Google OAuth callback endpoint
router.get('/google/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.redirect(`${FRONTEND_URL}?error=no_code`);
    }

    try {
        // Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code,
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                redirect_uri: GOOGLE_REDIRECT_URI,
                grant_type: 'authorization_code',
            }),
        });

        const tokens = await tokenResponse.json();

        if (!tokens.access_token) {
            return res.redirect(`${FRONTEND_URL}?error=token_error`);
        }

        // Get user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
            },
        });

        const userInfo = await userInfoResponse.json();

        // Create or find user in your database
        const User = require('../models/User');
        let user = await User.findOne({ email: userInfo.email });

        if (!user) {
            // Create new user
            user = new User({
                username: userInfo.name || userInfo.email.split('@')[0],
                email: userInfo.email,
                avatar: userInfo.picture,
                googleId: userInfo.id,
                password: 'google-oauth-' + Math.random().toString(36), // Random password for OAuth users
            });
            await user.save();
        }

        // Redirect to frontend with user data
        const userData = encodeURIComponent(JSON.stringify({
            username: user.username,
            email: user.email,
            avatar: user.avatar,
        }));

        res.redirect(`${FRONTEND_URL}?auth=success&user=${userData}`);
    } catch (error) {
        console.error('Google OAuth error:', error);
        res.redirect(`${FRONTEND_URL}?error=auth_failed`);
    }
});

module.exports = router;

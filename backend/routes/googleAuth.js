const express = require('express');
const router = express.Router();
const https = require('https');
const querystring = require('querystring');

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'https://nano-chat-xl61.onrender.com/api/auth/google/callback';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://nano-chat-wine.vercel.app';

// Google OAuth login endpoint
router.get('/google', (req, res) => {
    console.log('Google OAuth initiated');
    console.log('Client ID:', GOOGLE_CLIENT_ID ? 'Set' : 'Missing');

    if (!GOOGLE_CLIENT_ID) {
        return res.status(500).send('Google OAuth not configured - missing GOOGLE_CLIENT_ID');
    }

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&` +
        `response_type=code&` +
        `scope=profile email&` +
        `access_type=offline&` +
        `prompt=consent`;

    console.log('Redirecting to Google...');
    res.redirect(googleAuthUrl);
});

// Google OAuth callback endpoint
router.get('/google/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        console.error('No code received from Google');
        return res.redirect(`${FRONTEND_URL}?error=no_code`);
    }

    try {
        console.log('Exchanging code for tokens...');

        // Exchange code for tokens
        const tokenData = querystring.stringify({
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: GOOGLE_REDIRECT_URI,
            grant_type: 'authorization_code',
        });

        const tokenResponse = await new Promise((resolve, reject) => {
            const options = {
                hostname: 'oauth2.googleapis.com',
                path: '/token',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': tokenData.length,
                },
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(e);
                    }
                });
            });

            req.on('error', reject);
            req.write(tokenData);
            req.end();
        });

        if (!tokenResponse.access_token) {
            console.error('Token error:', tokenResponse);
            return res.redirect(`${FRONTEND_URL}?error=token_error`);
        }

        console.log('Getting user info from Google...');

        // Get user info from Google
        const userInfo = await new Promise((resolve, reject) => {
            const options = {
                hostname: 'www.googleapis.com',
                path: '/oauth2/v2/userinfo',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${tokenResponse.access_token}`,
                },
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(e);
                    }
                });
            });

            req.on('error', reject);
            req.end();
        });

        console.log('User info received:', userInfo.email);

        // Create or find user in your database
        const User = require('../models/User');
        let user = await User.findOne({ email: userInfo.email });

        if (!user) {
            console.log('Creating new user...');
            user = new User({
                username: userInfo.name || userInfo.email.split('@')[0],
                email: userInfo.email,
                avatar: userInfo.picture,
                googleId: userInfo.id,
                password: 'google-oauth-' + Math.random().toString(36),
            });
            await user.save();
        } else {
            console.log('User found:', user.username);
        }

        // Redirect to frontend with user data
        const userData = encodeURIComponent(JSON.stringify({
            username: user.username,
            email: user.email,
            avatar: user.avatar,
        }));

        console.log('Redirecting to frontend with user data');
        res.redirect(`${FRONTEND_URL}?auth=success&user=${userData}`);
    } catch (error) {
        console.error('Google OAuth error:', error);
        res.redirect(`${FRONTEND_URL}?error=auth_failed`);
    }
});

module.exports = router;

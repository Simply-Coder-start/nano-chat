const express = require('express');
const router = express.Router();

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
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

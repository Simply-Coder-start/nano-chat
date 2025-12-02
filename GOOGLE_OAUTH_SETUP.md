# Google OAuth Setup Instructions

## ✅ What's Been Implemented

Google OAuth authentication has been added to your Secure Chat application! Users can now sign in with their Google account.

## 📋 Setup Steps

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen if prompted:
   - User Type: External
   - App name: Secure Chat
   - User support email: Your email
   - Developer contact: Your email
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: Secure Chat
   - Authorized JavaScript origins:
     - `https://nano-chat-wine.vercel.app`
     - `http://localhost:3000` (for local testing)
   - Authorized redirect URIs:
     - `https://nano-chat-xl61.onrender.com/api/auth/google/callback`
     - `http://localhost:3002/api/auth/google/callback` (for local testing)

7. Copy the **Client ID** and **Client Secret**

### 2. Update Backend Environment Variables

Add these to your `.env` file in the `backend` directory:

```env
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_REDIRECT_URI=https://nano-chat-xl61.onrender.com/api/auth/google/callback
FRONTEND_URL=https://nano-chat-wine.vercel.app
```

### 3. Deploy to Render

1. Go to your Render dashboard
2. Select your backend service
3. Go to **Environment** tab
4. Add the Google OAuth environment variables:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REDIRECT_URI`
   - `FRONTEND_URL`
5. Save changes (this will trigger a redeploy)

### 4. Update Frontend (if needed)

The frontend is already configured to handle Google OAuth callback. It will:
- Redirect to Google for authentication
- Receive user data after successful login
- Automatically log the user in

## 🎨 UI Features

- **"Continue with Google" button** appears on the login page (not on registration)
- Clean white button with Google logo
- Smooth animations and hover effects
- "OR" divider between regular login and Google login

## 🔧 How It Works

1. User clicks "Continue with Google"
2. Redirects to Google OAuth consent screen
3. User approves access
4. Google redirects back to your backend with auth code
5. Backend exchanges code for user info
6. Backend creates/finds user in MongoDB
7. Backend redirects to frontend with user data
8. Frontend automatically logs user in

## 📝 Notes

- Google OAuth users will have their profile picture automatically set
- Email is stored in the database for OAuth users
- OAuth users get a random password (they can't use regular login)
- The feature is only available on the login page, not registration

## 🚀 Testing

Once deployed, test by:
1. Going to `https://nano-chat-wine.vercel.app`
2. Clicking "Continue with Google"
3. Signing in with your Google account
4. You should be redirected back and logged in automatically

## ⚠️ Important

- Keep your `GOOGLE_CLIENT_SECRET` secure and never commit it to Git
- The `.env.example` file has been updated with placeholders
- Make sure to add the exact redirect URIs in Google Console
- Both frontend and backend URLs must match what's configured in Google Console

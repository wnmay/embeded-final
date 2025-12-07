# Firebase Setup Guide

This guide will help you set up a new Firebase project for the PlantCare application.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** (or "Add project")
3. Enter your project name (e.g., `plantcare-watering`)
4. Choose whether to enable Google Analytics (optional)
5. Click **"Create project"**

## 2. Set Up Realtime Database

1. In Firebase Console, go to **Build > Realtime Database**
2. Click **"Create Database"**
3. Choose your database location (select the closest region to your users)
4. Start in **test mode** for development (you can secure it later)
5. Click **"Enable"**

### Database Structure

Your database should have this structure:

```json
{
  "temperature": {
    "value": 25,
    "status": "Normal",
    "min": 15,
    "max": 35
  },
  "water-level": {
    "value": 50,
    "status": "Normal",
    "min": 10,
    "max": 90
  },
  "soil-moisture": {
    "value": 3000,
    "status": "Normal",
    "min": 2800,
    "max": 3500
  }
}
```

### Sample Data Setup

You can import this sample data by:

1. Go to Realtime Database
2. Click the three dots menu (⋮) > **Import JSON**
3. Upload a JSON file with the structure above

Or manually add each node by clicking **"+"** in the database.

## 3. Get Firebase Configuration

1. In Firebase Console, click the **gear icon** ⚙️ > **Project settings**
2. Scroll down to **"Your apps"** section
3. Click the **Web icon** (`</>`) to add a web app
4. Register your app with a nickname (e.g., `plantcare-web`)
5. Copy the Firebase configuration object

It looks like this:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.REGION.firebasedatabase.app",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
};
```

## 4. Update Your Project

### Option A: Update `lib/firebase.ts` directly

Replace the configuration in `lib/firebase.ts`:

```typescript
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.REGION.firebasedatabase.app",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
```

### Option B: Use Environment Variables (Recommended)

1. Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://YOUR_PROJECT-default-rtdb.REGION.firebasedatabase.app
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
```

2. Update `lib/firebase.ts`:

```typescript
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
```

> ⚠️ **Important:** Add `.env.local` to your `.gitignore` to keep your keys private!

## 5. Database Security Rules

For production, update your Realtime Database rules in Firebase Console:

```json
{
  "rules": {
    ".read": true,
    ".write": false,
    "temperature": {
      ".write": "auth != null"
    },
    "water-level": {
      ".write": "auth != null"
    },
    "soil-moisture": {
      ".write": "auth != null"
    }
  }
}
```

This allows:

- Anyone to read data (for the web dashboard)
- Only authenticated users to write data (for your IoT device)

## 6. Test Your Setup

1. Run your development server:

   ```bash
   pnpm dev
   ```

2. Open http://localhost:3000

3. You should see the sensor data from your Firebase database

## Troubleshooting

### "Permission denied" error

- Check your database rules allow reading
- Ensure the database URL is correct

### Data not showing

- Verify the database structure matches the expected format
- Check browser console for errors
- Ensure Firebase is initialized before accessing data

### CORS errors

- Make sure you're using the correct `databaseURL` from your Firebase config

---

## Quick Reference

| Sensor        | Status Values                                   |
| ------------- | ----------------------------------------------- |
| Temperature   | Low (< 15°C), Normal (15-35°C), High (> 35°C)   |
| Water Level   | Low (< 10%), Normal (10-90%), High (> 90%)      |
| Soil Moisture | Low (> 3500), Normal (2800-3500), High (< 2800) |

---

_Guide created for MaMaTomYam team_

# Firebase setup (local)

This project includes a minimal Firebase initializer at `lib/firebase.ts` that uses the modular Firebase SDK.

Quick setup:

1. Create a Firebase project in the Firebase Console: https://console.firebase.google.com/
2. Register a Web App in your Firebase project and copy the config values.
3. Create a `.env.local` file in the project root and add the variables (see `firebase/.env.example`).

Example (`.env.local`):

NEXT_PUBLIC_FIREBASE_API_KEY=ABCD... 
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abcdef

4. Install the Firebase SDK (if not already installed):

    npm install firebase

5. Deploy Firestore Security Rules:

    a. Install Firebase CLI: npm install -g firebase-tools
    b. Login to Firebase: firebase login
    c. Initialize Firebase in your project (if not already done): firebase init
    d. Deploy the rules: firebase deploy --only firestore:rules
    
    The rules are located in `firebase/firestore.rules` and ensure authenticated users can only access their own data.

6. Use the exports in your app:

    import { auth, db, storage } from "../lib/firebase";

Notes:
- The example initializer exports `auth`, `db` (Firestore) and `storage`.
- For server-side usage, prefer using the Admin SDK in secure environments (not the browser).
- If using Next.js, keep keys starting with `NEXT_PUBLIC_` if they need to be available in the browser.
- Firestore security rules are critical for data protection. Always ensure they are deployed before using the app in production.


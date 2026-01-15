import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let adminApp: App;

if (getApps().length === 0) {
  // In production, use service account
  if (process.env.NODE_ENV === 'production') {
    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    // In development with emulators, no credentials needed
    // adminApp = initializeApp({
    //   projectId: process.env.FIREBASE_PROJECT_ID || 'demo-project',
    // });

    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
} else {
  adminApp = getApps()[0];
}

export const adminAuth = getAuth(adminApp);

// if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
//   process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
//   process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
//   process.env.FIREBASE_STORAGE_EMULATOR_HOST = 'localhost:9199';
// }

export default adminApp;

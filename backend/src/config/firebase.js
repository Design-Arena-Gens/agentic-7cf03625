import admin from 'firebase-admin';

let appInstance;

export function initFirebase() {
  if (appInstance) return appInstance;

  const {
    FIREBASE_PROJECT_ID: projectId,
    FIREBASE_CLIENT_EMAIL: clientEmail,
    FIREBASE_PRIVATE_KEY: privateKey,
  } = process.env;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Firebase credentials not configured');
  }

  const formattedKey = privateKey.replace(/\\n/g, '\n');

  appInstance = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: formattedKey,
    }),
  });

  return appInstance;
}

export function getMessaging() {
  if (!appInstance) initFirebase();
  return admin.messaging();
}

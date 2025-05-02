import admin from 'firebase-admin';
import dotenv from "dotenv"

dotenv.config();

const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
if (!base64) throw new Error('Missing Firebase env');

const serviceAccount = JSON.parse(
  Buffer.from(base64, 'base64').toString('utf-8')
);


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;

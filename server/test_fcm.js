import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync('c:/Users/shuja/Downloads/iust-alerts/firebase-service-account.json'));

initializeApp({
  credential: cert(serviceAccount)
});

const fcmMessage = {
  data: {
      title: "New IUST Alert",
      body: "Test notification from your friendly neighborhood Antigravity!",
      url: "https://example.com"
  },
  topic: "iust_notifications",
  android: {
      priority: "high"
  }
};

getMessaging().send(fcmMessage)
  .then(response => {
      console.log('Successfully sent FCM push notification:', response);
  })
  .catch(error => {
      console.error('Error sending FCM push notification:', error);
  });

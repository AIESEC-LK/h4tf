const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
    const userClaims = (await db.collection('users').doc(user.email).get()).data();
    await admin.auth().setCustomUserClaims(user.uid, userClaims);
    console.log((await admin.auth().getUser(user.uid)).customClaims);
});

exports.onParticipantCreate = functions.firestore
  .document('participants/{email}')
  .onCreate(async (snap, context) => {
    const participantRef = db.collection('participants').doc(snap.id);
    const timestamp = new Date().toISOString();
    await participantRef.set({
      status: "signed up",
      createdTimeStamp: timestamp
    }, {merge: true});
  });

exports.onParticipantUpdate = functions.firestore
  .document('participants/{email}')
  .onUpdate(async (snap, context) => {
    if (snap.before.data().lastModifiedTimestamp !== snap.after.data().lastModifiedTimestamp) return;
    const participantRef = db.collection('participants').doc(snap.after.id);
    const timestamp = new Date().toISOString();
    await participantRef.set({
      lastModifiedTimestamp: timestamp
    }, {merge: true});
  });

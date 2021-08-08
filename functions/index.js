const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
    const userClaims = (await db.collection('users').doc(user.email).get()).data();
    await admin.auth().setCustomUserClaims(user.uid, userClaims);
    console.log((await admin.auth().getUser(user.uid)).customClaims);
});

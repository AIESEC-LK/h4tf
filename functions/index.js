const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const crypto = require("crypto");
const sheets = require("./sheets");
const slack = require("./slack");

exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
    const userClaims = (await db.collection('users').doc(user.email).get()).data();
    console.log(user.email, user.uid, userClaims);
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
    await sheets.add((await participantRef.get()).data());
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

exports.getPaymentKey = functions.https.onCall(async (data, context) => {
  const participantRef = await (await (db.collection('participants').doc(data.email)).get()).data();
  const entity = participantRef.entity;

  const public_key = "-----BEGIN PUBLIC KEY-----\n" +
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDfHn5+GnfF7Kx6i9bkThER+VEI\n" +
    "uxabrUvT48k4Te6+Gwpz4zoX3ux/NTq0uJ/tqtYwqSFVkRs+nL4Zb/C21FCYE6aQ\n" +
    "lORCKYjLvbS58vOQJXRqadyQhCMOIvL+/sZmZ5PIUVJH/tmPmTgJBBNPro59U1KH\n" +
    "BJn9H5snnI07CwftgQIDAQAB\n" +
    "-----END PUBLIC KEY-----"
  let raw_request = "h4tf_" + entity + "_" + data.email + "|5000";

  if (participantRef.from != null && participantRef.from === "international") {
    raw_request = "h4tf_" + entity + "_" + data.email + "|40";
  }

  const encryptedData = crypto.publicEncrypt(
    public_key,
    // We convert the data string to a buffer using `Buffer.from`
    Buffer.from(raw_request)
  );
  //console.log("encypted data: ", encryptedData.toString("base64"));
  //context.send(encryptedData.toString("base64"));
  return encryptedData.toString("base64");
});

exports.getPaymentCurrency = functions.https.onCall(async (data, context) => {
  const participantRef = await (await (db.collection('participants').doc(data.email)).get()).data();

  let currency = "LKR";
  if (participantRef.from != null && participantRef.from === "international") currency = "USD";

  return currency;
});

exports.confirmPayment = functions.https.onRequest(async (req, res) => {
  const payment = req.body;
  console.log(payment)
  await admin.firestore().collection('payments').doc(payment.email + " || " + payment.time).set(payment);
  res.json({result: `Payment added.`});
});

exports.onPaymentCreate = functions.firestore
  .document('payments/{id}')
  .onCreate(async (snap, context) => {
    const payment = (await db.collection('payments').doc(snap.id).get()).data();
    const email = payment.email;
    const participant = (await db.collection('participants').doc(email).get()).data();
    await slack.sendNotifications(payment, participant);
  });

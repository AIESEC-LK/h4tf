const functions = require("firebase-functions");
const drive = require("./drive.js");

exports.upload_cv = functions.https.onRequest(async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  //console.log(request.body.data['cv'])// ;
  console.log(Buffer.from(request.body.data, 'base64').toString());
  //await drive.create(request.body.data);
  response.send(request.body.data);
});

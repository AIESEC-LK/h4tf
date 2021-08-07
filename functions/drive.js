const googleDrive = require('@googleapis/drive')
const {GoogleAuth} = require('google-auth-library');
const fs = require("fs");

module.exports = {
  create: async function (file) {
    console.log(file);
    const auth = new GoogleAuth({
      keyFilename: 'credentials.json',
      scopes: ['https://www.googleapis.com/auth/drive']
    });
    const driveClient = await googleDrive.drive({
      version: "v3",
      auth: auth
    });

    const fileMetadata = {
      name: 'photo.pdf',
      parents: [{"id": "1dbCfrCpNy8CSpXiwwP2YAWXn-E_Bz9_V"}]
    };
    const media = {
      mimeType: 'application/pdf',
      body: file
    };
    let x = await driveClient.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    });
    await copyTemplate(driveClient, "x.pdf", x.data.id);
    console.log("Original", "https://docs.google.com/file/d/" + x.data.id);
    return null;
  }
}

async function copyTemplate(driveClient, docName, fileId) {
  let request = {
    title: docName,
    parents: [{"id": "1dbCfrCpNy8CSpXiwwP2YAWXn-E_Bz9_V"}]
  };
  let response = await driveClient.files.copy({
    fileId: fileId,
    resource: request,
  });
  console.log("https://docs.google.com/file/d/" + response.data.id);
  await insertPermission(driveClient, response.data.id, "kaneel.dias2@aiesec.net", "user", "reader");
  return response.data.id;
}

async function insertPermission(driveClient, fileId, value, type, role) {
  var body = {
    'emailAddress': 'kaneel.dias2@aiesec.net',
    'type': type,
    'role': role
  };
  var request = await driveClient.permissions.create({
    'fileId': fileId,
    'resource': body
  });
  console.log(request.data);
}

Object.prototype.toType = function() {
  return ({}).toString.call(this).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}


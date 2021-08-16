const {GoogleAuth} = require('google-auth-library');
const {google} = require('googleapis');
const sheets = google.sheets('v4');

module.exports = {
  add: async function (data) {

    const auth = new GoogleAuth({
      keyFilename: 'credentials.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    await sheets.spreadsheets.values.append({
      spreadsheetId: "1RjtWxufpkd6wfnvX9IvoMBfu7LlO8H-8XJiHCH2ceCo",
      range: 'SUs',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [
          [
            new Date().toISOString(), data.first_name + " " + data.last_name, data.email, data.phone, data.entity,
            data.from, data.university + data.country, data.year, data.interest
          ]
        ],
      },
      auth: auth
    }, (err, response) => {
      if (err) return console.error(err)
    })
  }
};


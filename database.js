var fs = require('fs');
var mysql = require('mysql2');
const serverCa = [fs.readFileSync("certificat/DigiCertGlobalRootG2.crt.pem", "utf8")];
var db=mysql.createConnection({
    host:"hamza-mehdi-server.mysql.database.azure.com",
    user:"hamza_mehdi",
    password:"bismilah@@0404",
    database:"chat",
    port:3306,
    ssl: {
        rejectUnauthorized: false,
        ca: serverCa
    }
});
db.connect(function(err) {
  if (err) throw err;
});

module.exports = db;

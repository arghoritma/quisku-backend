var admin = require("firebase-admin");
var serviceAccount = require("../key/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();
module.exports = { admin, auth };

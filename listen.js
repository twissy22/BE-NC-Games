const app = require("./app.js");

const {PORT = 9090gti } = process.env

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`listening on port ${PORT}...`);
});
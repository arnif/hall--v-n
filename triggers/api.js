const express = require("express");
const { playScarySonos } = require("./sonos");
const { start } = require(".");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/api/start", (req, res) => {
  console.log("Starting the sound");
  //   playScarySonos();
  start();
  return res.status(200);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

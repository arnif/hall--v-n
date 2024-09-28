const { Sonos } = require("sonos");
const fs = require("fs");

// Sonos settings
const volume = 100;
const sonos = new Sonos("10.0.1.140");

// Paths for the sounds
const soundPath = "https://github.com/arnif/hall--v-n/raw/main/sounds/";

// Load the sounds from the JSON file
const soundFiles = JSON.parse(fs.readFileSync("./soundFiles.json", "utf8"));

// Function to play a random scary sound
function playScarySonos() {
  if (soundFiles.length === 0) {
    console.log("No sound files available to play.");
    return;
  }

  // Select a random sound file from the JSON
  const randomSound = soundFiles[Math.floor(Math.random() * soundFiles.length)];
  console.log("Playing remote sound:", randomSound);

  // Set volume before playing the sound
  sonos.setVolume(volume);

  // Play the sound from the GitHub URL
  sonos
    .play(soundPath + randomSound)
    .then((results) => {
      console.log(`Playing sound: ${randomSound}`);
      console.log(JSON.stringify(results, null, 2));
    })
    .catch((error) => {
      console.log(`Error playing sound: ${randomSound}`, error);
    });

  // Check and log the current volume
  sonos.getVolume().then((volume) => console.log(`Current volume = ${volume}`));
}

module.exports = { playScarySonos };

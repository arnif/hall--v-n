const { Sonos } = require("sonos");
const fs = require("fs");
const mp3Duration = require("mp3-duration"); // Library to get MP3 duration

// Sonos settings
const volume = 20;
const sonos = new Sonos("10.0.1.140");

// Paths for the sounds
const soundsFolder = "./sounds/";
const soundPath = "https://github.com/arnif/hall--v-n/raw/main/sounds/";

// Load the sounds from the JSON file
const soundFiles = JSON.parse(fs.readFileSync("./soundFiles.json", "utf8"));

// Cooldown flag
let isPlaying = false;

// Function to play a random scary sound
function playScarySonos() {
  if (isPlaying) {
    console.log("Cooldown active, skipping this motion event.");
    return;
  }

  if (soundFiles.length === 0) {
    console.log("No sound files available to play.");
    return;
  }

  // Select a random sound file from the JSON
  const randomSound = soundFiles[Math.floor(Math.random() * soundFiles.length)];
  console.log("Playing remote sound:", randomSound);

  // Play the sound from the GitHub URL
  sonos.setVolume(volume);
  sonos
    .play(soundPath + randomSound)
    .then(() => {
      console.log(`Playing sound: ${randomSound}`);

      // Use a local file to get the duration (since we can't access remote file duration directly)
      const localSoundFilePath = soundsFolder + randomSound;

      // Get the duration of the local MP3 file
      mp3Duration(localSoundFilePath, (err, duration) => {
        if (err) return console.log(`Error getting duration: ${err.message}`);
        console.log(`Sound duration: ${duration} seconds`);

        // Set the cooldown based on the duration of the file
        isPlaying = true;
        setTimeout(() => {
          isPlaying = false; // Cooldown is over
          console.log("Cooldown over, ready to play again.");
        }, duration * 1000); // Convert to milliseconds
      });
    })
    .catch((error) => {
      console.log(`Error playing sound: ${randomSound}`, error);
    });

  sonos.getVolume().then((volume) => console.log(`Current volume = ${volume}`));
}

module.exports = { playScarySonos };

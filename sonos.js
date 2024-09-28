const { Sonos } = require("sonos");
const fs = require("fs");
const mp3Duration = require("mp3-duration"); // To get the duration of mp3 files

const volume = 20;
const music_volume = 60;

const sonos = new Sonos("10.0.1.140");

const soundsFolder = "./sounds/";
const soundPath = "https://github.com/arnif/hall--v-n/raw/main/sounds/";

// Load the file names
const fileNames = require("./soundFiles.json");

function clearSonos() {
  sonos.flush();
}

// Modify playScarySonos to return duration of the sound
async function playScarySonos() {
  try {
    const item = fileNames[Math.floor(Math.random() * fileNames.length)];
    const fullPath = soundPath + item;

    console.log("Playing", fullPath);

    // Set the volume
    sonos.setVolume(volume);
    // Play the sound on Sonos
    sonos.play(fullPath);

    // Get the duration of the mp3 file (this can be done for local files, not for remote mp3s)
    const duration = await getMp3Duration(item);

    // Return the duration (in milliseconds)
    return duration;
  } catch (error) {
    console.log("Error playing sound:", error);
  }
}

// Utility to get the duration of the mp3
async function getMp3Duration(item) {
  const localFilePath = `${soundsFolder}${item}`;

  // Check if file exists locally
  if (fs.existsSync(localFilePath)) {
    const duration = await new Promise((resolve, reject) => {
      mp3Duration(localFilePath, (err, duration) => {
        if (err) return reject(err);
        resolve(duration * 1000); // Convert to milliseconds
      });
    });
    return duration;
  }

  // If file doesn't exist locally, set a default duration (for remote files)
  console.log(
    "File not found locally, returning default duration of 10 seconds."
  );
  return 10000; // Default to 10 seconds if file is not available locally
}

module.exports = { playScarySonos, clearSonos };

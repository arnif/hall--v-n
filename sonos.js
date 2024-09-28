
const { Sonos } = require("sonos");

const volume = 100;

const sonos = new Sonos("10.0.1.140");

// Your base GitHub URL
const soundBaseUrl = "https://github.com/arnif/hall--v-n/raw/main/sounds/";

// Sound files hosted on GitHub
const fileNames = [
  "Creepy_Drone_1.mp3",
  "Creepy_Drone_2.mp3",
  "Evil_Girl.mp3",
  "Ghostly_Breath.mp3",
  "Ghostly_Whisper.mp3",
  "Igor.mp3",
  "Jigsaws puppet laugh.mp3",
  "Knock_Knock.mp3",
  "Ring-around-the-rosie-creepy-voice.mp3",
  "The_Scarecrow.mp3",
  "Werewolf.mp3",
  "Zombie Whuahrrrr Group.mp3",
  "Zombie Whuahrrrr.mp3",
  "alien breathing.mp3",
  "dracula.mp3",
  "game.mp3",
  "hahahahahaha.mp3",
  "witch female laugh.mp3",
  "witch male laugh.mp3"
];

function clearSonos() {
  sonos.flush().then(() => {
    console.log("Sonos queue cleared");
  }).catch((error) => {
    console.log("Error clearing Sonos queue:", error);
  });
}

function playScarySonos() {
  sonos.setVolume(volume);

  // Play a random sound from GitHub
  const item = fileNames[Math.floor(Math.random() * fileNames.length)];
  const soundUrl = soundBaseUrl + encodeURIComponent(item); // URL-encode in case of spaces
  console.log("Playing remote sound from GitHub:", soundUrl);

  sonos
    .play(soundUrl)
    .then((results) => {
      console.log("Remote sound played:", JSON.stringify(results, null, 2));
    })
    .catch((error) => {
      console.log("Error playing remote sound:", JSON.stringify(error, null, 2));
    });

  sonos.getVolume().then((volume) => console.log(`Current volume = ${volume}`));
}

module.exports = { playScarySonos, clearSonos };
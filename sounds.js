const player = require("play-sound")((opts = {}));
const fs = require("fs");

const soundsFolder = "./sounds/";

const fileNames = fs.readdirSync(soundsFolder).map((file) => {
  return file;
});

function playSound() {
  const item = fileNames[Math.floor(Math.random() * fileNames.length)];
  console.log("Playing", item);
  player.play("./sounds/" + item, function (err) {
    if (err) throw err;
  });
}

module.exports = {
  playSound,
};

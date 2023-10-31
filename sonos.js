const { Sonos } = require("sonos");
const fs = require("fs");

const volume = 100;
const music_volume = 60;

const sonos = new Sonos("10.0.1.140");

const soundsFolder = "./sounds/";

const soundPath = "https://github.com/arnif/hall--v-n/raw/main/sounds/";

const fileNames = fs.readdirSync(soundsFolder).map((file) => {
  return file;
});

function clearSonos() {
  // sonos.stop();
  sonos.flush();
}

function playScarySonos() {
  //   const item = fileNames[Math.floor(Math.random() * fileNames.length)];
  //   console.log("Playing", item);
  //   sonos
  //     .play(soundPath + item)
  //     .then((results) => {
  //       console.log(JSON.stringify(results, null, 2));
  //     })
  //     .catch((error) => {
  //       console.log(JSON.stringify(error, null, 2));
  //     });
  sonos.setVolume(volume);
  sonos
    .getPlaylist("0", { start: 0, total: 25 })
    .then((results) => {
      const items = results.items;

      const item = items[Math.floor(Math.random() * items.length)];
      console.log("playing", item);
      sonos
        .play(item.uri)
        .then((results) => {
          console.log(JSON.stringify(results, null, 2));
        })
        .catch((error) => {
          console.log(JSON.stringify(error, null, 2));
        });
    })
    .catch((err) => {
      console.log("Error occurred %j", err);
    });

  sonos.getVolume().then((volume) => console.log(`current volume = ${volume}`));
  // sonos.setVolume(100);
}

function playHalloweenSonos() {
  // clearSonos();
  //   const item = fileNames[Math.floor(Math.random() * fileNames.length)];
  //   console.log("Playing", item);
  //   sonos
  //     .play(soundPath + item)
  //     .then((results) => {
  //       console.log(JSON.stringify(results, null, 2));
  //     })
  //     .catch((error) => {
  //       console.log(JSON.stringify(error, null, 2));
  //     });
  sonos.setVolume(music_volume);
  sonos
    .getPlaylist("1", { start: 0, total: 25 })
    .then((results) => {
      const items = results.items;

      // randomize items
      const randomItems = items.sort(() => Math.random() - 0.5);

      // const item = items[Math.floor(Math.random() * items.length)];
      // console.log("playing", item);
      // set items in queue
      randomItems.forEach((item) => {
        console.log("adding", item.title);
        sonos.queue(item.uri);
      });

      sonos
        .play()
        .then((results) => {
          console.log("done playing...play next..");
          console.log(JSON.stringify(results, null, 2));
        })
        .catch((error) => {
          console.log(JSON.stringify(error, null, 2));
        });
    })
    .catch((err) => {
      console.log("Error occurred %j", err);
    });

  sonos.getVolume().then((volume) => console.log(`current volume = ${volume}`));
  // sonos.setVolume(100);
}

module.exports = { playScarySonos, playHalloweenSonos, clearSonos };

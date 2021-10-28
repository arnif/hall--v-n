const { Sonos } = require("sonos");

const sonos = new Sonos("10.0.1.65");

function playSonos() {
  sonos
    .getPlaylist("0", { start: 0, total: 25 })
    .then((results) => {
      const items = results.items;

      const item = items[Math.floor(Math.random() * items.length)];
      console.log("playing", item);
      sonos.play(item.uri).then((results) => {
        console.log(JSON.stringify(results, null, 2));
      });
    })
    .catch((err) => {
      console.log("Error occurred %j", err);
    });

  sonos.getVolume().then((volume) => console.log(`current volume = ${volume}`));
}

module.exports = { playSonos };

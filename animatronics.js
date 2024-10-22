const theThingHand = {
  name: "The Thing Hand",
  startApi: "10.0.1.238/wave",
  endApi: "10.0.1.238/stop",
};

const zombieHand = {
  name: "Zombie Hand",
  startApi: "10.0.1.167/raise",
  endApi: "10.0.1.167/rest",
};

const animatronics = [theThingHand, zombieHand];

function startAllAnimatronics() {
  animatronics.forEach((animatronic) => {
    fetch(`http://${animatronic.startApi}`)
      .then((res) => res.text())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  });
}

function stopAllAnalimatronics() {
  animatronics.forEach((animatronic) => {
    fetch(`http://${animatronic.endApi}`)
      .then((res) => res.text())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  });
}

module.exports = {
  startAllAnimatronics,
  stopAllAnalimatronics,
};

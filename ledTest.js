const { initializeLights, blinkAllLights } = require("./hue");
const { initWledInstances, triggerWleds, neutraliseWleds } = require("./wled");

// 10s in m
const soundDuration = 60000;

async function main() {
  await initWledInstances();
  //   await initializeLights();
  //   console.log("WLED instances initialized.");

  //   redBlinkingLights();

  // group into one promise
  await Promise.all([
    // blinkAllLights(soundDuration),
    triggerWleds(soundDuration),
  ]);
  await neutraliseWleds();

  // exit
  process.exit();
}

main();

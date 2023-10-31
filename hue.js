const appName = "node-hue-api";
const deviceName = "halloween";

const v3 = require("node-hue-api").v3;
const LightState = v3.lightStates.LightState;

const LIGHTS = [2, 10, 11, 12, 14, 15, 22];

const USERNAME = process.env.HUE_BRIDGE_USER;

function setLights(state) {
  return new Promise((resolve) => {
    v3.discovery
      .nupnpSearch()
      .then((searchResults) => {
        const host = searchResults[0].ipaddress;
        return v3.api.createLocal(host).connect(USERNAME);
      })
      .then((api) => {
        // Using a LightState object to build the desired state
        // api.lights.getAll().then((lights) => {
        //   console.log("lights", lights);
        // });
        const prom = LIGHTS.map((id) => {
          return api.lights.setLightState(id, state);
        });
        resolve(prom);
        return prom;
      })
      .then((result) => {
        console.log(`Light state change was successful? ${result}`);
      });
  });
}

function redBlinkingLights() {
  const state = new LightState()
    .on(true)
    .rgb(255, 0, 0)
    .brightness(100)
    .saturation(100)
    .alertLong();

  return setLights(state);
}

function reset() {
  const state = new LightState()
    .on(true)
    .rgb(255, 0, 0)
    .brightness(100)
    .saturation(100);

  return setLights(state);
}

module.exports = { redBlinkingLights, reset };

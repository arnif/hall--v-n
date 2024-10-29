const dotenv = require("dotenv");
dotenv.config();

const v3 = require("node-hue-api").v3;
const LightState = v3.lightStates.LightState;

const HUE_BRIDGE_IP = "10.0.1.214"; // Replace with your Bridge IP
const HUE_USERNAME = process.env.HUE_BRIDGE_USER; // Replace with your developer key
const LIGHT_ID = "22"; // Replace with your LED strip's ID

// Global variable to store light IDs
let lightIds = [];

// Utility function to delay execution
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to initialize light IDs and capabilities (only once)
async function initializeLights() {
  try {
    const api = await v3.api.createLocal(HUE_BRIDGE_IP).connect(HUE_USERNAME);
    const allLights = await api.lights.getAll();

    lightIds = allLights.map((light) => ({
      id: light.id,
      supportsColor: light.colorGamut !== undefined, // Check if light supports color
    }));

    console.log("Light details initialized:", lightIds);
  } catch (error) {
    console.error(`Failed to initialize light details: ${error.message}`);
  }
}
// Function to make all lights blink for a given duration
async function blinkAllLights(duration) {
  if (!lightIds.length) {
    console.warn(
      "Light details are not initialized. Please call 'initializeLights' first."
    );
    return;
  }

  const blinkInterval = 500; // Toggle every 500ms
  const numBlinks = Math.floor(duration / blinkInterval);

  try {
    const api = await v3.api.createLocal(HUE_BRIDGE_IP).connect(HUE_USERNAME);

    // Define on and off states for color and non-color lights
    const colorOnState = new LightState().on().brightness(100).rgb(255, 0, 0); // Red for color lights
    const nonColorOnState = new LightState().on().brightness(100); // Max brightness for non-color lights
    const offState = new LightState().off();

    // Blink all lights in parallel
    for (let i = 0; i < numBlinks; i++) {
      const state = i % 2 === 0 ? "on" : "off";

      await Promise.all(
        lights.map((light) => {
          const lightState =
            state === "on"
              ? light.supportsColor
                ? colorOnState
                : nonColorOnState
              : offState;
          return api.lights.setLightState(light.id, lightState);
        })
      );

      // Wait for the blink interval
      await sleep(blinkInterval);
    }

    // Ensure all lights are off at the end
    await Promise.all(
      lightIds.map((light) => api.lights.setLightState(light.id, offState))
    );
  } catch (error) {
    console.error(`Failed to blink the lights: ${error.message}`);
  }
}

// initializeLights().then(() => {
//   // Call blinkAllLights whenever needed without re-fetching light IDs
//   blinkAllLights(60000); // Blink all lights for 5 seconds
// });

module.exports = {
  initializeLights,
  blinkAllLights,
};

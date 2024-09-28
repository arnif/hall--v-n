const { WLEDClient } = require("wled-client");

const blinkDuration = 10 * 1000; // 10 seconds

const wledInstances = [
  "10.0.1.50", // Cube
  "10.0.1.8", // Arcade machine
];

const wledClients = {};

// Initialize WLED instances
async function initWledInstances() {
  try {
    for (const ip of wledInstances) {
      const wled = new WLEDClient(ip);
      await wled.init();
      wledClients[ip] = wled;
      console.log(
        `WLED instance ${ip} initialized. Version: ${wled.info.version}`
      );
    }
  } catch (error) {
    console.error(`Error initializing WLED instances: ${error.message}`);
  }
}

// Function to blink WLEDs red for 10 seconds
async function blinkWleds() {
  try {
    for (const wled of Object.values(wledClients)) {
      await wled.setColor({ r: 255, g: 0, b: 0 }); // Set to red
      await wled.setBrightness(255); // Max brightness
    }

    setTimeout(async () => {
      await resetWleds(); // Reset to white after 10 seconds
    }, blinkDuration);
  } catch (error) {
    console.error(`Error blinking WLEDs: ${error.message}`);
  }
}

// Function to reset WLEDs to white
async function resetWleds() {
  try {
    for (const wled of Object.values(wledClients)) {
      await wled.setColor({ r: 255, g: 255, b: 255 }); // Set to white
    }
  } catch (error) {
    console.error(`Error resetting WLEDs: ${error.message}`);
  }
}

// Expose the functions for use in other files
module.exports = {
  initWledInstances,
  blinkWleds,
  resetWleds,
};

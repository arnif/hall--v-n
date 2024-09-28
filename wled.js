const { WLEDClient } = require("wled-client");

const wledInstances = [
  "10.0.1.50", // Cube
  "10.0.1.8", // Arcade machine
  "10.0.1.17", // Lukt
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

// Function to blink WLEDs red for 10 seconds (toggle red and off/white)
async function blinkWleds() {
  try {
    const blinkDuration = 10 * 1000; // 10 seconds
    const blinkInterval = 500; // Toggle every 500ms (half a second)
    const numBlinks = Math.floor(blinkDuration / blinkInterval); // Total blinks

    for (let i = 0; i < numBlinks; i++) {
      for (const wled of Object.values(wledClients)) {
        if (i % 2 === 0) {
          // Set to red on even intervals
          await wled.setColor({ r: 255, g: 0, b: 0 }); // Red color
          await wled.setBrightness(255); // Max brightness
        } else {
          // Turn off on odd intervals (or set to white if you prefer)
        //   await wled.setColor({ r: 255, g: 255, b: 255 }); // White color (optional)
          await wled.setBrightness(0); // Turn off the light
        }
      }
      await sleep(blinkInterval); // Wait for the next toggle
    }

    // After blinking, reset to white
    await resetWleds();
  } catch (error) {
    console.error(`Error blinking WLEDs: ${error.message}`);
  }
}

// Function to reset WLEDs to white
async function resetWleds() {
  try {
    for (const wled of Object.values(wledClients)) {
      await wled.setColor({ r: 255, g: 255, b: 255 }); // Set to white
      await wled.setBrightness(255); // Full brightness
    }
  } catch (error) {
    console.error(`Error resetting WLEDs: ${error.message}`);
  }
}

// Utility function to sleep (delay)
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Expose the functions for use in other files
module.exports = {
  initWledInstances,
  blinkWleds,
  resetWleds,
};

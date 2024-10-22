const { WLEDClient } = require("wled-client");

const wledInstances = [
  {
    ip: "10.0.1.50", // Cube
    neutralState: async function (wled) {
      await wled.setColor({ r: 255, g: 255, b: 255 }); // Set to white
      await wled.setBrightness(100); // Brightness 100
    },
    triggeredState: async function (wled, duration) {
      await wled.setColor({ r: 255, g: 0, b: 0 }); // Set to red
      await wled.setBrightness(255); // Max brightness
    },
  },
  {
    ip: "10.0.1.8", // Arcade machine
    neutralState: async function (wled) {
      await wled.setColor({ r: 255, g: 0, b: 0 }); // Set to blue
      await wled.setBrightness(150); // Brightness 150
    },
    triggeredState: async function (wled, duration) {
      const blinkInterval = 500; // Toggle every 500ms
      const numBlinks = Math.floor(duration / blinkInterval);
      for (let i = 0; i < numBlinks; i++) {
        if (i % 2 === 0) {
          await wled.setColor({ r: 255, g: 0, b: 0 }); // Set to red
          await wled.setBrightness(255); // Max brightness
        } else {
          await wled.setBrightness(0); // Turn off
        }
        await sleep(blinkInterval);
      }
    },
  },
  {
    ip: "10.0.1.17", // Lukt
    neutralState: async function (wled) {
      await wled.setColor({ r: 0, g: 255, b: 0 }); // Set to green
      await wled.setBrightness(200); // Brightness 200
    },
    triggeredState: async function (wled, duration) {
      const blinkInterval = 500; // Toggle every 500ms
      const numBlinks = Math.floor(duration / blinkInterval);
      for (let i = 0; i < numBlinks; i++) {
        if (i % 2 === 0) {
          await wled.setColor({ r: 255, g: 0, b: 0 }); // Set to red
          await wled.setBrightness(255); // Max brightness
        } else {
          await wled.setBrightness(0); // Turn off
        }
        await sleep(blinkInterval);
      }
    },
  },
  {
    ip: "10.0.1.66", // Restroom
    neutralState: async function (wled) {
      await wled.setColor({ r: 255, g: 255, b: 255 }); // Set to white
      await wled.setBrightness(150); // Medium brightness
    },
    triggeredState: async function (wled, duration) {
      await wled.setColor({ r: 255, g: 0, b: 0 }); // Set to orange
      await wled.setBrightness(255); // Max brightness
      await sleep(duration); // Keep in triggered state for the specified duration
    },
  },
  {
    ip: "10.0.1.200", // Entrance
    neutralState: async function (wled) {
      await wled.setColor({ r: 255, g: 255, b: 255 }); // Set to white
      await wled.setBrightness(200); // Brightness 200
    },
    triggeredState: async function (wled, duration) {
      const blinkInterval = 1000; // Toggle every 1000ms (1 second)
      const numBlinks = Math.floor(duration / blinkInterval);
      for (let i = 0; i < numBlinks; i++) {
        if (i % 2 === 0) {
          await wled.setColor({ r: 255, g: 0, b: 0 }); // Set to red
          await wled.setBrightness(255); // Max brightness
        } else {
          await wled.setBrightness(0); // Turn off
        }
        await sleep(blinkInterval);
      }
    },
  },
];

const wledClients = {};

// Initialize WLED instances
async function initWledInstances() {
  try {
    for (const instance of wledInstances) {
      const wled = new WLEDClient(instance.ip);
      await wled.init();
      wledClients[instance.ip] = { client: wled, ...instance };
      console.log(
        `WLED instance ${instance.ip} initialized. Version: ${wled.info.version}`
      );
      // Set WLED to its neutral state initially
      await instance.neutralState(wled);
    }
  } catch (error) {
    console.error(`Error initializing WLED instances: ${error.message}`);
  }
}

// Function to trigger WLEDs' triggered state for a specified duration
async function triggerWleds(soundDuration) {
  try {
    // Run all triggeredState functions simultaneously using Promise.all
    await Promise.all(
      Object.values(wledClients).map(async (wledInstance) => {
        const wled = wledInstance.client;
        return wledInstance.triggeredState(wled, soundDuration); // Pass soundDuration to triggeredState
      })
    );
    console.log("All WLEDs triggered.");
  } catch (error) {
    console.error(`Error triggering WLEDs: ${error.message}`);
  }
}

// Function to reset WLEDs to their neutral state
async function neutraliseWleds() {
  try {
    for (const wledInstance of Object.values(wledClients)) {
      const wled = wledInstance.client;
      await wledInstance.neutralState(wled); // Call neutralState for each WLED instance
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
  triggerWleds,
  neutraliseWleds,
};

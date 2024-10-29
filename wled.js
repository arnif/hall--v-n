const { WLEDClient } = require("wled-client");

const wledInstances = [
  {
    ip: "10.0.1.50", // Cube
    neutralState: async function (wled) {
      console.log(`Setting Cube (IP: ${this.ip}) to neutral state`);
      await wled.setBrightness(255); // Brightness 100
      wled.setPreset(3);
    },
    triggeredState: async function (wled, duration) {
      console.log(`Setting Cube (IP: ${this.ip}) to triggered state`);
      await wled.setBrightness(255); // Max brightness
      wled.setPreset(2);
    },
  },
  {
    ip: "10.0.1.8", // Arcade machine
    neutralState: async function (wled) {
      console.log(`Setting Arcade Machine (IP: ${this.ip}) to neutral state`);
      await wled.setColor({ r: 255, g: 0, b: 0 }); // Set to blue
      await wled.setBrightness(150); // Brightness 150
    },
    triggeredState: async function (wled, duration) {
      console.log(`Setting Arcade Machine (IP: ${this.ip}) to triggered state`);
      const blinkInterval = 500; // Toggle every 500ms
      const numBlinks = Math.floor(duration / blinkInterval);
      for (let i = 0; i < numBlinks; i++) {
        if (i % 2 === 0) {
          console.log(`Arcade Machine (IP: ${this.ip}) blinking ON`);
          await wled.setColor({ r: 255, g: 0, b: 0 }); // Set to red
          await wled.setBrightness(255); // Max brightness
        } else {
          console.log(`Arcade Machine (IP: ${this.ip}) blinking OFF`);
          await wled.setBrightness(0); // Turn off
        }
        await sleep(blinkInterval);
      }
    },
  },
  // {
  //   ip: "10.0.1.63", // Dart board
  //   neutralState: async function (wled) {
  //     console.log(`Setting Dart Board (IP: ${this.ip}) to neutral state`);
  //     await wled.setColor({ r: 255, g: 0, b: 0 }); // Set to red
  //     await wled.setBrightness(200); // Brightness 150
  //   },
  //   triggeredState: async function (wled, duration) {
  //     console.log(`Setting Dart Board (IP: ${this.ip}) to triggered state`);
  //     const blinkInterval = 500;
  //     const numBlinks = Math.floor(duration / blinkInterval);
  //     for (let i = 0; i < numBlinks; i++) {
  //       if (i % 2 === 0) {
  //         console.log(`Dart Board (IP: ${this.ip}) blinking ON`);
  //         await wled.setColor({ r: 255, g: 0, b: 0 });
  //         await wled.setBrightness(255);
  //       } else {
  //         console.log(`Dart Board (IP: ${this.ip}) blinking OFF`);
  //         await wled.setBrightness(0);
  //       }
  //       await sleep(blinkInterval);
  //     }
  //   },
  // },
  {
    ip: "10.0.1.17", // Lukt
    neutralState: async function (wled) {
      console.log(`Setting Lukt (IP: ${this.ip}) to neutral state`);
      await wled.setColor({ r: 0, g: 255, b: 0 }); // Set to green
      await wled.setBrightness(255); // Brightness 200
    },
    triggeredState: async function (wled, duration) {
      console.log(`Setting Lukt (IP: ${this.ip}) to triggered state`);
      const blinkInterval = 500;
      const numBlinks = Math.floor(duration / blinkInterval);
      for (let i = 0; i < numBlinks; i++) {
        if (i % 2 === 0) {
          console.log(`Lukt (IP: ${this.ip}) blinking ON`);
          await wled.setColor({ r: 255, g: 0, b: 0 });
          await wled.setBrightness(255);
        } else {
          console.log(`Lukt (IP: ${this.ip}) blinking OFF`);
          await wled.setBrightness(0);
        }
        await sleep(blinkInterval);
      }
    },
  },
  {
    ip: "10.0.1.66", // Restroom
    neutralState: async function (wled) {
      console.log(`Setting Restroom (IP: ${this.ip}) to neutral state`);
      await wled.setBrightness(255);
      wled.setPreset(2);
    },
    triggeredState: async function (wled, duration) {
      console.log(`Setting Restroom (IP: ${this.ip}) to triggered state`);
      await wled.setBrightness(255);
      wled.setPreset(1);
    },
  },
  {
    ip: "10.0.1.200", // Entrance
    neutralState: async function (wled) {
      console.log(`Setting Entrance (IP: ${this.ip}) to neutral state`);
      await wled.setColor({ r: 255, g: 255, b: 255 }); // Set to white
      await wled.setBrightness(200);
    },
    triggeredState: async function (wled, duration) {
      console.log(`Setting Entrance (IP: ${this.ip}) to triggered state`);
      const blinkInterval = 1000;
      const numBlinks = Math.floor(duration / blinkInterval);
      for (let i = 0; i < numBlinks; i++) {
        if (i % 2 === 0) {
          console.log(`Entrance (IP: ${this.ip}) blinking ON`);
          await wled.setColor({ r: 255, g: 0, b: 0 });
          await wled.setBrightness(255);
        } else {
          console.log(`Entrance (IP: ${this.ip}) blinking OFF`);
          await wled.setBrightness(0);
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
  console.log(`Starting trigger for all WLEDs for ${soundDuration}ms`);
  try {
    await Promise.all(
      Object.values(wledClients).map(async (wledInstance) => {
        const wled = wledInstance.client;
        await wledInstance.triggeredState(wled, soundDuration);
      })
    );
    console.log("All WLEDs have completed their triggered states.");
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

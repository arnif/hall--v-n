const { WLEDClient } = require("wled-client");

// Sleep utility function
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// List of WLED device IP addresses
// List of your WLED devices' IP addresses
const wledInstances = [
  "10.0.1.50", // Cube
  "10.0.1.8", // arcade machine
];

// Function to blink WLEDs red for 10 seconds and return to white
async function blinkWLEDs() {
  try {
    // Initialize all WLED clients and set them to red
    for (const ip of wledInstances) {
      const wled = new WLEDClient(ip);
      await wled.init();
      console.log(`Device ${ip} ready: version ${wled.info.version}`);

      console.log(`Setting ${ip} to red...`);
      await wled.setColor({ r: 255, g: 0, b: 0 }); // Set to red

      // Wait for 10 seconds
      await sleep(10000);

      console.log(`Setting ${ip} back to white...`);
      await wled.setColor({ r: 255, g: 255, b: 255 }); // Set back to white

      wled.disconnect(); // Disconnect from the WLED device
    }
  } catch (error) {
    console.error("Error controlling WLEDs:", error);
  }
}

module.exports = { blinkWLEDs };

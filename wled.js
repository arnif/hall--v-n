const { WledClient } = require('wled-client');

// List of your WLED devices' IP addresses
const wledInstances = [
  '10.0.1.50', // Cube
  '10.0.1.8' // arcade machine
];

// Initialize WLED clients for each instance
const wledClients = wledInstances.map(ip => new WledClient(ip));

// Function to blink WLEDs red for 10 seconds and then return to white
async function blinkWLEDs() {
  try {
    console.log('Turning WLEDs red...');

    // Set all WLED instances to red (RGB: 255, 0, 0)
    await Promise.all(
      wledClients.map(client => client.setColor({ r: 255, g: 0, b: 0 }))
    );

    // Wait for 10 seconds
    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log('Turning WLEDs back to white...');

    // Return all WLED instances to white (RGB: 255, 255, 255)
    await Promise.all(
      wledClients.map(client => client.setColor({ r: 255, g: 255, b: 255 }))
    );

    console.log('WLEDs returned to white.');
  } catch (error) {
    console.error('Error controlling WLEDs:', error);
  }
}

module.exports = { blinkWLEDs };

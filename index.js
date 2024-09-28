const Gpio = require("pigpio").Gpio;
const { playScarySonos } = require("./sonos");
const { initWledInstances, blinkWleds } = require("./wled");

const MOTION_SENSOR_PIN = 4; // GPIO pin for motion sensor

// Initialize WLEDs
initWledInstances();

// Initialize the motion sensor pin
const motionSensor = new Gpio(MOTION_SENSOR_PIN, {
  mode: Gpio.INPUT,
  alert: true, // Use alert to detect changes in pin state
});

// Handle motion detection
motionSensor.on("alert", async (level) => {
  if (level === 1) {
    console.log("Motion detected!");
    playScarySonos(); // Play sound
    await blinkWleds(); // Blink WLEDs
  }
});

process.on("SIGINT", () => {
  console.log("Exiting...");
  process.exit();
});

const Gpio = require('pigpio').Gpio;
const { playScarySonos } = require("./sonos");

const MOTION_SENSOR_PIN = 4; // GPIO pin for motion sensor
const COOLDOWN_TIME = 10000; // 10 seconds cooldown (adjust as needed)
let isCooldown = false; // Flag to track cooldown state

// Initialize the motion sensor pin
const motionSensor = new Gpio(MOTION_SENSOR_PIN, {
  mode: Gpio.INPUT,
  alert: true, // Use alert to detect changes in pin state
});

// Handle motion detection with cooldown logic
motionSensor.on('alert', (level) => {
  if (level === 1 && !isCooldown) {
    console.log("Motion detected!");
    playScarySonos();

    // Enter cooldown state to prevent retriggering for a period of time
    isCooldown = true;
    setTimeout(() => {
      isCooldown = false;
      console.log("Cooldown ended, ready for next trigger.");
    }, COOLDOWN_TIME);
  }
});

process.on('SIGINT', () => {
  console.log("Exiting...");
  process.exit();
});

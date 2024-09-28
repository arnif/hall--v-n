const Gpio = require("pigpio").Gpio;
const { playScarySonos } = require("./sonos");
const { blinkWleds } = require("./wled");

const MOTION_SENSOR_PIN = 4; // GPIO pin for motion sensor
let isCooldown = false; // Flag to track cooldown state

// Initialize the motion sensor pin
const motionSensor = new Gpio(MOTION_SENSOR_PIN, {
  mode: Gpio.INPUT,
  alert: true, // Use alert to detect changes in pin state
});

// Handle motion detection with cooldown logic
motionSensor.on("alert", async (level) => {
  if (level === 1) {
    if (isCooldown) {
      // Log when motion is detected but cooldown is active
      console.log("Motion detected, but cooldown is active. No action taken.");
    } else {
      console.log("Motion detected!");

      // Trigger sound and WLED blinking
      const soundDuration = await playScarySonos(); // Get duration from Sonos
      blinkWleds();

      // Enter cooldown state for the duration of the sound + 10 seconds
      const cooldownTime = soundDuration + 10000;
      console.log(`Cooldown for ${cooldownTime / 1000} seconds`);

      isCooldown = true;
      setTimeout(() => {
        isCooldown = false;
        console.log("Cooldown ended, ready for next trigger.");
      }, cooldownTime);
    }
  }
});

process.on("SIGINT", () => {
  console.log("Exiting...");
  process.exit();
});

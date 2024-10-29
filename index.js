const Gpio = require("pigpio").Gpio;
const {
  startAllAnimatronics,
  stopAllAnalimatronics,
} = require("./animatronics");
const { ADDITIONAL_COOLDOWN } = require("./constants");
const { blinkAllLights } = require("./hue");
const {
  playScarySonos,
  playMusic,
  setMusicVolume,
  pauseMusic,
} = require("./sonos");
const { triggerWleds, initWledInstances, neutraliseWleds } = require("./wled");

const MOTION_SENSOR_PIN = 4; // GPIO pin for motion sensor
let isCooldown = false; // Flag to track cooldown state

// Initialize the motion sensor pin
const motionSensor = new Gpio(MOTION_SENSOR_PIN, {
  mode: Gpio.INPUT,
  alert: true, // Use alert to detect changes in pin state
});

initWledInstances();

playMusic();

// Handle motion detection with cooldown logic
motionSensor.on("alert", async (level) => {
  if (level === 1) {
    if (isCooldown) {
      // Log when motion is detected but cooldown is active
      console.log("Motion detected, but cooldown is active. No action taken.");
    } else {
      console.log("Motion detected!");
      setMusicVolume(10); // Set music volume to 10%
      // Trigger sound and WLED blinking
      const soundDuration = await playScarySonos(); // Get duration from Sonos
      triggerWleds(soundDuration); // Blink WLEDs for the duration of
      blinkAllLights(soundDuration); // Blink Hue lights for the duration of the sound

      startAllAnimatronics(); // Start all animatronics

      // Enter cooldown state for the duration of the sound + additional time
      const cooldownTime = soundDuration + ADDITIONAL_COOLDOWN;
      console.log(`Cooldown for ${cooldownTime / 1000} seconds`);

      isCooldown = true;
      setTimeout(() => {
        isCooldown = false;
        console.log(
          "Cooldown ended, setting music volume to default. Ready for next trigger."
        );
        setMusicVolume(); // Set music volume back to default
        stopAllAnalimatronics(); // Stop all animatronics
        neutraliseWleds(); // Reset WLEDs to neutral state
      }, cooldownTime);
    }
  }
});

process.on("SIGINT", () => {
  console.log("Exiting...");
  pauseMusic();
  process.exit();
});

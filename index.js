const Gpio = require("pigpio").Gpio;
const {
  startAllAnimatronics,
  stopAllAnalimatronics,
} = require("./animatronics");
const { ADDITIONAL_COOLDOWN } = require("./constants");
const { blinkAllLights, initializeLights } = require("./hue");
const logger = require("./logger");
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

// Async function to initialize everything before motion detection
async function init() {
  await initWledInstances();
  await initializeLights();
  logger.info("WLED and Hue instances initialized.");

  playMusic(); // Start playing background music
}

// Execute init and setup motion detection after initialization
init()
  .then(() => {
    logger.info("Initialization complete, setting up motion detection.");

    // Handle motion detection with cooldown logic
    motionSensor.on("alert", async (level) => {
      if (level === 1) {
        if (isCooldown) {
          logger.info(
            "Motion detected, but cooldown is active. No action taken."
          );
        } else {
          logger.info("Motion detected!");
          setMusicVolume(10); // Set music volume to 10%

          // Trigger sound and WLED blinking
          const soundDuration = await playScarySonos(); // Get duration from Sonos
          triggerWleds(soundDuration); // Blink WLEDs for the duration of sound
          blinkAllLights(soundDuration); // Blink Hue lights for the duration of sound

          startAllAnimatronics(); // Start all animatronics

          // Enter cooldown state for the duration of the sound + additional time
          const cooldownTime = soundDuration + ADDITIONAL_COOLDOWN;
          logger.info(`Cooldown for ${cooldownTime / 1000} seconds`);

          isCooldown = true;
          setTimeout(() => {
            logger.info("Sound ended, resetting to default state.");
            setMusicVolume(); // Reset music volume
            stopAllAnalimatronics(); // Stop all animatronics
            neutraliseWleds(); // Reset WLEDs to neutral state
          }, soundDuration + 1000); // Add 1 second to ensure sound ends before resetting

          setTimeout(() => {
            isCooldown = false;
            logger.info("Cooldown ended. Ready for next trigger.");
          }, cooldownTime);
        }
      }
    });
  })
  .catch((err) => {
    logger.error("Initialization error:", err);
    process.exit(1); // Exit if initialization fails
  });

// Handle graceful shutdown
process.on("SIGINT", () => {
  logger.info("Exiting...");
  pauseMusic();
  process.exit();
});

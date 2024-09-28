const Gpio = require('onoff').Gpio; // For GPIO control
const { playScarySonos, playHalloweenSonos } = require("./sonos");

const MOTION_SENSOR_PIN = 17; // GPIO pin for motion sensor
const RESET_TIME_IN_SECONDS = 120;
const RESET_TIME = RESET_TIME_IN_SECONDS * 1000;
let timer;

// Initialize the motion sensor pin
const motionSensor = new Gpio(MOTION_SENSOR_PIN, 'in', 'both');

// Function to handle motion detection
const onMotionDetected = () => {
  console.log("Motion detected!");
  playScarySonos();

  clearTimeout(timer); // Reset timer
  timer = setTimeout(() => {
    playHalloweenSonos();
  }, 10000);

  // Reset logic after the defined reset time
  setTimeout(() => {
    console.log("Resetting...");
    // Optionally reset any additional logic here
  }, RESET_TIME);
};

// Listen for motion detection events
motionSensor.watch((err, value) => {
  if (err) {
    console.error("Error detecting motion:", err);
    return;
  }
  // Trigger on motion detected (value === 1 when motion is detected)
  if (value === 1) {
    onMotionDetected();
  }
});

process.on('SIGINT', () => {
  motionSensor.unexport(); // Unexport GPIO to clean up
});

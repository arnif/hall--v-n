require("dotenv/config");
const { RingApi } = require("ring-client-api");
const { readFile, writeFile } = require("fs");
const { promisify } = require("util");
const { redBlinkingLights, reset } = require("./hue");
const { playScarySonos, playHalloweenSonos, clearSonos } = require("./sonos");

const RESET_TIME_IN_SECONDS = 120;
const RESET_TIME = RESET_TIME_IN_SECONDS * 1000;
let timer;

async function main() {
  playHalloweenSonos();
  const { env } = process,
    ringApi = new RingApi({
      // This value comes from the .env file
      refreshToken: env.RING_REFRESH_TOKEN,
      // Listen for dings and motion events
      cameraDingsPollingSeconds: 2,
      // locationIds: [""],
      debug: true,
    }),
    locations = await ringApi.getLocations(),
    allCameras = await ringApi.getCameras();

  // get location ids
  console.log(
    `Found ${locations.length} location(s) with ${allCameras.length} camera(s).`
  );

  ringApi.onRefreshTokenUpdated.subscribe(
    async ({ newRefreshToken, oldRefreshToken }) => {
      console.log("Refresh Token Updated: ", newRefreshToken);

      // If you are implementing a project that use `ring-client-api`, you should subscribe to onRefreshTokenUpdated and update your config each time it fires an event
      // Here is an example using a .env file for configuration
      if (!oldRefreshToken) {
        return;
      }

      const currentConfig = await promisify(readFile)(".env"),
        updatedConfig = currentConfig
          .toString()
          .replace(oldRefreshToken, newRefreshToken);

      await promisify(writeFile)(".env", updatedConfig);
    }
  );

  // Here, we are picking the first location. You may want to choose a specific location based on your requirements.
  const firstLocation = locations[0];

  const camera = firstLocation.cameras[0];

  console.log(
    `Listening to doorbell and motion events for location: ${firstLocation.name}`
  );

  camera.onDoorbellPressed.subscribe((event) => {
    console.log(
      `Doorbell pressed at ${event.created_at} for device ${event.device_id}`
    );
    // redBlinkingLights();
    playScarySonos();
    setTimeout(() => {
      playHalloweenSonos();
    }, 10000);

    setTimeout(() => {
      // reset();
    }, RESET_TIME);
  });

  // camera.onMotionDetected.subscribe((event) => {
  //   console.log(
  //     `Motion detected at ${event.created_at} for device ${event.device_id}`
  //   );
  //   playScarySonos();
  // });

  // if (allCameras.length) {
  //   allCameras.forEach(async (camera) => {
  //     camera.onNewDing.subscribe(async (ding) => {
  //       playScarySonos();
  //       // if (ding.kind === "motion") {
  //       // playScarySonos();
  //       // } else {
  //       // playScarySonos();
  //       // const promises = redBlinkingLights();
  //       // clearInterval(timer);
  //       // Promise.all(promises).then((d) => {
  //       //   console.log("i have resolved everything...", d);
  //       //   timer = setTimeout(() => {
  //       //     console.log("reset");
  //       //     reset();
  //       //   }, RESET_TIME);
  //       // });
  //       // }
  //       const event =
  //         ding.kind === "motion"
  //           ? "Motion detected"
  //           : ding.kind === "ding"
  //           ? "Doorbell pressed"
  //           : `Video started (${ding.kind})`;

  //       console.log(
  //         `${event} on ${camera.name} camera. Ding id ${
  //           ding.id_str
  //         }.  Received at ${new Date()}`
  //       );
  //     });
  //   });

  console.log("Listening for motion and doorbell presses on your cameras.");
  // }
}
// playScarySonos();
// reset();
main();
// redBlinkingLights();

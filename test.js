const { Sonos } = require("sonos");

// Initialize Sonos device by providing the IP address
const sonos = new Sonos("10.0.1.65"); // Replace with your Sonos speaker's IP

async function playPlaylist(playlistName) {
  try {
    // Search for available playlists
    const playlists = await sonos.getMusicLibrary("sonos_playlists");
    const playlist = playlists.items.find(
      (item) => item.title === playlistName
    );

    if (playlist) {
      console.log(`Playing playlist: ${playlist.title}`);

      // Queue the playlist
      await sonos.queue(playlist.uri);

      // Play the first item in the playlist
      sonos.play();
      console.log(`Now playing: ${playlist.title}`);
    } else {
      console.log(`Playlist "${playlistName}" not found.`);
    }
  } catch (error) {
    console.error("Error playing playlist:", error);
  }
}

// Play the playlist by calling the function and providing the name of the playlist
playPlaylist("Halloween"); // Replace with your playlist name

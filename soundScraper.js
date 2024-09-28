const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

// URL of the GitHub page with sound files
const githubRepoUrl = "https://github.com/arnif/hall--v-n/tree/main/sounds";
// Path to store scraped file names
const soundFilesPath = "./soundFiles.json";

// Function to scrape file names from GitHub
async function scrapeGithubFiles() {
  try {
    const response = await axios.get(githubRepoUrl);
    const html = response.data;

    // Load the HTML into cheerio
    const $ = cheerio.load(html);

    // Array to store scraped filenames
    let fileNames = [];

    // Extract filenames by looking for <a> elements linking to .mp3 files
    $('a[href*="/blob/main/sounds/"]').each((index, element) => {
      const href = $(element).attr("href");
      const fileName = href.split("/").pop(); // Get the actual file name from the URL path

      if (fileName.endsWith(".mp3")) {
        fileNames.push(fileName);
      }
    });

    // Remove duplicates by converting array to Set and back to array
    fileNames = [...new Set(fileNames)];

    // If filenames are found, save them to the soundFiles.json
    if (fileNames.length > 0) {
      fs.writeFileSync(soundFilesPath, JSON.stringify(fileNames, null, 2));
      console.log(`Scraped and saved ${fileNames.length} unique sound files.`);
    } else {
      console.log("No .mp3 files found.");
    }
  } catch (error) {
    console.error("Error scraping GitHub:", error);
  }
}

// Run the scraper
scrapeGithubFiles();

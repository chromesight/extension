import fs from 'fs/promises';
import path from 'path';

async function fetchEmbed(url: string, filename: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    
    const assetsDir = path.join(process.cwd(), 'assets');
    const embedsDir = path.join(assetsDir, filename.split('/')[0]);
    
    // Ensure directories exist
    await fs.mkdir(embedsDir, { recursive: true });
    
    // Write file
    await fs.writeFile(path.join(assetsDir, filename), text);
    console.log(`Successfully fetched and saved ${filename}`);
  } catch (error) {
    console.error(`Error fetching ${filename}:`, error);
    process.exit(1);
  }
}

async function main() {
  // Fetch Bluesky embed script
  await fetchEmbed('https://embed.bsky.app/embed.js', 'bluesky/embed.js');
  
  // Fetch Twitter embed script
  await fetchEmbed('https://platform.twitter.com/widgets.js', 'twitter/widgets.js');
}

main(); 
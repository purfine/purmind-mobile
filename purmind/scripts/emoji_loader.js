const fs = require('fs');
const https = require('https');
const path = require('path');

const emojiPath = './assets/emojis/img';
const dataPath = './assets/emojis/data.json';

// Create emojis directory if it doesn't exist
if (!fs.existsSync(emojiPath)) {
    fs.mkdirSync(emojiPath);
}

// Read the JSON file
const data = require(dataPath);

// Function to download an image
function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            const file = fs.createWriteStream(path.join(emojiPath, filename + '.png'));
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded ${filename}.png`);
                resolve();
            });
            
            file.on('error', (err) => {
                fs.unlink(path.join('emojis', filename + '.png'), () => reject(err));
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

// Download all images
async function downloadAllImages() {
    const keys = Object.keys(data);
    
    for (const key of keys) {
        try {
            await downloadImage(data[key], key);
        } catch (error) {
            console.error(`Error downloading ${key}:`, error);
        }
    }
    console.log('All downloads completed!');
}

downloadAllImages();
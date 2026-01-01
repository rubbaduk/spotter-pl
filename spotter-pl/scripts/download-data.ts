import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { createWriteStream } from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

const DATASETS = [
  {
    url: 'https://openpowerlifting.gitlab.io/opl-csv/files/openpowerlifting-latest.zip',
    zipFile: 'openpowerlifting-latest.zip',
    csvFile: 'openpowerlifting.csv'
  },
  {
    url: 'https://openpowerlifting.gitlab.io/opl-csv/files/openipf-latest.zip',
    zipFile: 'openipf-latest.zip',
    csvFile: 'openipf.csv'
  }
];

const DATA_DIR = path.join(__dirname, '..', 'data', 'downloads');

// ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// download file from url
async function downloadFile(url: string, destination: string): Promise<void> {
  console.log(`downloading ${url}`);
  
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // follow redirect
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadFile(redirectUrl, destination).then(resolve).catch(reject);
          return;
        }
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`failed to download: ${response.statusCode}`));
        return;
      }

      const fileStream = createWriteStream(destination);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`downloaded to ${destination}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlinkSync(destination);
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// unzip 
async function unzipFile(zipPath: string, outputDir: string): Promise<void> {
  console.log(`unzipping ${zipPath}`);
  
  try {
    await execAsync(`unzip -o "${zipPath}" -d "${outputDir}"`);
    console.log(`unzipped to ${outputDir}`);
  } catch (error) {
    throw new Error(`failed to unzip: ${error}`);
  }
}


async function download() {
  console.log('starting download\n');
  
  ensureDataDir();

  try {

    for (const dataset of DATASETS) {
      console.log(`\nprocessing ${dataset.csvFile}`);
      
      const zipPath = path.join(DATA_DIR, dataset.zipFile);

      // check if zip file already exists
      if (fs.existsSync(zipPath)) {
        console.log(`zip file already exists, skipping download`);
      } else {
        // download zip file
        await downloadFile(dataset.url, zipPath);
      }

      // clean up any existing directories with the same name pattern
      const existingDirs = fs.readdirSync(DATA_DIR).filter(item => {
        const itemPath = path.join(DATA_DIR, item);
        return fs.statSync(itemPath).isDirectory() && 
               item.startsWith(dataset.csvFile.split('.')[0]);
      });
      
      for (const dir of existingDirs) {
        fs.rmSync(path.join(DATA_DIR, dir), { recursive: true, force: true });
        console.log(`cleaned up existing directory ${dir}`);
      }


      await unzipFile(zipPath, DATA_DIR);

      // cleanup zip file
      fs.unlinkSync(zipPath);
      console.log(`cleaned up ${dataset.zipFile}`);
    }

    console.log('\ndownload completed successfully!');
    
  } catch (error) {
    console.error('download failed:', error);
    process.exit(1);
  }
}

download();

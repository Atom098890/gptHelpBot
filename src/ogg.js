import axios from "axios";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import { createWriteStream } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { deleteFile } from "./utils/deleteFile.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

class OggConverter {
    constructor() {
        ffmpeg.setFfmpegPath(ffmpegStatic);
    }

    toMp3(input, output) {
        try {
            const outputPath = resolve(dirname(input), `${output}.mp3`);
            return new Promise((res, rej) => {
                ffmpeg(input)
                .inputOption('-t 30')
                .output(outputPath)
                .on('end', () => {
                    deleteFile(input);
                    res(outputPath);
                })
                .on('error', (err) => rej(err.message))
                .run();
            });
        } catch (error) {
            throw new Error(`Create file to .mp3 failed ${error.message}`)
        }
    }

    async create(url, filename) {
        try {
            const oggPath = resolve(__dirname, '../voices', `${filename}.ogg`);
            const response = await axios({
                method: 'get',
                url,
                responseType: 'stream'
            });

            return new Promise(resolve => {
                const stream = createWriteStream(oggPath);
                response.data.pipe(stream);
                stream.on('finish', () => resolve(oggPath));
            });
        } catch (error) {
            throw new Error(`Create file .ogg failed ${error.message}`);
        }
    }
}

export const ogg = new OggConverter();
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const axios_1 = __importDefault(require("axios"));
const os_1 = require("os");
const util_1 = require("util");
const child_process_1 = require("child_process");
const fs_extra_1 = require("fs-extra");
// telegraph-uploader removed — using gofile.io instead
const form_data_1 = __importDefault(require("form-data"));
const cheerio_1 = require("cheerio");
const emoji_regex_1 = __importDefault(require("emoji-regex"));
const linkify = __importStar(require("linkifyjs"));
class Utils {
    constructor() {
        this.generateRandomHex = () => `#${(~~(Math.random() * (1 << 24))).toString(16)}`;
        this.capitalize = (content) => `${content.charAt(0).toUpperCase()}${content.slice(1)}`;
        this.generateRandomUniqueTag = (n = 4) => {
            let max = 11;
            if (n > max)
                return `${this.generateRandomUniqueTag(max)}${this.generateRandomUniqueTag(n - max)}`;
            max = Math.pow(10, n + 1);
            const min = max / 10;
            return (Math.floor(Math.random() * (max - min + 1)) + min).toString().substring(1);
        };
        this.extractNumbers = (content) => {
            const search = content.match(/(-\d+|\d+)/g);
            if (search !== null)
                return search.map((string) => parseInt(string));
            return [];
        };
        this.extractUrls = (content) => {
            const urls = linkify.find(content);
            const arr = [];
            for (const url of urls) {
                arr.push(url.value);
            }
            return arr;
        };
        this.extractEmojis = (content) => content.match((0, emoji_regex_1.default)()) || [];
        this.formatSeconds = (seconds) => new Date(seconds * 1000).toISOString().substr(11, 8);
        this.bufferToUrl = async (media, filename = 'media.jpg') => {
            // Pick an upload server from gofile.io
            const serverRes = await axios_1.default.get('https://api.gofile.io/servers', { timeout: 8000 });
            if (serverRes.data.status !== 'ok')
                throw new Error('gofile server fetch failed');
            const server = serverRes.data.data.servers[0].name;
            const form = new form_data_1.default();
            form.append('file', media, { filename });
            const upRes = await axios_1.default.post(`https://${server}.gofile.io/contents/uploadfile`, form, { headers: form.getHeaders(), timeout: 30000 });
            if (upRes.data.status !== 'ok')
                throw new Error('gofile upload failed');
            return upRes.data.data.downloadPage;
        };
        this.convertMs = (ms, to = 'seconds') => {
            const seconds = parseInt((ms / 1000).toString().split('.')[0]);
            const minutes = parseInt((seconds / 60).toString().split('.')[0]);
            const hours = parseInt((minutes / 60).toString().split('.')[0]);
            if (to === 'hours')
                return hours;
            if (to === 'minutes')
                return minutes;
            return seconds;
        };
        this.webpToPng = async (webp) => {
            const filename = `${(0, os_1.tmpdir)()}/${Math.random().toString(36)}`;
            await (0, fs_extra_1.writeFile)(`${filename}.webp`, webp);
            await this.exec(`dwebp "${filename}.webp" -o "${filename}.png"`);
            const buffer = await (0, fs_extra_1.readFile)(`${filename}.png`);
            Promise.all([(0, fs_extra_1.unlink)(`${filename}.png`), (0, fs_extra_1.unlink)(`${filename}.webp`)]);
            return buffer;
        };
        this.mp3ToOpus = async (mp3) => {
            const filename = `${(0, os_1.tmpdir)()}/${Math.random().toString(36)}`;
            await (0, fs_extra_1.writeFile)(`${filename}.mp3`, mp3);
            await this.exec(`ffmpeg -i ${filename}.mp3 -c:a libopus ${filename}.opus`);
            const buffer = await (0, fs_extra_1.readFile)(`${filename}.opus`);
            Promise.all([(0, fs_extra_1.unlink)(`${filename}.mp3`), (0, fs_extra_1.unlink)(`${filename}.opus`)]);
            return buffer;
        };
        this.mp4ToWhatsApp = async (mp4) => {
            const filename = `${(0, os_1.tmpdir)()}/${Math.random().toString(36)}`;
            await (0, fs_extra_1.writeFile)(`${filename}.mp4`, mp4);
            await this.exec(`ffmpeg -y -i ${filename}.mp4 -c:v libx264 -preset fast -crf 28 -c:a aac -b:a 128k -movflags faststart -pix_fmt yuv420p ${filename}_out.mp4`);
            const buffer = await (0, fs_extra_1.readFile)(`${filename}_out.mp4`);
            Promise.all([(0, fs_extra_1.unlink)(`${filename}.mp4`), (0, fs_extra_1.unlink)(`${filename}_out.mp4`)]);
            return buffer;
        };
        this.webpToMp4 = async (webp) => {
            const responseFile = async (form, buffer = '') => {
                return axios_1.default.post(buffer ? `https://ezgif.com/webp-to-mp4/${buffer}` : 'https://ezgif.com/webp-to-mp4', form, {
                    headers: { 'Content-Type': `multipart/form-data; boundary=${form.getBoundary()}` }
                });
            };
            return new Promise(async (resolve, reject) => {
                const form = new form_data_1.default();
                form.append('new-image-url', '');
                form.append('new-image', webp, { filename: 'blob' });
                responseFile(form)
                    .then(({ data }) => {
                    const datafrom = new form_data_1.default();
                    const $ = (0, cheerio_1.load)(data);
                    const file = $('input[name="file"]').attr('value');
                    datafrom.append('file', file);
                    datafrom.append('convert', 'Convert WebP to MP4!');
                    responseFile(datafrom, file)
                        .then(async ({ data }) => {
                        const $ = (0, cheerio_1.load)(data);
                        const result = await this.getBuffer(`https:${$('div#output > p.outfile > video > source').attr('src')}`);
                        resolve(result);
                    })
                        .catch(reject);
                })
                    .catch(reject);
            });
        };
        this.gifToMp4 = async (gif) => {
            const filename = `${(0, os_1.tmpdir)()}/${Math.random().toString(36)}`;
            await (0, fs_extra_1.writeFile)(`${filename}.gif`, gif);
            await this.exec(`ffmpeg -y -f gif -i ${filename}.gif -movflags faststart -pix_fmt yuv420p -crf 18 -preset medium -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ${filename}.mp4`);
            const buffer = await (0, fs_extra_1.readFile)(`${filename}.mp4`);
            Promise.all([(0, fs_extra_1.unlink)(`${filename}.gif`), (0, fs_extra_1.unlink)(`${filename}.mp4`)]);
            return buffer;
        };
        this.fetch = async (url) => {
            try {
                return (await axios_1.default.get(url)).data;
            }
            catch (err) {
                console.error(`[Utils.fetch] Failed to fetch ${url}:`, err.message);
                return null;
            }
        };
        this.getBuffer = async (url) => {
            try {
                return (await axios_1.default.get(url, { responseType: 'arraybuffer' })).data;
            }
            catch (err) {
                console.error(`[Utils.getBuffer] Failed to fetch buffer from ${url}:`, err.message);
                throw err;
            }
        };
        /** Download buffer only if file size is within limit.
         *  Checks Content-Length header first — returns null if too large or fetch fails. */
        this.getBufferCapped = async (url, maxBytes) => {
            try {
                // HEAD request — check size without downloading
                const head = await axios_1.default.head(url, { timeout: 8000 }).catch(() => null);
                if (head) {
                    const contentLength = parseInt(String(head.headers['content-length'] ?? '0'), 10);
                    if (contentLength > 0 && contentLength > maxBytes)
                        return null;
                }
                const res = await axios_1.default.get(url, {
                    responseType: 'arraybuffer',
                    maxContentLength: maxBytes,
                    maxBodyLength: maxBytes,
                    timeout: 20000
                });
                const buf = Buffer.from(res.data);
                if (buf.length > maxBytes)
                    return null;
                return buf;
            }
            catch {
                return null;
            }
        };
        /** Convert a GIF URL → MP4 Buffer using ffmpeg (reads directly from URL).
         *  Scales to max 640px wide (keeps aspect ratio) — sharp + small enough for WhatsApp.
         *  Returns null on any failure so callers can fall back to text. */
        this.gifUrlToMp4 = async (url, timeoutMs = 60000) => {
            return new Promise((resolve) => {
                const chunks = [];
                const proc = (0, child_process_1.spawn)('ffmpeg', [
                    '-y',
                    '-i', url,
                    '-vf', "scale='min(640,iw)':-2,scale=trunc(iw/2)*2:trunc(ih/2)*2",
                    '-pix_fmt', 'yuv420p',
                    '-crf', '24',
                    '-preset', 'fast',
                    '-movflags', 'frag_keyframe+empty_moov+faststart',
                    '-t', '30',
                    '-f', 'mp4',
                    'pipe:1'
                ], { stdio: ['ignore', 'pipe', 'ignore'] });
                proc.stdout.on('data', (chunk) => chunks.push(chunk));
                const timer = setTimeout(() => {
                    proc.kill();
                    resolve(null);
                }, timeoutMs);
                proc.on('close', (code) => {
                    clearTimeout(timer);
                    if (code === 0 && chunks.length > 0)
                        resolve(Buffer.concat(chunks));
                    else
                        resolve(null);
                });
                proc.on('error', () => {
                    clearTimeout(timer);
                    resolve(null);
                });
            });
        };
        this.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        this.withRetry = async (fn, options = {}) => {
            const { retries = 3, delay = 1500 } = options;
            let lastError;
            for (let attempt = 0; attempt <= retries; attempt++) {
                try {
                    return await fn();
                }
                catch (err) {
                    lastError = err;
                    const status = err?.response?.status;
                    const isRetryable = status === 429 || status === 503 || status === 504;
                    const isLastAttempt = attempt === retries;
                    if (!isRetryable || isLastAttempt)
                        throw err;
                    await this.sleep(delay * (attempt + 1));
                }
            }
            throw lastError;
        };
        this.exec = (0, util_1.promisify)(child_process_1.exec);
    }
}
exports.Utils = Utils;

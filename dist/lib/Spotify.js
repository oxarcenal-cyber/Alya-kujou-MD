"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spotify = void 0;
const spotifydl_x_1 = __importDefault(require("spotifydl-x"));
const _1 = require(".");
class Spotify extends spotifydl_x_1.default {
    constructor(url) {
        super({
            clientId: 'acc6302297e040aeb6e4ac1fbdfd62c3',
            clientSecret: '0e8439a1280a43aba9a5bc0a16f3f009'
        });
        this.url = url;
        this.getInfo = async () => await this.getTrack(this.url).catch(() => {
            return { error: 'Failed' };
        });
        this.download = async () => await this.utils.mp3ToOpus((await this.downloadTrack(this.url)));
        this.utils = new _1.Utils();
    }
}
exports.Spotify = Spotify;

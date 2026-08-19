"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIntroVideo = exports.getRandomIntroVideo = exports.getIntroVideoCount = void 0;
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const VIDEO_DIR = (0, path_1.join)(__dirname, '..', '..', 'assets', 'videos');
/** Returns total count of intro-*.mp4 files available on disk */
const getIntroVideoCount = () => {
    try {
        return (0, fs_extra_1.readdirSync)(VIDEO_DIR).filter(f => /^intro-\d+\.mp4$/.test(f)).length;
    }
    catch {
        return 0;
    }
};
exports.getIntroVideoCount = getIntroVideoCount;
/** Picks a random intro video from disk and returns its buffer + id */
const getRandomIntroVideo = () => {
    try {
        const files = (0, fs_extra_1.readdirSync)(VIDEO_DIR).filter(f => /^intro-\d+\.mp4$/.test(f));
        if (!files.length)
            return null;
        const picked = files[Math.floor(Math.random() * files.length)];
        const videoPath = (0, path_1.join)(VIDEO_DIR, picked);
        if (!(0, fs_extra_1.existsSync)(videoPath))
            return null;
        const id = parseInt(picked.replace('intro-', '').replace('.mp4', ''));
        return { buffer: (0, fs_extra_1.readFileSync)(videoPath), id };
    }
    catch {
        return null;
    }
};
exports.getRandomIntroVideo = getRandomIntroVideo;
/** Returns buffer of a specific intro video by id */
const getIntroVideo = (id) => {
    try {
        const videoPath = (0, path_1.join)(VIDEO_DIR, `intro-${id}.mp4`);
        if (!(0, fs_extra_1.existsSync)(videoPath))
            return null;
        return (0, fs_extra_1.readFileSync)(videoPath);
    }
    catch {
        return null;
    }
};
exports.getIntroVideo = getIntroVideo;

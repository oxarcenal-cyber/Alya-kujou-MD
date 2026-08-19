"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetHandler = void 0;
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const chalk_1 = __importDefault(require("chalk"));
class AssetHandler {
    constructor(client) {
        this.client = client;
        this.loadAssets = () => {
            this.client.log('Loading Assets...');
            const folders = (0, fs_extra_1.readdirSync)((0, path_1.join)(...this.path));
            for (const folder of folders) {
                this.path.push(folder);
                const folderPath = (0, path_1.join)(...this.path);
                // Skip if this entry is not a directory (safety check)
                if (!(0, fs_extra_1.statSync)(folderPath).isDirectory()) {
                    this.path.splice(this.path.indexOf(folder), 1);
                    continue;
                }
                const assets = (0, fs_extra_1.readdirSync)(folderPath);
                for (const asset of assets) {
                    this.path.push(asset);
                    const assetPath = (0, path_1.join)(...this.path);
                    // Skip subdirectories (e.g. assets/images/regions/)
                    if ((0, fs_extra_1.statSync)(assetPath).isDirectory()) {
                        this.path.splice(this.path.indexOf(asset), 1);
                        continue;
                    }
                    // Skip intro-* videos — served on-demand via VideoService (saves RAM)
                    if (asset.startsWith('intro-')) {
                        this.path.splice(this.path.indexOf(asset), 1);
                        continue;
                    }
                    const buffer = (0, fs_extra_1.readFileSync)(assetPath);
                    this.client.assets.set(asset.split('.')[0], buffer);
                    this.client.log(`Loaded: ${chalk_1.default.redBright(asset.split('.')[0])} from ${chalk_1.default.blueBright(folder)}`);
                    this.path.splice(this.path.indexOf(asset), 1);
                }
                this.path.splice(this.path.indexOf(folder), 1);
            }
            return this.client.log(`Successfully loaded ${chalk_1.default.cyanBright(this.client.assets.size)} assets`);
        };
        this.path = [__dirname, '..', '..', 'assets'];
    }
}
exports.AssetHandler = AssetHandler;

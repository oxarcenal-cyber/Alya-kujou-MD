import { readdirSync, readFileSync, statSync } from 'fs-extra'
import { join } from 'path'
import chalk from 'chalk'
import { Client } from '../Structures'

export class AssetHandler {
    constructor(private client: Client) {}

    public loadAssets = (): void => {
        this.client.log('Loading Assets...')
        const folders = readdirSync(join(...this.path))
        for (const folder of folders) {
            this.path.push(folder)
            const folderPath = join(...this.path)
            // Skip if this entry is not a directory (safety check)
            if (!statSync(folderPath).isDirectory()) {
                this.path.splice(this.path.indexOf(folder), 1)
                continue
            }
            const assets = readdirSync(folderPath)
            for (const asset of assets) {
                this.path.push(asset)
                const assetPath = join(...this.path)
                // Skip subdirectories (e.g. assets/images/regions/)
                if (statSync(assetPath).isDirectory()) {
                    this.path.splice(this.path.indexOf(asset), 1)
                    continue
                }
                // Skip intro-* videos — served on-demand via VideoService (saves RAM)
                if (asset.startsWith('intro-')) {
                    this.path.splice(this.path.indexOf(asset), 1)
                    continue
                }
                const buffer = readFileSync(assetPath)
                this.client.assets.set(asset.split('.')[0], buffer)
                this.client.log(`Loaded: ${chalk.redBright(asset.split('.')[0])} from ${chalk.blueBright(folder)}`)
                this.path.splice(this.path.indexOf(asset), 1)
            }
            this.path.splice(this.path.indexOf(folder), 1)
        }
        return this.client.log(`Successfully loaded ${chalk.cyanBright(this.client.assets.size)} assets`)
    }

    private path = [__dirname, '..', '..', 'assets']
}

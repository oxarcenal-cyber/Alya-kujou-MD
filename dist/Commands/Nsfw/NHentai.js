"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const nhentai_ts_1 = require("@shineiichijo/nhentai-ts");
const baileys_1 = require("@adiwajshing/baileys");
const Structures_1 = require("../../Structures");
const lib_1 = require("../../lib");
let command = class command extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, args) => {
            args.flags.forEach((flag) => (args.context = args.context.replace(flag, '')));
            args.flags = args.flags.filter((flag) => flag.startsWith('--type=') ||
                flag.startsWith('--get=') ||
                flag.startsWith('--id=') ||
                flag.startsWith('--page='));
            const options = this.getOptions(args.flags);
            const nhentai = new nhentai_ts_1.NHentai();
            switch (options.type) {
                case 'search':
                    return await this.handleSearch(M, args, options, nhentai);
                case 'get':
                    return await this.handleDownload(M, options, nhentai);
            }
        };
        this.handleSearch = async (M, { context }, { page }, nhentai) => {
            const lang = await this.getLang(M);
            if (!context)
                return void M.reply((0, lib_1.t)('nsfw_nh_no_query', lang));
            return await nhentai
                .search(context.trim(), { page })
                .then(async ({ data, pagination }) => {
                const sections = [];
                const paginationRows = [];
                if (pagination != null && pagination.currentPage > 1)
                    paginationRows.push({
                        title: 'Previous Page',
                        rowId: `${this.client.config.prefix}nhentai ${context.trim()} --type=search --page=${pagination.currentPage - 1}`,
                        description: 'Returns to the previous page of the search'
                    });
                if (pagination != null && pagination.hasNextPage)
                    paginationRows.push({
                        title: 'Next Page',
                        rowId: `${this.client.config.prefix}nhentai ${context.trim()} --type=search --page=${pagination.currentPage + 1}`,
                        description: 'Goes to the next page of the search'
                    });
                if (paginationRows.length)
                    sections.push({ title: 'Pagination', rows: paginationRows });
                let text = '';
                data.forEach((content, i) => {
                    const rows = [];
                    rows.push({
                        title: 'Get PDF',
                        rowId: `${this.client.config.prefix}nhentai --type=get --id=${content.id} --get=pdf`
                    }, {
                        title: 'Get ZIP',
                        rowId: `${this.client.config.prefix}nhentai --type=get --id=${content.id} --get=zip`
                    });
                    text += `${i === 0 ? '' : '\n\n'}*#${i + 1}*\n📕 *Title:* ${content.title}\n🌐 *URL: ${content.url.replace('to', 'net')}*`;
                    sections.push({ title: content.title, rows });
                });
                return void (await M.reply(text, 'text', undefined, undefined, undefined, undefined, undefined, undefined, undefined, {
                    sections,
                    buttonText: 'Search Results'
                }));
            })
                .catch(async () => void (await M.reply((0, lib_1.t)('nsfw_nh_not_found', lang, { query: context.trim() }))));
        };
        this.handleDownload = async (M, { id, output }, nhentai) => {
            const lang = await this.getLang(M);
            if (id === '')
                return void M.reply((0, lib_1.t)('nsfw_nh_no_id', lang));
            if (output === '')
                output = 'pdf';
            const valid = await nhentai.validate(id);
            if (!valid)
                return void M.reply((0, lib_1.t)('nsfw_nh_invalid_id', lang, { id }));
            await (0, baileys_1.delay)(1500);
            return await nhentai
                .getDoujin(id)
                .then(async (res) => {
                const { title, originalTitle, cover, url, tags, images, artists } = res;
                const thumbnail = await this.client.utils.getBuffer(cover || 'https://i.imgur.com/uLAimaY.png');
                await M.reply(thumbnail, 'image', undefined, undefined, `📕 *Title:* ${title} *(${originalTitle})*\n✍ *Artists:* ${artists}\n🔖 *Tags:* ${tags
                    .map(this.client.utils.capitalize)
                    .join(', ')}\n📚 *Pages:* ${images.pages.length}`, undefined, {
                    title,
                    body: originalTitle,
                    thumbnail,
                    mediaType: 1,
                    sourceUrl: url.replace('to', 'net')
                });
                const buffer = await images[output === 'zip' ? 'zip' : 'PDF']();
                return void (await M.reply(buffer, 'document', undefined, `application/${output}`, undefined, undefined, undefined, thumbnail, `${title}.${output}`));
            })
                .catch(async () => void (await M.reply((0, lib_1.t)('nsfw_nh_try_again', lang))));
        };
        this.getOptions = (flags) => {
            return {
                type: this.getType(flags),
                page: this.getPage(flags),
                id: this.getID(flags),
                output: this.getOutput(flags)
            };
        };
        this.getType = (flags) => {
            const index = this.getIndex(flags, '--type=');
            if (index < 0 || !['search', 'get'].includes(flags[index].split('=')[1].toLowerCase()))
                return 'search';
            return flags[index].split('=')[1].toLowerCase();
        };
        this.getPage = (flags) => {
            const index = this.getIndex(flags, '--page=');
            if (index < 0 ||
                isNaN(Number(flags[index].split('--page=')[1])) ||
                Number(flags[index].split('--page=')[1]) < 1)
                return 1;
            return Number(flags[index].split('--page=')[1]);
        };
        this.getID = (flags) => {
            const index = this.getIndex(flags, '--id=');
            if (index < 0 || flags[index].split('--id=')[1] === '')
                return '';
            return flags[index].split('--id=')[1];
        };
        this.getOutput = (flags) => {
            const index = this.getIndex(flags, '--get=');
            if (index < 0 || !['zip', 'pdf'].includes(flags[index].split('--get=')[1].toLowerCase()))
                return '';
            return flags[index].split('--get=')[1].toLowerCase();
        };
        this.getIndex = (array, search) => array.findIndex((el) => el.startsWith(search));
    }
};
command = __decorate([
    (0, Structures_1.Command)('nhentai', {
        description: 'Search or download a doujin from nhentai',
        cooldown: 15,
        exp: 40,
        category: 'nsfw',
        aliases: ['doujin', 'doujinshi'],
        usage: 'nhentai [query]'
    })
], command);
exports.default = command;

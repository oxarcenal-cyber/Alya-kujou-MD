"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const lib_1 = require("../../lib");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const lang = await this.getLang(M);
            const prefix = this.client.config.prefix;
            if (!context.trim())
                return void M.reply((0, lib_1.t)('weather_usage', lang, { p: prefix }));
            const city = context.trim();
            try {
                const data = await this.client.utils.fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
                if (!data?.current_condition)
                    return void M.reply((0, lib_1.t)('weather_not_found', lang, { city }));
                const cur = data.current_condition[0];
                const area = data.nearest_area[0];
                const desc = cur.weatherDesc[0].value;
                const emoji = this.getEmoji(desc);
                return void M.reply(`${emoji} *WEATHER REPORT* ${emoji}\n` +
                    `${'─'.repeat(25)}\n` +
                    `📍 *Location:* ${area.areaName[0].value}, ${area.country[0].value}\n` +
                    `${'─'.repeat(25)}\n\n` +
                    `🌡️ *Temperature:* ${cur.temp_C}°C / ${cur.temp_F}°F\n` +
                    `🤔 *Feels Like:* ${cur.FeelsLikeC}°C\n` +
                    `☁️ *Condition:* ${desc}\n` +
                    `💧 *Humidity:* ${cur.humidity}%\n` +
                    `💨 *Wind:* ${cur.windspeedKmph} km/h\n` +
                    `👁️ *Visibility:* ${cur.visibility} km\n` +
                    `☀️ *UV Index:* ${cur.uvIndex}\n` +
                    `${'─'.repeat(25)}\n` +
                    `📢 *How to use:* \`${prefix}weather <city>\``);
            }
            catch {
                return void M.reply((0, lib_1.t)('weather_error', lang, { city }));
            }
        };
        this.getEmoji = (desc) => {
            const d = desc.toLowerCase();
            if (d.includes('rain'))
                return '🌧️';
            if (d.includes('snow'))
                return '❄️';
            if (d.includes('thunder'))
                return '⛈️';
            if (d.includes('cloud'))
                return '☁️';
            if (d.includes('sunny') || d.includes('clear'))
                return '☀️';
            if (d.includes('fog') || d.includes('mist'))
                return '🌫️';
            return '🌤️';
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('weather', {
        description: 'Check live weather of any city 🌤️',
        category: 'utils',
        usage: 'weather <city name>',
        aliases: ['w', 'mausam'],
        cooldown: 10,
        exp: 15,
        dm: true
    })
], default_1);
exports.default = default_1;

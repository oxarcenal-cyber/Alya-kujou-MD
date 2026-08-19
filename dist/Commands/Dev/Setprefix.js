"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const newprefix = context.trim().split(" ")[0].toLowerCase();
            if (!newprefix)
                return void (await M.reply(`Please provide the new prefix.\n\n*Example: ${this.client.config.prefix}setprefix $`));
            this.client.config.prefix = newprefix;
            const text = `*🚥Status:*\n\n✅Successfully changed the prefix to *"${newprefix}"*`;
            M.reply(text);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('setprefix', {
        description: 'Will replace the old prefix with the given term',
        category: 'dev',
        dm: true,
        usage: `setprefix [new_prefix]`,
        exp: 5000
    })
], default_1);
exports.default = default_1;

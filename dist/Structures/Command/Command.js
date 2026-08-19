"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const Command = (name, config) => ((target) => 
//@ts-ignore
class extends target {
    constructor() {
        super(...arguments);
        this.name = name;
        this.config = config;
    }
});
exports.Command = Command;

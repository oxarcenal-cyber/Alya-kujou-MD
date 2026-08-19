"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPersonaName = exports.getPersona = void 0;
const Rias_1 = require("./Rias");
const Alya_1 = require("./Alya");
const Akino_1 = require("./Akino");
const Hinata_1 = require("./Hinata");
const ZeroTwo_1 = require("./ZeroTwo");
const Miku_1 = require("./Miku");
/** Dialogue set for the currently active bot persona */
const getPersona = (persona) => {
    switch (persona) {
        case 'alya': return Alya_1.Alya;
        case 'akino': return Akino_1.Akino;
        case 'hinata': return Hinata_1.Hinata;
        case 'zerotwo': return ZeroTwo_1.ZeroTwo;
        case 'miku': return Miku_1.Miku;
        default: return Rias_1.Rias;
    }
};
exports.getPersona = getPersona;
/** Display name for the currently active bot persona */
const getPersonaName = (persona) => {
    switch (persona) {
        case 'alya': return 'Alya Kujou';
        case 'akino': return 'Akino Himejima';
        case 'hinata': return 'Hinata Hyuga';
        case 'zerotwo': return 'Zero Two';
        case 'miku': return 'Hatsune Miku';
        default: return 'Rias Gremory';
    }
};
exports.getPersonaName = getPersonaName;

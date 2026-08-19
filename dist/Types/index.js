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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupFeatures = void 0;
__exportStar(require("./Config"), exports);
__exportStar(require("./Command"), exports);
__exportStar(require("./Message"), exports);
__exportStar(require("./Pokemon"), exports);
var GroupFeatures;
(function (GroupFeatures) {
    GroupFeatures["events"] = "By enabling this feature, the bot reacts when a member is promoted or demoted";
    GroupFeatures["welcome"] = "By enabling this feature, the bot sends a welcome message when someone joins and a farewell when someone leaves";
    GroupFeatures["wild"] = "By enabling this feature, it will send wild pokemon";
    GroupFeatures["chara"] = "By enabling this feature, it will send collectible cards in the group";
    GroupFeatures["mods"] = "By enabling this feature, it enables the bot to remove the member (except for admins) which sent an invite link of other groups. This will work if and only if the bot's an admin";
    GroupFeatures["nsfw"] = "By enabling this feature, it enables the bot to send *NSFW* contents";
    GroupFeatures["casino"] = "By enabling this feature, casino game commands (coinflip, dice, roulette, slot etc.) will be usable in this group";
    GroupFeatures["birthday"] = "By enabling this feature, the bot announces birthdays of group members in the group";
})(GroupFeatures || (exports.GroupFeatures = GroupFeatures = {}));

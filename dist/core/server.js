"use strict";
/*
 *    Copyright (C) 2021 Mohamed Belkamel
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Affero General Public License as published
 *   by the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Affero General Public License for more details.
 *
 *   You should have received a copy of the GNU Affero General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Discord = void 0;
var discord_js_1 = require("discord.js");
var discord_config_1 = require("../config/discord.config");
var Discord = /** @class */ (function () {
    function Discord(init) {
        var _this = this;
        this.client = new discord_js_1.Client();
        this.client.on('ready', function () {
            var _a;
            console.log('Server count', _this.client.guilds.cache.array().length);
            (_a = _this.client.user) === null || _a === void 0 ? void 0 : _a.setPresence({
                status: 'online',
                activity: {
                    type: 'COMPETING',
                    name: '__help',
                },
            });
            console.log('Ready!');
        });
        this.client.on('message', init.messageHandler);
        this.Login();
    }
    Discord.prototype.Login = function () {
        this.client.login(discord_config_1.token);
    };
    return Discord;
}());
exports.Discord = Discord;

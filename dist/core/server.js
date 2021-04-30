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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Discord = void 0;
var discord_js_1 = require("discord.js");
var discord_config_1 = require("../config/discord.config");
var Sentry = __importStar(require("@sentry/node"));
var Discord = /** @class */ (function () {
    function Discord(init) {
        var _this = this;
        this.client = new discord_js_1.Client();
        this.client.on('ready', function () {
            var _a;
            console.log('Server count', _this.client.guilds.cache.size);
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
        // const Sentry = require('@sentry/node');
        // or use es6 import statements
        // const Tracing = require('@sentry/tracing');
        // or use es6 import statements
        Sentry.init({
            dsn: 'https://abd380ace54d45b69c0fbb409abe5884@o337865.ingest.sentry.io/5742982',
            // Set tracesSampleRate to 1.0 to capture 100%
            // of transactions for performance monitoring.
            // We recommend adjusting this value in production
            tracesSampleRate: 1.0,
        });
        var transaction = Sentry.startTransaction({
            op: 'test',
            name: 'My First Test Transaction',
        });
        setTimeout(function () {
            try {
                console.log('aight');
            }
            catch (e) {
                Sentry.captureException(e);
            }
            finally {
                transaction.finish();
            }
        }, 99);
        this.client.login(discord_config_1.token);
    };
    return Discord;
}());
exports.Discord = Discord;

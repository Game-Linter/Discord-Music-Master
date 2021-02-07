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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordServer = void 0;
var play_core_1 = require("./play-core");
var DiscordServer = /** @class */ (function () {
    function DiscordServer(message, servers, id, url, title) {
        var _this = this;
        this.queue = [];
        this.isAutoplay = false;
        this.isLoop = false;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, error_1;
            var _c;
            var _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, ((_e = (_d = message.member) === null || _d === void 0 ? void 0 : _d.voice.channel) === null || _e === void 0 ? void 0 : _e.join())];
                    case 1:
                        _a.connection = (_f.sent());
                        if (Array.isArray(url)) {
                            (_c = this.queue).push.apply(_c, url);
                        }
                        else {
                            this.queue.push(url);
                        }
                        _b = this;
                        return [4 /*yield*/, play_core_1.play(this.connection, this.queue, id, message, servers, title).catch(function (err) {
                                console.log(err.message);
                                return null;
                            })];
                    case 2:
                        _b.dispatcher = _f.sent();
                        this.setAuto = this.queue[0];
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _f.sent();
                        message.channel.send(error_1.message);
                        delete servers[id];
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); })();
    }
    Object.defineProperty(DiscordServer.prototype, "loop", {
        get: function () {
            return true && this.isLoop;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DiscordServer.prototype, "autoplay", {
        get: function () {
            return true && this.isAutoplay;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DiscordServer.prototype, "getQueue", {
        get: function () {
            return this.queue;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DiscordServer.prototype, "getConnection", {
        get: function () {
            return this.connection;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DiscordServer.prototype, "setDispatcher", {
        set: function (dispatcher) {
            this.dispatcher = dispatcher;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DiscordServer.prototype, "setConnection", {
        set: function (connection) {
            this.connection = connection;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DiscordServer.prototype, "setQueue", {
        set: function (queue) {
            this.queue = queue;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DiscordServer.prototype, "setAuto", {
        set: function (v) {
            this.isAutoplay = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DiscordServer.prototype, "setLoop", {
        set: function (v) {
            this.isLoop = v;
        },
        enumerable: false,
        configurable: true
    });
    return DiscordServer;
}());
exports.DiscordServer = DiscordServer;

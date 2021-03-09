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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var discordServer_1 = require("./core/discordServer");
var get_data_youtube_1 = require("./core/get-data-youtube");
var getCommand_1 = require("./core/getCommand");
var play_core_1 = require("./core/play-core");
var server_1 = require("./core/server");
var get_lyrics_1 = require("./utils/get-lyrics");
var get_spotify_track_1 = require("./utils/get-spotify-track");
var get_token_1 = require("./utils/get-token");
var PREFIX = '__';
var servers = {};
var forbidden = function (message) {
    var _a, _b, _c, _d;
    if (!((_a = message.member) === null || _a === void 0 ? void 0 : _a.voice)) {
        return true;
    }
    return ((_b = message.member) === null || _b === void 0 ? void 0 : _b.voice.channelID) !== ((_d = (_c = message.guild) === null || _c === void 0 ? void 0 : _c.voice) === null || _d === void 0 ? void 0 : _d.channelID);
};
var isBanned = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var bannedUsers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, get_token_1.getAsync('bot:banned')];
            case 1:
                bannedUsers = _a.sent();
                if (bannedUsers) {
                    return [2 /*return*/, JSON.parse(bannedUsers).filter(function (bannedUser) {
                            return bannedUser === id;
                        }).length];
                }
                return [2 /*return*/, 0];
        }
    });
}); };
var messageHandler = function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, command, id_1, _c, msgContent, args_1, _d, tmp_1, first, url_1, title, tmpTitle;
    var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
    return __generator(this, function (_0) {
        switch (_0.label) {
            case 0:
                _a = message.content.startsWith(PREFIX) &&
                    !message.author.bot;
                if (!_a) return [3 /*break*/, 2];
                return [4 /*yield*/, isBanned(message.author.id)];
            case 1:
                _a = !(_0.sent());
                _0.label = 2;
            case 2:
                if (!_a) return [3 /*break*/, 26];
                _b = getCommand_1.getCommand(message, PREFIX), command = _b.command, id_1 = _b.id;
                _c = command;
                switch (_c) {
                    case 'save': return [3 /*break*/, 3];
                    case 'load': return [3 /*break*/, 4];
                    case 'audio': return [3 /*break*/, 5];
                    case 'audionow': return [3 /*break*/, 6];
                    case 'pause': return [3 /*break*/, 7];
                    case 'banfrombot': return [3 /*break*/, 8];
                    case 'unbanfrombot': return [3 /*break*/, 9];
                    case 'restart': return [3 /*break*/, 10];
                    case 'shuffle': return [3 /*break*/, 11];
                    case 'resume': return [3 /*break*/, 12];
                    case 'fuckoff': return [3 /*break*/, 13];
                    case 'skip': return [3 /*break*/, 14];
                    case 'loop': return [3 /*break*/, 15];
                    case 'autoplay': return [3 /*break*/, 16];
                    case 'lyrics': return [3 /*break*/, 17];
                    case 'next': return [3 /*break*/, 18];
                    case 'help': return [3 /*break*/, 24];
                }
                return [3 /*break*/, 25];
            case 3:
                (function () { return __awaiter(void 0, void 0, void 0, function () {
                    var msgContent, args, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                msgContent = message.content
                                    .trim()
                                    .replace(/\s+/g, ' ');
                                args = msgContent.split(' ');
                                if (!args[1] || !args[2]) {
                                    return [2 /*return*/, message.channel.send('Give a playlist name and a link')];
                                }
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, get_token_1.setPlaylist(message, args[1], args[2])];
                            case 2:
                                _a.sent();
                                message.channel.send('Playlist save for this guild with the name ' +
                                    '`' +
                                    args[1] +
                                    '`');
                                return [3 /*break*/, 4];
                            case 3:
                                error_1 = _a.sent();
                                message.channel.send(error_1.message);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); })();
                return [2 /*return*/];
            case 4:
                if (!((_e = message.member) === null || _e === void 0 ? void 0 : _e.voice.channelID)) {
                    return [2 /*return*/, message.channel.send('Connect to a channel first')];
                }
                msgContent = message.content.trim().replace(/\s+/g, ' ');
                args_1 = msgContent.split(' ');
                if (!args_1[1]) {
                    return [2 /*return*/, message.channel.send('Give a playlist name')];
                }
                (function () { return __awaiter(void 0, void 0, void 0, function () {
                    var pl;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, get_token_1.loadPlaylist(message, args_1[1])];
                            case 1:
                                pl = _b.sent();
                                if (pl) {
                                    if (!servers[id_1]) {
                                        servers[id_1] = new discordServer_1.DiscordServer(message, servers, id_1, pl);
                                    }
                                    else {
                                        if (forbidden(message)) {
                                            message.channel.send('get into a channel first');
                                            return [2 /*return*/];
                                        }
                                        if (Array.isArray(pl)) {
                                            (_a = servers[id_1].queue).push.apply(_a, pl);
                                        }
                                        else {
                                            servers[id_1].queue.push(pl);
                                        }
                                        message.channel.send('Queud the playlist ' + args_1[1]);
                                    }
                                }
                                return [2 /*return*/];
                        }
                    });
                }); })();
                return [3 /*break*/, 26];
            case 5:
                if ((_f = message.member) === null || _f === void 0 ? void 0 : _f.voice.channelID) {
                    (function () { return __awaiter(void 0, void 0, void 0, function () {
                        var msgContent, args, _a, url, title;
                        var _b;
                        var _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    msgContent = message.content
                                        .trim()
                                        .replace(/\s+/g, ' ');
                                    args = msgContent.split(' ');
                                    if (!args[1]) {
                                        return [2 /*return*/, message.channel.send('Give a link or a youtube search')];
                                    }
                                    return [4 /*yield*/, get_data_youtube_1.getData(args[1], message).catch(function (err) {
                                            console.log(err);
                                            return {
                                                url: '',
                                                title: '',
                                            };
                                        })];
                                case 1:
                                    _a = _e.sent(), url = _a.url, title = _a.title;
                                    try {
                                        if (!servers[id_1]) {
                                            servers[id_1] = new discordServer_1.DiscordServer(message, servers, id_1, url, title);
                                        }
                                        else {
                                            if (forbidden(message)) {
                                                return [2 /*return*/, message.channel.send('Get into the same channel as the bot')];
                                            }
                                            if (Array.isArray(url)) {
                                                (_c = servers[id_1]) === null || _c === void 0 ? void 0 : (_b = _c.queue).push.apply(_b, url);
                                            }
                                            else {
                                                (_d = servers[id_1]) === null || _d === void 0 ? void 0 : _d.queue.push(url);
                                            }
                                            message.react('🦆');
                                            title &&
                                                message.channel.send("Queued | " + title);
                                        }
                                        // console.log(connection);
                                    }
                                    catch (error) {
                                        console.log(error.message);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })();
                }
                else {
                    message.channel.send('Connect to a channel first');
                }
                return [3 /*break*/, 26];
            case 6:
                (function () { return __awaiter(void 0, void 0, void 0, function () {
                    var msgContent, args, _a, url, title, _b, tobeShifted, rest, _c;
                    var _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                msgContent = message.content
                                    .trim()
                                    .replace(/\s+/g, ' ');
                                args = msgContent.split(' ');
                                if (!args[1]) {
                                    return [2 /*return*/, message.channel.send('Give a link or a youtube search')];
                                }
                                return [4 /*yield*/, get_data_youtube_1.getData(args[1], message).catch(function (err) {
                                        console.log(err);
                                        return {
                                            url: '',
                                            title: '',
                                        };
                                    })];
                            case 1:
                                _a = _e.sent(), url = _a.url, title = _a.title;
                                if (forbidden(message)) {
                                    return [2 /*return*/, message.channel.send('Use "__audio" first to play a song')];
                                }
                                _b = servers[id_1].getQueue, tobeShifted = _b[0], rest = _b.slice(1);
                                if (Array.isArray(url)) {
                                    rest.unshift.apply(rest, url);
                                }
                                else {
                                    rest.unshift(url);
                                }
                                servers[id_1].setQueue = __spreadArrays(rest);
                                message.react('🦆');
                                title && message.channel.send("Next | " + title);
                                _c = servers[id_1];
                                return [4 /*yield*/, play_core_1.play((_d = servers[id_1]) === null || _d === void 0 ? void 0 : _d.getConnection, servers[id_1].getQueue, id_1, message, servers).catch(function (err) {
                                        console.log(err.message);
                                        return null;
                                    })];
                            case 2:
                                _c.dispatcher = _e.sent();
                                return [2 /*return*/];
                        }
                    });
                }); })();
                return [3 /*break*/, 26];
            case 7:
                if (forbidden(message)) {
                    return [2 /*return*/, message.channel.send('Get into the same channel as the bot')];
                }
                message.react('⏸');
                (_h = (_g = servers[id_1]) === null || _g === void 0 ? void 0 : _g.dispatcher) === null || _h === void 0 ? void 0 : _h.pause();
                return [3 /*break*/, 26];
            case 8:
                (function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, userId, bannedUser, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                if (message.author.id !== '563804458526441639') {
                                    return [2 /*return*/, message.reply("You're not allowed to ban users from bot")];
                                }
                                _a = message.content
                                    .trim()
                                    .replace(/\s+/g, ' ')
                                    .split(' '), userId = _a[1];
                                return [4 /*yield*/, get_token_1.getAsync('bot:banned')];
                            case 1:
                                bannedUser = _d.sent();
                                if (!(userId !== '563804458526441639')) return [3 /*break*/, 7];
                                if (!bannedUser) return [3 /*break*/, 3];
                                return [4 /*yield*/, get_token_1.setBannedUser('bot:banned', JSON.stringify(__spreadArrays(JSON.parse(bannedUser), [
                                        userId,
                                    ])))];
                            case 2:
                                _d.sent();
                                return [3 /*break*/, 5];
                            case 3: return [4 /*yield*/, get_token_1.setBannedUser('bot:banned', JSON.stringify([userId]))];
                            case 4:
                                _d.sent();
                                _d.label = 5;
                            case 5:
                                _c = (_b = message.channel).send;
                                return [4 /*yield*/, client.users.fetch(userId)];
                            case 6:
                                _c.apply(_b, [(_d.sent()).username + " banned"]);
                                _d.label = 7;
                            case 7: return [2 /*return*/];
                        }
                    });
                }); })();
                return [3 /*break*/, 26];
            case 9:
                (function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, userId, bannedUser, bannedArr, newBannedArr;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (message.author.id !== '563804458526441639') {
                                    return [2 /*return*/, message.reply("You're not allowed to ban users from bot")];
                                }
                                _a = message.content
                                    .trim()
                                    .replace(/\s+/g, ' ')
                                    .split(' '), userId = _a[1];
                                return [4 /*yield*/, get_token_1.getAsync('bot:banned')];
                            case 1:
                                bannedUser = _b.sent();
                                if (bannedUser) {
                                    bannedArr = JSON.parse(bannedUser);
                                    newBannedArr = bannedArr.filter(function (bannedusr) {
                                        return bannedusr !== userId;
                                    });
                                    get_token_1.setBannedUser('bot:banned', JSON.stringify(newBannedArr)).then(function (res) { return __awaiter(void 0, void 0, void 0, function () {
                                        var _a, _b, _c;
                                        return __generator(this, function (_d) {
                                            switch (_d.label) {
                                                case 0:
                                                    _b = (_a = message.channel).send;
                                                    _c = "Unbanned ";
                                                    return [4 /*yield*/, client.users.fetch(userId)];
                                                case 1:
                                                    _b.apply(_a, [_c + (_d.sent()).username]);
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                }
                                return [2 /*return*/];
                        }
                    });
                }); })();
                return [3 /*break*/, 26];
            case 10:
                if (forbidden(message)) {
                    return [2 /*return*/, message.channel.send('Get into the same channel as the bot')];
                }
                message.react('🦎');
                (function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _a = servers[id_1];
                                return [4 /*yield*/, play_core_1.play((_b = servers[id_1]) === null || _b === void 0 ? void 0 : _b.getConnection, (_c = servers[id_1]) === null || _c === void 0 ? void 0 : _c.getQueue, id_1, message, servers).catch(function (err) {
                                        console.log(err.message);
                                        return null;
                                    })];
                            case 1:
                                _a.dispatcher = _d.sent();
                                return [2 /*return*/];
                        }
                    });
                }); })();
                return [3 /*break*/, 26];
            case 11:
                if (forbidden(message)) {
                    return [2 /*return*/, message.channel.send('Get into the same channel as the bot')];
                }
                message.react('🔀');
                _d = ((_j = servers[id_1]) === null || _j === void 0 ? void 0 : _j.getQueue) || [], tmp_1 = _d.slice(1);
                (function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                tmp_1.length && (tmp_1 = lodash_1.default.shuffle(tmp_1));
                                _a = servers[id_1];
                                return [4 /*yield*/, play_core_1.play((_b = servers[id_1]) === null || _b === void 0 ? void 0 : _b.getConnection, tmp_1, id_1, message, servers).catch(function (err) {
                                        console.log(err.message);
                                        return null;
                                    })];
                            case 1:
                                _a.dispatcher = _c.sent();
                                return [2 /*return*/];
                        }
                    });
                }); })();
                return [3 /*break*/, 26];
            case 12:
                if (forbidden(message)) {
                    return [2 /*return*/, message.channel.send('Get into the same channel as the bot')];
                }
                message.react('⏯');
                // dispatcher[id]?.resume();
                (_l = (_k = servers[id_1]) === null || _k === void 0 ? void 0 : _k.dispatcher) === null || _l === void 0 ? void 0 : _l.resume();
                return [3 /*break*/, 26];
            case 13:
                if (forbidden(message)) {
                    return [2 /*return*/, message.channel.send('Get into the same channel as the bot')];
                }
                message.react('🙋‍♂️');
                (_o = (_m = servers[id_1]) === null || _m === void 0 ? void 0 : _m.getConnection) === null || _o === void 0 ? void 0 : _o.disconnect();
                delete servers[id_1];
                return [3 /*break*/, 26];
            case 14:
                if (forbidden(message)) {
                    return [2 /*return*/, message.channel.send('Get into the same channel as the bot')];
                }
                if (!((_p = servers[id_1]) === null || _p === void 0 ? void 0 : _p.loop)) {
                    (_r = (_q = servers[id_1]) === null || _q === void 0 ? void 0 : _q.queue) === null || _r === void 0 ? void 0 : _r.shift();
                    first = (((_s = servers[id_1]) === null || _s === void 0 ? void 0 : _s.getQueue) || [])[0];
                    if (first && ((_t = servers[id_1]) === null || _t === void 0 ? void 0 : _t.autoplay)) {
                        servers[id_1].setAuto = first;
                    }
                }
                (function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _a = servers[id_1];
                                return [4 /*yield*/, play_core_1.play((_b = servers[id_1]) === null || _b === void 0 ? void 0 : _b.getConnection, (_c = servers[id_1]) === null || _c === void 0 ? void 0 : _c.getQueue, id_1, message, servers).catch(function (err) {
                                        console.log(err.message);
                                        return null;
                                    })];
                            case 1:
                                _a.dispatcher = _d.sent();
                                return [2 /*return*/];
                        }
                    });
                }); })();
                return [3 /*break*/, 26];
            case 15:
                if (forbidden(message)) {
                    return [2 /*return*/, message.channel.send('Get into the same channel as the bot')];
                }
                servers[id_1].setLoop = ((_u = servers[id_1]) === null || _u === void 0 ? void 0 : _u.loop) ? false
                    : (_v = servers[id_1]) === null || _v === void 0 ? void 0 : _v.getQueue[0];
                message.react('♾');
                ((_w = servers[id_1]) === null || _w === void 0 ? void 0 : _w.loop) ? (function () { return __awaiter(void 0, void 0, void 0, function () {
                    var ttl, title_1, _a, title;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                ttl = servers[id_1].loop;
                                if (!ttl.startsWith(get_data_youtube_1.SPOTIFY_URI)) return [3 /*break*/, 3];
                                _a = get_spotify_track_1.getSpotifyTrack;
                                return [4 /*yield*/, get_token_1.getAccessToken()];
                            case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent(), ttl])];
                            case 2:
                                title_1 = (_b.sent()).title;
                                title_1 &&
                                    message.channel.send("Now looping forever | " + title_1);
                                return [2 /*return*/];
                            case 3: return [4 /*yield*/, play_core_1.getTitleYoutube(ttl)];
                            case 4:
                                title = _b.sent();
                                title &&
                                    message.channel.send("Now looping forever | " + title);
                                return [2 /*return*/];
                        }
                    });
                }); })()
                    : message.channel.send("Loop is now off");
                return [3 /*break*/, 26];
            case 16:
                if (forbidden(message)) {
                    return [2 /*return*/, message.channel.send('Get into the same channel as the bot')];
                }
                servers[id_1].setAuto = ((_x = servers[id_1]) === null || _x === void 0 ? void 0 : _x.autoplay) ? false
                    : (_y = servers[id_1]) === null || _y === void 0 ? void 0 : _y.getQueue[0];
                message.react('🤖');
                ((_z = servers[id_1]) === null || _z === void 0 ? void 0 : _z.autoplay) ? message.channel.send('AUTOPLAY in now on')
                    : message.channel.send('AUTOPLAY in now off');
                // console.log(id, autoplay[id]);
                return [3 /*break*/, 26];
            case 17:
                if (forbidden(message)) {
                    return [2 /*return*/, message.channel.send('Get into the same channel as the bot')];
                }
                url_1 = servers[id_1].getQueue[0];
                (function () { return __awaiter(void 0, void 0, void 0, function () {
                    var lyrics;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, get_lyrics_1.getLyrics(url_1)];
                            case 1:
                                lyrics = (_a.sent());
                                // console.log(lyrics.length);
                                if (lyrics) {
                                    return [2 /*return*/, message.channel.send("```\n" + lyrics + "\n```")];
                                }
                                return [2 /*return*/, message.channel.send('Lyrics not found this song')];
                        }
                    });
                }); })();
                return [3 /*break*/, 26];
            case 18:
                if (forbidden(message)) {
                    return [2 /*return*/, message.channel.send('Connect to the same channel as the bot')];
                }
                if (!(servers[id_1].getQueue.length > 1)) return [3 /*break*/, 23];
                return [4 /*yield*/, get_data_youtube_1.getData(servers[id_1].getQueue[1], message)];
            case 19:
                title = (_0.sent()).title;
                if (!title) return [3 /*break*/, 20];
                return [2 /*return*/, message.channel.send("Up next: " + title)];
            case 20: return [4 /*yield*/, play_core_1.getTitleYoutube(servers[id_1].getQueue[1])];
            case 21:
                tmpTitle = _0.sent();
                return [2 /*return*/, message.channel.send("Up next: " + tmpTitle)];
            case 22: return [3 /*break*/, 24];
            case 23: return [2 /*return*/, message.channel.send('Nothing next, autoplay to the save')];
            case 24:
                message.channel.send("\n\t\t\t\t\t  \t```\n__audio [any Youtube Search]\n__audio [youtube Url]\n__audio [youtube Playlist url]\n__audio [spotify Track Link]\n__audio [spotify Playlist Link]\n__audio [spotify Album Link]\n__audionow  [input] (Plays the given track instantly even tho the queue is full,  continues the queue afterwards)\n__load [saved playlist name]\n__save [nameofplaylist] [playlist link]\n__restart (restarts current track)\n__lyrics (Gets lyrics of current playing song)\n__skip (Skip current track)\n__pause\n__resume \n__fuckoff (Quit)\n__loop (Loop current Song )\n__autoplay (Toogle autoplay, Keep Playing recommended songs after the queue is done)\n__shuffle (Shuffle Current Queue)\n\nFull Readme: https://github.com/Game-Linter/Discord-Music-Master#readme\n\t\t\t\t\t\t```\n\t\t\t\t");
                return [3 /*break*/, 26];
            case 25: return [3 /*break*/, 26];
            case 26: return [2 /*return*/];
        }
    });
}); };
var client = new server_1.Discord({
    messageHandler: messageHandler,
}).client;
client.on('voiceStateUpdate', function (arg0, arg1) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    // console.log('triggered');
    var oldGuildID = (_a = arg0.channel) === null || _a === void 0 ? void 0 : _a.guild.id;
    var newGuildID = (_b = arg1.channel) === null || _b === void 0 ? void 0 : _b.guild.id;
    if (((_c = arg0.member) === null || _c === void 0 ? void 0 : _c.id) === ((_d = client.user) === null || _d === void 0 ? void 0 : _d.id)) {
        // Triggered by something happened to the bot
        console.log({
            old: (_e = arg0.channel) === null || _e === void 0 ? void 0 : _e.members.array().map(function (vl) { return vl.user.id; }),
            new: (_f = arg1.channel) === null || _f === void 0 ? void 0 : _f.members.array().map(function (va) { return va.user.id; }),
        });
        if (((_g = arg1.channel) === null || _g === void 0 ? void 0 : _g.members.array().length) && ((_h = arg1.channel) === null || _h === void 0 ? void 0 : _h.members.array().every(function (member) { return member.user.id === client.user.id; })) &&
            newGuildID) {
            console.log('Moved to an empty channel');
            (_j = servers[newGuildID]) === null || _j === void 0 ? void 0 : _j.getConnection.disconnect();
            delete servers[newGuildID];
        }
        if (!newGuildID && oldGuildID && servers[oldGuildID]) {
            console.log('deleted');
            delete servers[oldGuildID];
        }
    }
    else {
        // Triggered by other people
        var Members = (_k = arg0.channel) === null || _k === void 0 ? void 0 : _k.members.array();
        if ((Members === null || Members === void 0 ? void 0 : Members.length) && (Members === null || Members === void 0 ? void 0 : Members.every(function (member) { var _a; return member.user.id === ((_a = client.user) === null || _a === void 0 ? void 0 : _a.id); }))) {
            var glId = (_l = arg0.channel) === null || _l === void 0 ? void 0 : _l.guild.id;
            (_m = servers[glId]) === null || _m === void 0 ? void 0 : _m.getConnection.disconnect();
            delete servers[glId];
        }
    }
});
var signHandler = function () {
    var srvs = Object.keys(servers);
    srvs.forEach(function (srv) {
        var element = servers[srv];
        element === null || element === void 0 ? void 0 : element.getConnection.disconnect();
    });
    process.exit();
};
process.on('SIGINT', signHandler);
process.on('SIGTERM', signHandler);
// process.on('uncaughtException', signHandler);
// process.on('unhandledRejection', signHandler);

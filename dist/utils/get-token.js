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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = exports.loadPlaylist = exports.setPlaylist = exports.setBannedUser = exports.getAsync = void 0;
var qs_1 = __importDefault(require("qs"));
var util_1 = require("util");
var base_spotify_config_1 = require("../config/base-spotify.config");
var get_data_youtube_1 = require("../core/get-data-youtube");
var redis_server_1 = require("../core/redis.server");
var axios_instance_1 = require("./axios-instance");
exports.getAsync = util_1.promisify(redis_server_1.redisClient.get).bind(redis_server_1.redisClient);
var setAsync = util_1.promisify(redis_server_1.redisClient.setex).bind(redis_server_1.redisClient);
var setPlAsync = util_1.promisify(redis_server_1.redisClient.set).bind(redis_server_1.redisClient);
exports.setBannedUser = util_1.promisify(redis_server_1.redisClient.set).bind(redis_server_1.redisClient);
var setPlaylist = function (message, playlistName, playlistLink) { return __awaiter(void 0, void 0, void 0, function () {
    var url, tbll, arr;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, get_data_youtube_1.getData(playlistLink, message)];
            case 1:
                url = (_c.sent()).url;
                if (url === '') {
                    throw Error('Playlist type not supported');
                }
                return [4 /*yield*/, exports.getAsync(message.guild.id)];
            case 2:
                tbll = _c.sent();
                if (!tbll) return [3 /*break*/, 4];
                arr = Object.keys(JSON.parse(tbll));
                if (arr.includes(playlistName)) {
                    throw Error('Playlist already exists by this name');
                }
                return [4 /*yield*/, setPlAsync(message.guild.id, JSON.stringify(__assign(__assign({}, JSON.parse(tbll)), (_a = {}, _a[playlistName.trim()] = url, _a))))];
            case 3:
                _c.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, setPlAsync(message.guild.id, JSON.stringify((_b = {},
                    _b[playlistName.trim()] = url,
                    _b)))];
            case 5:
                _c.sent();
                _c.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.setPlaylist = setPlaylist;
var loadPlaylist = function (message, playlistName) { return __awaiter(void 0, void 0, void 0, function () {
    var data, jsonData, arr;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.getAsync(message.guild.id)];
            case 1:
                data = _a.sent();
                if (data) {
                    jsonData = JSON.parse(data);
                    arr = Object.keys(jsonData);
                    if (arr.includes(playlistName)) {
                        return [2 /*return*/, jsonData[playlistName]];
                    }
                    else {
                        message.channel.send('No playlist found with this name, these are the playlists found:');
                        message.channel.send("`" + arr.join(' | ') + "`");
                        return [2 /*return*/, null];
                    }
                }
                else {
                    message.channel.send('No playlist found for this server');
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.loadPlaylist = loadPlaylist;
var getAccessToken = function () { return __awaiter(void 0, void 0, void 0, function () {
    var aatoken, findToken, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                aatoken = '';
                findToken = null;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, exports.getAsync('redis:token')];
            case 2:
                findToken = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.log(error_1.message);
                return [3 /*break*/, 4];
            case 4:
                if (!findToken) return [3 /*break*/, 5];
                aatoken = findToken;
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, axios_instance_1.tokenAx
                    .post('/api/token', qs_1.default.stringify({
                    grant_type: 'client_credentials',
                }), {
                    headers: {
                        Authorization: "Basic " + base_spotify_config_1.BASE,
                    },
                })
                    .then(function (_res) {
                    (function () { return __awaiter(void 0, void 0, void 0, function () {
                        var error_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, setAsync('redis:token', 3590, _res.data.access_token)];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_2 = _a.sent();
                                    console.log(error_2.message);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })();
                    return _res.data.access_token;
                })];
            case 6:
                aatoken = _a.sent();
                _a.label = 7;
            case 7: return [2 /*return*/, aatoken];
        }
    });
}); };
exports.getAccessToken = getAccessToken;

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getData = exports.SPOTIFY_URI = void 0;
var query_string_1 = require("query-string");
var validator_1 = __importDefault(require("validator"));
var ytdl_core_discord_1 = require("ytdl-core-discord");
var ytpl_1 = __importDefault(require("ytpl"));
var ytsr_1 = __importDefault(require("ytsr"));
var get_album_spotify_1 = require("../utils/get-album-spotify");
var get_playlist_1 = require("../utils/get-playlist");
var get_spotify_track_1 = require("../utils/get-spotify-track");
var get_token_1 = require("../utils/get-token");
exports.SPOTIFY_URI = 'https://open.spotify.com';
var getData = function (urlOrQuery, message) {
    if (validator_1.default.isURL(urlOrQuery) && urlOrQuery.startsWith(exports.SPOTIFY_URI)) {
        return (function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, type_1, itemId_1, aatoken_1, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = urlOrQuery.split('/'), type_1 = _a[3], itemId_1 = _a[4];
                        if (itemId_1.indexOf('?') !== -1) {
                            itemId_1 = itemId_1.slice(0, itemId_1.indexOf('?'));
                        }
                        return [4 /*yield*/, get_token_1.getAccessToken()];
                    case 1:
                        aatoken_1 = _b.sent();
                        return [2 /*return*/, (function () { return __awaiter(void 0, void 0, void 0, function () {
                                var _a, title, loading, trackUrls, albumTracks;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _a = type_1;
                                            switch (_a) {
                                                case 'track': return [3 /*break*/, 1];
                                                case 'playlist': return [3 /*break*/, 3];
                                                case 'album': return [3 /*break*/, 7];
                                            }
                                            return [3 /*break*/, 9];
                                        case 1: return [4 /*yield*/, get_spotify_track_1.getSpotifyTrack(aatoken_1, urlOrQuery)];
                                        case 2:
                                            title = (_b.sent()).title;
                                            return [2 /*return*/, { url: urlOrQuery, title: title }];
                                        case 3:
                                            loading = message.channel.send('Loading playlist');
                                            return [4 /*yield*/, get_playlist_1.getPlaylistSpotify(type_1, itemId_1, aatoken_1)];
                                        case 4:
                                            trackUrls = _b.sent();
                                            return [4 /*yield*/, loading];
                                        case 5: return [4 /*yield*/, (_b.sent()).edit('Playlist Loaded')];
                                        case 6:
                                            _b.sent();
                                            return [2 /*return*/, { url: trackUrls }];
                                        case 7: return [4 /*yield*/, get_album_spotify_1.getAlbumSpotify(type_1, itemId_1, aatoken_1)];
                                        case 8:
                                            albumTracks = _b.sent();
                                            return [2 /*return*/, { url: albumTracks }];
                                        case 9: return [2 /*return*/, {
                                                url: '',
                                                title: '',
                                            }];
                                    }
                                });
                            }); })()];
                    case 2:
                        error_1 = _b.sent();
                        console.log(error_1.message);
                        return [2 /*return*/, {
                                url: '',
                                title: '',
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
    }
    if (validator_1.default.isURL(urlOrQuery) && urlOrQuery.indexOf('list=') !== -1) {
        return (function () { return __awaiter(void 0, void 0, void 0, function () {
            var list, plId, items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        list = query_string_1.parseUrl(urlOrQuery).query.list;
                        plId = list;
                        return [4 /*yield*/, ytpl_1.default(plId)
                                .then(function (res) {
                                return res.items.map(function (item) {
                                    return item.shortUrl;
                                });
                            })
                                .catch(function (err) {
                                message.channel.send(err.message);
                                return '';
                            })];
                    case 1:
                        items = _a.sent();
                        return [2 /*return*/, {
                                url: items,
                            }];
                }
            });
        }); })();
    }
    if (validator_1.default.isURL(urlOrQuery)) {
        return (function () { return __awaiter(void 0, void 0, void 0, function () {
            var title;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ytdl_core_discord_1.getInfo(urlOrQuery).then(function (info) { return info.videoDetails.title; })];
                    case 1:
                        title = _a.sent();
                        return [2 /*return*/, {
                                url: urlOrQuery,
                                title: title,
                            }];
                }
            });
        }); })();
    }
    return (function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, tmp, _b, url, title;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = message.content.trim().split(' '), tmp = _a.slice(1);
                    return [4 /*yield*/, ytsr_1.default(tmp.join(' '), {
                            limit: 1,
                            pages: 1,
                        })
                            .then(function (res) { return res.items[0]; })
                            .catch(function (err) {
                            console.log(err.message);
                            return {
                                url: '',
                            };
                        })];
                case 1:
                    _b = _c.sent(), url = _b.url, title = _b.title;
                    return [2 /*return*/, {
                            url: url,
                            title: title,
                        }];
            }
        });
    }); })();
};
exports.getData = getData;

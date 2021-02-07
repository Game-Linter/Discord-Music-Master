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
exports.getLyrics = void 0;
var lyrics_parse_1 = __importDefault(require("lyrics-parse"));
var ytdl_core_1 = require("ytdl-core");
var get_data_youtube_1 = require("../core/get-data-youtube");
var get_spotify_track_1 = require("./get-spotify-track");
var get_token_1 = require("./get-token");
var getLyrics = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var search, _a, _b, title_1, author_1, _c, title, author, lyrics;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!url.startsWith(get_data_youtube_1.SPOTIFY_URI)) return [3 /*break*/, 4];
                _a = get_spotify_track_1.getSpotifyTrack;
                return [4 /*yield*/, get_token_1.getAccessToken()];
            case 1: return [4 /*yield*/, _a.apply(void 0, [_d.sent(), url])];
            case 2:
                search = (_d.sent()).search;
                _b = search.split(' '), title_1 = _b[0], author_1 = _b[1];
                return [4 /*yield*/, lyrics_parse_1.default(title_1, author_1)];
            case 3: return [2 /*return*/, (_d.sent()).slice(0, 1980)];
            case 4: return [4 /*yield*/, ytdl_core_1.getInfo(url).then(function (res) {
                    return [res.videoDetails.title, res.videoDetails.author];
                })];
            case 5:
                _c = _d.sent(), title = _c[0], author = _c[1];
                return [4 /*yield*/, lyrics_parse_1.default(title, author)];
            case 6:
                lyrics = (_d.sent());
                if (lyrics) {
                    return [2 /*return*/, lyrics.slice(0, 1980)];
                }
                else {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.getLyrics = getLyrics;

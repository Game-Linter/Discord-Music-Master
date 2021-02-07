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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenAx = exports.ax = void 0;
var axios_1 = __importDefault(require("axios"));
exports.ax = axios_1.default.create({
    baseURL: 'https://api.spotify.com/v1',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
});
exports.tokenAx = axios_1.default.create({
    baseURL: 'https://accounts.spotify.com',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
});

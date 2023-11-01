"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const rest_1 = require("@octokit/rest");
// Initialize GitHub client
const octokit = new rest_1.Octokit({
    auth: process.env.GITHUB_PAT,
});
// Set up api
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '75mb' }));
app.use(express_1.default.urlencoded({ limit: '75mb', extended: true }));
app.get('/', (_req, res) => res.status(200).json({ "data": "Hello World! API is up :)" }));
function formatDate(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1; // Add 1 because months are zero-indexed
    let day = date.getDate();
    // Ensuring two digits for month and day
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    return `${year}${month}${day}`;
}
const matrix = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 10, 1, 1, 10, 1, 10, 10, 10, 1, 10, 1, 1, 1, 10, 1, 1, 1, 1, 10, 10, 1, 1, 1, 1, 10, 1, 1, 1, 10, 1, 1, 10, 10, 1, 1, 10, 10, 1, 1, 10, 1, 1, 1, 10, 10, 1, 1, 10, 1, 10, 1, 10],
    [1, 10, 1, 1, 10, 1, 10, 1, 1, 1, 10, 1, 1, 1, 10, 1, 1, 1, 10, 1, 1, 10, 1, 1, 1, 10, 1, 1, 1, 10, 1, 10, 1, 1, 10, 1, 10, 1, 10, 1, 10, 1, 1, 1, 10, 1, 10, 1, 10, 1, 10, 1, 10],
    [1, 10, 10, 10, 10, 1, 10, 10, 1, 1, 10, 1, 1, 1, 10, 1, 1, 1, 10, 1, 1, 10, 1, 1, 1, 10, 1, 1, 1, 10, 1, 10, 1, 1, 10, 1, 10, 10, 1, 1, 10, 1, 1, 1, 10, 1, 10, 1, 10, 1, 10, 1, 10],
    [1, 10, 1, 1, 10, 1, 10, 1, 1, 1, 10, 1, 1, 1, 10, 1, 1, 1, 10, 1, 1, 10, 1, 1, 1, 10, 1, 10, 1, 10, 1, 10, 1, 1, 10, 1, 10, 1, 10, 1, 10, 1, 1, 1, 10, 1, 10, 1, 10, 1, 10, 1, 10],
    [1, 10, 1, 1, 10, 1, 10, 1, 1, 1, 10, 1, 1, 1, 10, 1, 1, 1, 10, 1, 1, 10, 1, 1, 1, 10, 1, 10, 1, 10, 1, 10, 1, 1, 10, 1, 10, 1, 10, 1, 10, 1, 1, 1, 10, 1, 10, 1, 1, 1, 1, 1, 1],
    [1, 10, 1, 1, 10, 1, 10, 10, 10, 1, 10, 10, 10, 1, 10, 10, 10, 1, 1, 10, 10, 1, 1, 1, 1, 1, 10, 10, 10, 1, 1, 1, 10, 10, 1, 1, 10, 1, 10, 1, 10, 10, 10, 1, 10, 10, 1, 1, 10, 1, 10, 1, 10]
];
function getWeeksSinceDate(year, month, day) {
    const startDate = new Date(year, month - 1, day); // Note: month is 0-based in JavaScript
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - startDate.getTime();
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24); // Convert milliseconds to days
    return Math.floor(daysDiff / 7);
}
app.post('/hit', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const rowInd = now.getDay();
    const colInd = getWeeksSinceDate(2023, 10, 29) % 52;
    try {
        for (let i = 1; i <= matrix[rowInd][colInd]; i++) {
            const filePath = `data/${formatDate(new Date())}_${i}.txt`;
            const buffer = Buffer.from(`Hello World! ${rowInd} + ${colInd}`, 'utf8');
            const encodedContent = buffer.toString('base64');
            // Create or update file
            yield octokit.repos.createOrUpdateFileContents({
                owner: process.env.GITHUB_USERNAME,
                repo: process.env.GITHUB_REPOSITORY,
                path: filePath,
                message: `Create or update ${filePath}`,
                content: encodedContent
            });
        }
        res.json({ message: 'Files created or updated' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error in creating or updating files', error: error });
    }
}));
exports.default = app;
//# sourceMappingURL=index.js.map
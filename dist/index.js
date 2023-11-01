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
app.post('/hit', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = `data/${"test"}.txt`;
    try {
        const buffer = Buffer.from("Hello World!", 'utf8');
        const encodedContent = buffer.toString('base64');
        // Create file if it does not exist
        const response = yield octokit.repos.createOrUpdateFileContents({
            owner: process.env.GITHUB_USERNAME,
            repo: process.env.GITHUB_REPOSITORY,
            path: filePath,
            message: `Create ${filePath}`,
            content: encodedContent
        });
        res.json({ message: 'File created', data: response.data });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating file', error: error });
    }
}));
exports.default = app;
//# sourceMappingURL=index.js.map
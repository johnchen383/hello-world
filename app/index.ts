import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { Octokit } from '@octokit/rest';

// Initialize GitHub client
const octokit = new Octokit({
    auth: process.env.GITHUB_PAT,
});

// Set up api
const app = express();

app.use(cors());
app.use(express.json({ limit: '75mb' }));
app.use(express.urlencoded({ limit: '75mb', extended: true }));

app.get('/', (_req, res) => res.status(200).json({ "data": "Hello World! API is up :)" }));

function formatDate(date: any) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1; // Add 1 because months are zero-indexed
    let day = date.getDate();

    // Ensuring two digits for month and day
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    return `${year}${month}${day}`;
}

const matrix: number[][] = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,10,1,1,10,1,10,10,10,1,10,1,1,1,10,1,1,1,1,10,10,1,1,1,1,10,1,1,1,10,1,1,10,10,1,1,10,10,1,1,10,1,1,1,10,10,1,1,10,1,10,1,10],
    [1,10,1,1,10,1,10,1,1,1,10,1,1,1,10,1,1,1,10,1,1,10,1,1,1,10,1,1,1,10,1,10,1,1,10,1,10,1,10,1,10,1,1,1,10,1,10,1,10,1,10,1,10],
    [1,10,10,10,10,1,10,10,1,1,10,1,1,1,10,1,1,1,10,1,1,10,1,1,1,10,1,1,1,10,1,10,1,1,10,1,10,10,1,1,10,1,1,1,10,1,10,1,10,1,10,1,10],
    [1,10,1,1,10,1,10,1,1,1,10,1,1,1,10,1,1,1,10,1,1,10,1,1,1,10,1,10,1,10,1,10,1,1,10,1,10,1,10,1,10,1,1,1,10,1,10,1,10,1,10,1,10],
    [1,10,1,1,10,1,10,1,1,1,10,1,1,1,10,1,1,1,10,1,1,10,1,1,1,10,1,10,1,10,1,10,1,1,10,1,10,1,10,1,10,1,1,1,10,1,10,1,1,1,1,1,1],
    [1,10,1,1,10,1,10,10,10,1,10,10,10,1,10,10,10,1,1,10,10,1,1,1,1,1,10,10,10,1,1,1,10,10,1,1,10,1,10,1,10,10,10,1,10,10,1,1,10,1,10,1,10]
];

function getWeeksSinceDate(year: number, month: number, day: number): number {
    const startDate = new Date(year, month - 1, day); // Note: month is 0-based in JavaScript
    const currentDate = new Date();

    const timeDiff = currentDate.getTime() - startDate.getTime();
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24); // Convert milliseconds to days

    return Math.floor(daysDiff / 7);
}


app.post('/hit', async (_req, res) => {
    const now = new Date();
    const rowInd = now.getDay();
    const colInd = getWeeksSinceDate(2023, 10, 29) % 52;

    try {
        for (let i = 1; i <= matrix[rowInd][colInd]; i++) {
            const filePath = `data/${formatDate(now)}_${now.getTime()}_${i}.txt`;

            const buffer = Buffer.from(`Hello World! ${rowInd} + ${colInd}`, 'utf8');
            const encodedContent = buffer.toString('base64');

            // Create or update file
            await octokit.repos.createOrUpdateFileContents({
                owner: process.env.GITHUB_USERNAME,
                repo: process.env.GITHUB_REPOSITORY,
                path: filePath,
                message: `Create or update ${filePath}`,
                content: encodedContent
            });
        }

        res.json({ message: 'Files created or updated'});

    } catch (error) {
        res.status(500).json({ message: 'Error in creating or updating files', error: error });
    }
});



export default app;

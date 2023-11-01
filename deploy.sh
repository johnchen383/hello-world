#!/bin/bash
npm run publish
git add .
git commit -m "chore: deploy up"
git push -u origin main
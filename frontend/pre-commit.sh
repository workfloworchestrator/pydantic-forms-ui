#!/bin/bash
set -e
cd ./frontend
echo "---------- Running TSC ----------"
npm run tsc

echo "---------- Running Linter ----------"
npm run lint

echo "---------- Running Prettier ----------"
npm run prettier

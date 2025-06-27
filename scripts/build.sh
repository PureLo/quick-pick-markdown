#!/bin/bash
set -e
npm install
npm run compile
npx vsce package 
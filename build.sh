#!/bin/bash

webpack;
cd ..;
cp -r chrome chrome-export;
cd chrome-export;
rm -rf node_modules;
rm -rf webpack.config.js;
rm -rf .git;
rm -rf package-lock.json;
rm -rf package.json;
rm -rf README.md;
rm -rf semantic.json;
rm -rf src;
rm -rf .gitignore;
rm -rf build.sh;
rm -rf content.jsx;
rm -rf background.jsx;
cd ..;
zip -r chrome-export.zip chrome-export;
rm -rf chrome-export;

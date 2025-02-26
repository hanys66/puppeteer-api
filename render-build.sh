#!/bin/sh
apt-get update
apt-get install -y wget unzip fontconfig locales
apt-get install -y libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxfixes3 \
                   libxi6 libxrandr2 libgbm1 libglib2.0-0 libnss3 libpango-1.0-0 \
                   libatk1.0-0 libatk-bridge2.0-0 libgtk-3-0
npm install

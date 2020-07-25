#!/bin/bash
cd /home/ec2-user/til/server && npm install
cd /home/ec2-user/til/client && npm install
cp /home/ec2-user/til/.env /home/ec2-user/til/server/.env
cp -R /home/ec2-user/til/cert /home/ec2-user/til/server/cert
cp -R /home/ec2-user/til/cert /home/ec2-user/til/client/cert
cp /home/ec2-user/til/webpackDevServer.config.js /home/ec2-user/til/client/node_modules/react-scripts/config/webpackDevServer.config.js
cd /home/ec2-user/til/server 
pm2 start server.js &
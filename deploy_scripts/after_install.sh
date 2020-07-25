#!/bin/bash
cd /home/ec2-user/til/server && npm install
cd /home/ec2-user/til/client && npm install
cp /home/ec2-user/til/.env /home/ec2-user/til/server/.env
cd /home/ec2-user/til/server 
pm2 start server.js &
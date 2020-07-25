#!/bin/bash
cd /home/ec2-user/til/client 
sed -i 's/3000/80/g' node_modules/react-scripts/scripts/start.js
pm2 start node_modules/react-scripts/scripts/start.js &


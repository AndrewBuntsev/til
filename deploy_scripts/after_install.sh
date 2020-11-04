#!/bin/bash
cd /home/ec2-user/til/server && npm install
cd /home/ec2-user/til/client && npm install
cp /home/ec2-user/til/.env /home/ec2-user/til/server/.env
cp -R /home/ec2-user/til/cert /home/ec2-user/til/server/cert
cp -R /home/ec2-user/til/cert /home/ec2-user/til/client/cert
cp /home/ec2-user/til/webpackDevServer.config.js /home/ec2-user/til/client/node_modules/react-scripts/config/webpackDevServer.config.js
sed -i 's/invariant(!1), DraftModifier/DraftModifier/' /home/ec2-user/til/client/node_modules/react-rte-image/dist/react-rte.js
cd /home/ec2-user/til/server 
node db/preDeploy.js
pm2 start server.js &
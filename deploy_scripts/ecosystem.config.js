//Documentation page:
//https://doc.pm2.io/en/runtime/reference/ecosystem-file/
//https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/

module.exports = {
  apps: [{
    name: 'TIL (backend)',
    script: './../server/server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    exp_backoff_restart_delay: 100,
    append_env_to_name: true
  },
  {
    name: 'TIL (Frontend)',
    cwd: './../client',
    script: './node_modules/react-scripts/scripts/start.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    exp_backoff_restart_delay: 100,
    append_env_to_name: true
  }]
};

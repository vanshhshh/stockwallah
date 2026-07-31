module.exports = {
  apps: [
    {
      name: "stockwallah-backend",
      cwd: "/var/www/stockwallah/backend",
      script: "dist/src/index.js",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "stockwallah-frontend",
      cwd: "/var/www/stockwallah/frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

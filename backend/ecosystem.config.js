// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "backend",
      script: "server.js", // hoặc app.js, tùy file bạn khởi chạy
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 4000
      }
    }
  ]
}

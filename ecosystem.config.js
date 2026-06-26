// PM2 Ecosystem 配置文件
// 文档: https://pm2.keymetrics.io/docs/usage/application-declaration/

module.exports = {
  apps: [
    {
      // 应用名称
      name: "nitro-starter",

      // Nitro 构建产物入口文件
      script: "../backend/.output/server/index.mjs",

      // 实例数: "max" 使用所有 CPU 核心, 也可设置为具体数字如 2
      instances: "max",

      // 执行模式: "cluster" (多进程) 或 "fork" (单进程)
      exec_mode: "cluster",

      // 环境变量 (从 .env 文件加载)
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        NITRO_PORT: 3001,
      },

      // 开发环境
      env_development: {
        NODE_ENV: "development",
        PORT: 3001,
        NITRO_PORT: 3001,
      },

      // 启用监听模式 (文件变更时自动重启)
      watch: false,

      // 忽略监听的目录/文件
      ignore_watch: ["node_modules", "logs", ".git", ".output/public"],

      // 日志配置
      // 错误日志路径
      error_file: "./logs/pm2-error.log",
      // 标准输出日志路径
      out_file: "./logs/pm2-out.log",
      // 合并日志 (不按进程 ID 拆分)
      merge_logs: true,
      // 日志日期格式
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",

      // 自动重启配置
      // 内存超过 500M 时自动重启
      max_memory_restart: "500M",
      // 最小运行时间 (避免频繁重启), 单位毫秒
      min_uptime: "10s",
      // 最大自动重启次数 (15 秒内)
      max_restarts: 10,
      restart_delay: 3000,

      // 优雅关闭超时时间 (毫秒)
      kill_timeout: 5000,

      // 启动失败重试次数
      autorestart: true,

      // 启动前的准备工作
      // 如果需要先构建, 取消下面注释:
      // script: "pnpm",
      // args: "start",
    },
  ],
};

# Nitro Starter

基于 [Nitro v3](https://nitro.build) + [Elysia](https://elysiajs.com) + [Drizzle ORM](https://orm.drizzle.team) 的现代全栈 API 启动模板，开箱即用的类型安全与热更新体验。

## 技术栈

| 类别       | 技术                                         |
| ---------- | -------------------------------------------- |
| 服务端框架 | [Nitro v3](https://nitro.build)              |
| HTTP 框架  | [Elysia](https://elysiajs.com)               |
| ORM        | [Drizzle ORM](https://orm.drizzle.team)      |
| 数据库驱动 | [mysql2](https://github.com/sidorares/node-mysql2) |
| 数据库     | MySQL / MariaDB                              |
| 打包器     | [Rolldown](https://rolldown.rs)              |
| 类型检查   | [TypeScript](https://www.typescriptlang.org) |
| 代码检查   | [oxlint](https://oxc.rs)                     |
| 代码格式化 | [oxfmt](https://oxc.rs)                      |

## 环境要求

- **[Bun](https://bun.sh)** >= 1.2（运行时 & 包管理器）
- **MySQL** >= 8.0（或 MariaDB >= 10.5）

## 初始化流程

### 1. 克隆项目并安装依赖

```bash
git clone <your-repo-url> nitro-starter
cd nitro-starter
bun install
```

### 2. 配置环境变量

创建 `.env` 文件（可参考下方模板），填入你的数据库连接信息：

```env
# 数据库连接
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=nitro_starter
```

### 3. 初始化数据库

确保 MySQL 服务已启动，然后执行迁移：

```bash
# 创建数据库（如果尚未创建）
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS nitro_starter CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 同步数据库结构（Drizzle Push）
bun run db:push
```

> **说明**：`db:push` 会根据 `server/db/schema.ts` 自动同步数据库表结构。如需生成迁移文件，使用 `bun run db:generate` + `bun run db:migrate`。

### 4. 启动开发服务器

```bash
bun dev
```

开发服务器默认运行在 `http://localhost:3000`，支持热更新（HMR）。

### 5. 验证 API

```bash
# 测试默认路由
curl http://localhost:3000

# 测试 API 端点（返回用户数量）
curl http://localhost:3000/api
```

## 项目结构

```
nitro-start/
├── server/                  # 服务端代码
│   ├── api/                 # /api 前缀的路由处理
│   │   └── index.ts         # GET /api
│   ├── db/                  # 数据库相关
│   │   └── schema.ts        # Drizzle 数据模型定义
│   ├── routes/              # 无前缀的路由处理（按需创建）
│   ├── middleware/           # 中间件（按需创建）
│   ├── plugins/             # 插件（按需创建）
│   ├── utils/               # 工具函数
│   │   └── db.ts            # Drizzle 数据库连接实例
│   └── assets/              # 服务端资源（按需创建）
├── public/                  # 静态资源（直接拷贝，不打包）
│   └── styles.css
├── bench/                   # 性能压测
│   └── autocannon.ts        # Autocannon 压测脚本
├── nitro.config.ts          # Nitro 配置
├── drizzle.config.ts        # Drizzle Kit 配置
├── server.ts                # Elysia 服务入口
├── tsconfig.json            # TypeScript 配置
└── package.json
```

## 可用命令

| 命令                      | 说明                          |
| ------------------------- | ----------------------------- |
| `bun dev`                 | 启动开发服务器（热更新）      |
| `bun run build`           | 构建生产版本                  |
| `bun run preview`         | 本地预览生产构建              |
| `bun lint`                | 代码检查                      |
| `bun run lint:fix`        | 代码检查并自动修复            |
| `bun run format`          | 代码格式化                    |
| `bun run format:check`    | 检查代码格式（不修改）        |
| `bun run db:generate`     | 生成数据库迁移文件            |
| `bun run db:migrate`      | 执行数据库迁移                |
| `bun run db:push`         | 直接推送 schema 到数据库      |
| `bun run db:studio`       | 打开 Drizzle Studio 可视化管理|
| `bun run bench`           | 运行 Autocannon 性能压测      |

## 性能压测

项目内置 [Autocannon](https://github.com/mcollina/autocannon) 压测脚本，覆盖 `/` 和 `/api` 在不同并发下的表现。

```bash
# 1. 先启动开发服务器
bun dev

# 2. 另一个终端运行压测
bun run bench
```

测试场景：

- `GET /` 基础吞吐量（10 连接 / 10s）
- `GET /` 高并发（100 连接 / 10s）
- `GET /api` 基础吞吐量（10 连接 / 10s，含 DB 查询）
- `GET /api` 高并发（50 连接 / 10s，含 DB 查询）

测试完成后会在项目根目录生成 `bench-report.json` 详细报告。自定义场景可编辑 `bench/autocannon.ts`。

## API 端点

| 方法 | 路径   | 说明             |
| ---- | ------ | ---------------- |
| GET  | `/`    | Elysia 欢迎信息  |
| GET  | `/api` | 返回用户总数统计 |

> 基于文件系统路由：`server/api/` 下的文件自动映射为 `/api/*`，`server/routes/` 下的文件映射为 `/*`。

## 部署

```bash
# 构建生产版本
bun run build

# 输出目录：.output/
# 可部署到任意 Node.js 服务器或 Serverless 平台
```

支持的部署预设参见 [Nitro Deployment](https://nitro.build/deploy)，包括 Vercel、Netlify、Cloudflare Workers、Node.js Server 等。

## 更多资源

- [Nitro 文档](https://nitro.build)
- [Elysia 文档](https://elysiajs.com)
- [Drizzle ORM 文档](https://orm.drizzle.team)
- [h3 文档](https://h3.dev)

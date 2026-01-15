# 企业入驻表单后台系统

## 项目概述

本项目是一个企业入驻表单后台系统，包含表单提交和后台管理功能。系统采用前后端分离架构，前端部署到gitee pages，后端部署到云平台。

## 技术栈

### 前端
- 表单页面：HTML/CSS/JavaScript
- 后台管理：Vue 3 + Element Plus + Vite
- 部署：gitee pages

### 后端
- Node.js + Express.js
- MongoDB Atlas
- 部署：云平台（如Vercel、Render等）

## 项目结构

```
企业入驻表单/
├── 企业入驻表单.html          # 前端表单页面
├── frontend/                  # 前端代码
│   └── admin/                 # 后台管理界面
│       ├── src/               # 源代码
│       ├── package.json       # 依赖配置
│       └── vite.config.js     # Vite配置
└── backend/                   # 后端代码
    ├── app.js                 # 主应用文件
    ├── models/                # 数据模型
    ├── routes/                # API路由
    ├── controllers/           # 控制器
    ├── services/              # 服务层
    ├── middleware/            # 中间件
    ├── config/                # 配置文件
    └── package.json           # 依赖配置
```

## 快速开始

### 后端运行

1. 进入backend目录：
   ```
   cd backend
   ```

2. 安装依赖：
   ```
   npm install
   ```

3. 配置环境变量：
   - 复制`.env.example`文件为`.env`
   - 填写MongoDB Atlas连接字符串和SMTP邮件服务配置

4. 启动后端服务：
   ```
   npm start
   ```
   服务将运行在 http://localhost:3000

### 前端运行

1. 进入frontend/admin目录：
   ```
   cd frontend/admin
   ```

2. 安装依赖：
   ```
   npm install
   ```

3. 启动开发服务器：
   ```
   npm run dev
   ```
   服务将运行在 http://localhost:5174

4. 构建生产版本：
   ```
   npm run build
   ```
   构建产物将生成在`dist`目录

## 部署说明

### 前端部署（gitee pages）

1. 将构建后的`dist`目录内容推送到gitee仓库
2. 在gitee仓库设置中开启pages服务
3. 选择构建后的目录作为pages根目录
4. 保存设置，等待部署完成

### 后端部署（云平台）

1. 将backend目录代码推送到GitHub/Gitee仓库
2. 在云平台（如Vercel、Render）导入仓库
3. 配置环境变量（同`.env`文件内容）
4. 部署完成后，获取后端API域名
5. 修改前端代码中的API域名配置

## 功能说明

### 表单页面
- 企业基础信息填写
- 对接人信息填写
- 业务需求描述
- 文件上传
- 表单提交和状态反馈

### 后台管理
- 表单列表展示（分页、筛选、排序）
- 表单详情查看
- 审核功能（单个审核、批量审核）
- 邮件模板配置
- 系统信息查看

## API文档

### 表单相关API
- `POST /api/form/submit` - 提交表单数据
- `GET /api/form/list` - 获取表单列表
- `GET /api/form/detail/:id` - 获取表单详情
- `POST /api/form/approve` - 审核表单（单个/批量）
- `GET /api/form/stats` - 获取表单统计

### 配置相关API
- `GET /api/config/email` - 获取邮件配置
- `POST /api/config/email` - 更新邮件配置

## 环境变量说明

| 变量名 | 说明 | 示例 |
|-------|------|------|
| MONGODB_URI | MongoDB Atlas连接字符串 | mongodb+srv://<username>:<password>@<cluster-url>/<database> |
| PORT | 后端服务端口 | 3000 |
| SMTP_HOST | SMTP服务器地址 | smtp.example.com |
| SMTP_PORT | SMTP端口 | 587 |
| SMTP_USER | SMTP用户名 | your-email@example.com |
| SMTP_PASS | SMTP密码/授权码 | your-password |
| SMTP_FROM | 发件人邮箱 | your-email@example.com |
| CORS_ORIGIN | CORS允许的域名 | * |

## 开发指南

### 代码规范
- 前端：遵循ESLint和Prettier规范
- 后端：使用JavaScript Standard Style

### 提交规范
- 使用Conventional Commits规范
- 提交信息格式：`<type>: <description>`

## 注意事项

1. 确保MongoDB Atlas集群允许所有IP访问（或配置正确的IP白名单）
2. 确保SMTP服务配置正确，并且允许第三方应用访问
3. 部署到生产环境时，确保修改CORS_ORIGIN为实际域名
4. 定期备份数据库数据

## License

MIT

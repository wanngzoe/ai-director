# AI Director - 漫剧工场

AI 真人漫剧创作平台，从文字到影像，一键生成专业短剧。

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
src/
├── App.tsx      # 主应用组件（所有页面）
├── App.css      # 样式文件
└── index.css    # 全局样式

backups/        # 版本备份
```

## 备份与恢复

### 查看可用备份

```bash
ls -la backups/
```

### 恢复备份

**方式一：恢复源代码**
```bash
# 例如恢复到 v3.2
cp backups/v3.2-20260307/src/App.tsx src/
cp backups/v3.2-20260307/src/App.css src/

# 重启开发服务器
npm run dev
```

**方式二：恢复构建产物（更快）**
```bash
# 例如恢复到 v3.2
cp -r backups/v3.2-20260307/dist/* dist/

# 然后直接访问 http://localhost:5173
```

### 创建新备份

```bash
# 创建备份目录
mkdir -p backups/vX.X-YYYYMMDD/src backups/vX.X-YYYYMMDD/dist

# 复制源文件
cp src/App.tsx src/App.css src/index.css backups/vX.X-YYYYMMDD/src/

# 复制构建产物
cp -r dist/* backups/vX.X-YYYYMMDD/dist/

# 复制图片资源（如有）
cp -r public/images backups/vX.X-YYYYMMDD/
```

## 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v3.2 | 2024-03-07 | 项目工作区、运营中心、选角优化 |
| v3.1 | 2024-03-07 | 更新通知模块、AI优化工具 |
| v3.0 | 2024-03-01 | 工作区模式上线 |

## 部署

### Vercel 部署
```bash
# 登录 Vercel（如需要）
vercel login

# 部署到生产
vercel --prod
```

部署完成后访问: https://ai-director-delta.vercel.app

## 技术栈

- React + TypeScript
- Vite
- React Router
- Lucide React (图标)

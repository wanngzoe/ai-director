# AI Director v3.2 备份

## 备份时间
2024-03-07

## 版本说明
此版本在v3.1基础上增加了以下功能：

### 新增功能
1. **项目工作区**
   - 点击项目进入工作区，左侧显示7个模块菜单
   - 选角、场景、道具、分镜、后期、成片都在项目工作区内
   - 剧本工坊、生成队列保持独立

2. **剧本工坊优化**
   - 解析结果页面增加"创建项目，进入制作"按钮

3. **运营中心Tab**
   - 活动专区Banner
   - 福利公告列表
   - 积分奖励任务

4. **选角中心优化**
   - 角色详情抽屉：道具关联、场景造型关联
   - 图片9:16比例，点击可查看大图

## 恢复方式
```bash
# 恢复源代码
cp backups/v3.2-20260307/src/App.tsx src/
cp backups/v3.2-20260307/src/App.css src/

# 或直接使用dist
cp -r backups/v3.2-20260307/dist/* dist/
```

## 文件清单
- src/App.tsx
- src/App.css
- src/index.css
- dist/ (构建产物)

---
备份路径: /Users/akirawang/ai-director/backups/v3.2-20260307/

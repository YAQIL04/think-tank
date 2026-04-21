# PROGRESS.md — 帕特农开发进度

**项目启动:** 2026-04-20  
**当前版本:** v1.0 MVP  
**部署状态:** 🟢 线上运行中  
**Live URL:** https://pantheon-psi-six.vercel.app

---

## 里程碑

| 日期 | 版本 | 内容 |
|------|------|------|
| 2026-04-20 | v0.1 | 项目初始化，确定技术栈，写 PRD |
| 2026-04-20 | v0.2 | 完成四个 SKILL.md，搭建 Next.js 基础结构 |
| 2026-04-20 | v0.3 | 完成主页 + 对话页，接入 DeepSeek API 流式输出 |
| 2026-04-20 | v0.4 | 切换 Anthropic → DeepSeek，修复 AI SDK 版本兼容问题 |
| 2026-04-20 | v1.0 | 首次部署上线 Vercel |
| 2026-04-21 | v1.1 | 添加中英文切换，网站改名帕特农/Parthenon |
| 2026-04-21 | v1.2 | 添加 Footer 社交链接（LinkedIn/GitHub/Email/微信） |
| 2026-04-21 | v1.3 | 完善 README，清理 repo，补充项目文档 |

---

## 已完成 ✅

### 核心功能
- [x] 主页：四位人物卡片展示，hover 效果，点击跳转
- [x] 对话页：流式输出，Markdown 渲染，推荐问题
- [x] 新建对话、返回主页
- [x] 错误处理 + 重试
- [x] 头像 fallback（字母 + 色块）

### 体验优化
- [x] 中英文全局切换（UI + AI 回复语言）
- [x] 语言偏好 localStorage 持久化
- [x] 网站命名：帕特农 / Parthenon
- [x] 响应式布局（移动端适配）

### 工程质量
- [x] TypeScript 严格模式，构建零报错
- [x] 人物扩展架构（新增人物只需改两个文件）
- [x] API Key 仅服务端使用
- [x] .gitignore 配置正确（.env.local / CLAUDE.md 不上传）

### 项目文档
- [x] README.md（产品介绍 + 本地运行指南）
- [x] PRD.md（产品需求文档）
- [x] PROGRESS.md（本文件）
- [x] CLAUDE.md（AI 协作上下文，本地）

---

## 进行中 🔄

- [ ] Vercel 域名优化（当前域名 pantheon-psi-six.vercel.app 不够直观）
- [ ] GitHub repo Topics 设置

---

## 待办 V2 📋

### 高优先级
- [ ] 自定义域名绑定
- [ ] 更多思想家（Paul Graham、Steve Jobs 等候选）
- [ ] 对话历史持久化（localStorage 本地方案，不需要后端）

### 中优先级
- [ ] 对话分享功能（生成截图/卡片）
- [ ] 移动端体验进一步优化（底部输入框遮挡问题）

### 低优先级
- [ ] 用户账号系统
- [ ] 微信小程序版（Taro）
- [ ] 多人物同时对话模式

---

## 已知问题 🐛

| 问题 | 严重程度 | 状态 |
|------|---------|------|
| 切换语言后，新对话的 AI 语言需要刷新一次才生效（body 参数缓存） | 低 | 待修复 |
| 移动端键盘弹出时输入框可能被遮挡 | 低 | 待修复 |

---

## 技术债务

- `@ai-sdk/deepseek` 与 `ai@3` 不兼容，目前用 `@ai-sdk/openai` 兼容接口绕过，待 DeepSeek 官方 SDK 稳定后迁移
- 主页被迫改为 Client Component（因为用了 `useLang` hook），轻微影响首屏 SEO

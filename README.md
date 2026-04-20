# 帕特农 · Parthenon

> 随时召唤世界顶级思想家，以他们的心智模型为你答疑解惑  
> Summon the world's greatest thinkers. Talk through their mental models.

🔗 **Live Demo:** [pantheon-psi-six.vercel.app](https://pantheon-psi-six.vercel.app)

---

## 产品介绍

帕特农是一个个人智囊团产品。用户可以选择与四位顶级思想家对话，每位思想家的回应都基于其深度蒸馏的心智模型——不是泛化的 AI 回答，而是带有独特认知风格和思维框架的真实回应。

支持中英文切换，所有对话均采用流式输出。

## 智囊团成员

| 人物 | 领域 | 核心方法论 |
|------|------|-----------|
| **Elon Musk** | 工程 · 未来主义 | 第一性原理 · 五步算法 · 白痴指数 |
| **Naval Ravikant** | 财富 · 哲学 | 杠杆思维 · 特定知识 · 欲望管理 |
| **Donald Trump** | 谈判 · 品牌 | 交易艺术 · 叙事控制 · 不可预测性 |
| **Charlie Munger** | 投资 · 决策 | 多元思维模型 · 逆向思考 · Lollapalooza效应 |

## 技术栈

- **框架:** Next.js 14 (App Router) · TypeScript
- **样式:** Tailwind CSS
- **AI:** Vercel AI SDK · DeepSeek API
- **部署:** Vercel

## 本地运行

```bash
# 1. 克隆仓库
git clone https://github.com/YAQIL04/think-tank.git
cd think-tank

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入你的 DeepSeek API Key

# 4. 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可使用。

## 环境变量

| 变量名 | 说明 |
|--------|------|
| `DEEPSEEK_API_KEY` | DeepSeek API Key，在 [platform.deepseek.com](https://platform.deepseek.com/api_keys) 获取 |

## 扩展新人物

在 `src/config/characters.ts` 新增一条配置，在 `src/skills/` 目录下放入对应的 SKILL.md 文件即可。无需修改其他代码。

## 致谢

四位思想家的心智模型由 [Nuwa.Skill](https://github.com/alchaincyf) 框架蒸馏生成。

---

Built by [Yaqi](https://www.linkedin.com/in/luoyaqi) · MIT License

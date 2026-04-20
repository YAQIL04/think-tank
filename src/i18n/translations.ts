export type Lang = "zh" | "en";

export const t = {
  zh: {
    siteTitle: "帕特农",
    siteSubtitle: "你的个人智囊团",
    siteDescription: "随时召唤世界顶级思想家，以他们的心智模型为你答疑解惑。",
    homeHeadline: "你的个人智囊团",
    homeSubline: "选择一位思想家，以他的心智模型与你深度对话",
    startChat: "开始对话 →",
    backLabel: "智囊团",
    newChat: "新对话",
    tryAsking: "试试问他",
    inputPlaceholder: (name: string) => `和 ${name} 聊聊…`,
    inputHint: "Enter 发送 · Shift+Enter 换行",
    sendError: "发送失败，请重试",
    retry: "重试",
    footer: "基于公开信息提炼的思维框架，仅供参考学习",
    langToggle: "EN",
  },
  en: {
    siteTitle: "Parthenon",
    siteSubtitle: "Your Personal Think Tank",
    siteDescription: "Summon the world's greatest thinkers and engage with their mental models.",
    homeHeadline: "Your Personal Think Tank",
    homeSubline: "Choose a thinker. Talk through their mental models.",
    startChat: "Start Chat →",
    backLabel: "Think Tank",
    newChat: "New Chat",
    tryAsking: "Try asking",
    inputPlaceholder: (name: string) => `Chat with ${name}…`,
    inputHint: "Enter to send · Shift+Enter for new line",
    sendError: "Failed to send, please retry",
    retry: "Retry",
    footer: "A framework distilled from public information, for reference only.",
    langToggle: "中",
  },
} as const;

export const suggestedQuestions: Record<string, Record<Lang, string[]>> = {
  "elon-musk": {
    zh: [
      "如何用五步算法优化一个产品流程？",
      "你怎么看待现在的AI发展趋势？",
      "我的创业项目成本太高，怎么思考这个问题？",
    ],
    en: [
      "How would you apply the 5-step algorithm to optimize a product process?",
      "What's your take on the current AI development trajectory?",
      "My startup's costs are too high — how should I think about this?",
    ],
  },
  naval: {
    zh: [
      "我同时想做很多事，但精力不够，怎么办？",
      "如何判断一个机会是否有真正的杠杆？",
      "大厂干了5年，要不要出来创业？",
    ],
    en: [
      "I want to do too many things at once — how do I focus?",
      "How do I know if an opportunity has real leverage?",
      "I've spent 5 years at a big company. Should I start something?",
    ],
  },
  trump: {
    zh: [
      "如何在谈判中占据主动？",
      "面对批评和攻击，应该怎么应对？",
      "如何建立一个强大的个人品牌？",
    ],
    en: [
      "How do you take control in a negotiation?",
      "How should you respond to criticism and attacks?",
      "How do you build a powerful personal brand?",
    ],
  },
  munger: {
    zh: [
      "如何避免在投资中犯愚蠢的错误？",
      "大家都在追某个热点，我该跟风吗？",
      "如何培养多元思维模型的能力？",
    ],
    en: [
      "How do you avoid making stupid mistakes in investing?",
      "Everyone is chasing a hot trend — should I follow?",
      "How do you build a latticework of mental models?",
    ],
  },
};

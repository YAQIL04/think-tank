import type { Lang } from "@/i18n/translations";

export interface Character {
  id: string;
  name: string;
  title: Record<Lang, string>;
  tags: Record<Lang, string[]>;
  description: Record<Lang, string>;
  avatar: string;
  skillFile: string;
  accentColor: string;
}

export const characters: Character[] = [
  {
    id: "elon-musk",
    name: "Elon Musk",
    title: {
      zh: "SpaceX & Tesla CEO",
      en: "CEO of SpaceX & Tesla",
    },
    tags: {
      zh: ["第一性原理", "工程思维", "未来主义"],
      en: ["First Principles", "Engineering", "Futurism"],
    },
    description: {
      zh: "用物理定律拆解一切，白痴指数是他的标尺，五步算法是他的武器。",
      en: "He dismantles everything with physics. The idiot index is his ruler. The 5-step algorithm is his weapon.",
    },
    avatar: "/avatars/elon-musk.jpg",
    skillFile: "elon-musk.md",
    accentColor: "#E8401C",
  },
  {
    id: "naval",
    name: "Naval Ravikant",
    title: {
      zh: "AngelList 创始人 · 天使投资人",
      en: "Co-founder of AngelList · Angel Investor",
    },
    tags: {
      zh: ["财富自由", "杠杆思维", "内在平和"],
      en: ["Wealth", "Leverage", "Inner Peace"],
    },
    description: {
      zh: "不靠运气变富，不靠外部条件变快乐。特定知识加杠杆，是他给的公式。",
      en: "Get rich without luck. Be happy without conditions. Specific knowledge plus leverage — that's his formula.",
    },
    avatar: "/avatars/naval.jpg",
    skillFile: "naval.md",
    accentColor: "#0EA5E9",
  },
  {
    id: "trump",
    name: "Donald Trump",
    title: {
      zh: "美国第45&47任总统",
      en: "45th & 47th President of the United States",
    },
    tags: {
      zh: ["谈判策略", "品牌思维", "交易艺术"],
      en: ["Negotiation", "Branding", "The Art of the Deal"],
    },
    description: {
      zh: "一切皆交易，感知即现实。不可预测是他最强的谈判武器。",
      en: "Everything is a deal. Perception is reality. Unpredictability is his greatest negotiating weapon.",
    },
    avatar: "/avatars/trump.jpg",
    skillFile: "trump.md",
    accentColor: "#EF4444",
  },
  {
    id: "munger",
    name: "Charlie Munger",
    title: {
      zh: "伯克希尔·哈撒韦副董事长",
      en: "Vice Chairman of Berkshire Hathaway",
    },
    tags: {
      zh: ["多元思维", "逆向思考", "认知偏误"],
      en: ["Mental Models", "Inversion", "Cognitive Bias"],
    },
    description: {
      zh: "99年收集世界的蠢事，然后系统性地避开。避免愚蠢比追求聪明容易得多。",
      en: "Spent 99 years cataloguing the world's stupidity — then systematically avoiding it. It's easier to not be stupid than to be smart.",
    },
    avatar: "/avatars/munger.jpg",
    skillFile: "munger.md",
    accentColor: "#8B5CF6",
  },
];

export function getCharacterById(id: string): Character | undefined {
  return characters.find((c) => c.id === id);
}

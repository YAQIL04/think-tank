export interface Character {
  id: string;
  name: string;
  title: string;
  tags: string[];
  description: string;
  avatar: string;
  skillFile: string;
  accentColor: string;
}

export const characters: Character[] = [
  {
    id: "elon-musk",
    name: "Elon Musk",
    title: "SpaceX & Tesla CEO",
    tags: ["第一性原理", "工程思维", "未来主义"],
    description: "用物理定律拆解一切，白痴指数是他的标尺，五步算法是他的武器。",
    avatar: "/avatars/elon-musk.jpg",
    skillFile: "elon-musk.md",
    accentColor: "#E8401C",
  },
  {
    id: "naval",
    name: "Naval Ravikant",
    title: "AngelList 创始人 · 天使投资人",
    tags: ["财富自由", "杠杆思维", "内在平和"],
    description: "不靠运气变富，不靠外部条件变快乐。特定知识加杠杆，是他给的公式。",
    avatar: "/avatars/naval.jpg",
    skillFile: "naval.md",
    accentColor: "#0EA5E9",
  },
  {
    id: "trump",
    name: "Donald Trump",
    title: "美国第45&47任总统",
    tags: ["谈判策略", "品牌思维", "交易艺术"],
    description: "一切皆交易，感知即现实。不可预测是他最强的谈判武器。",
    avatar: "/avatars/trump.jpg",
    skillFile: "trump.md",
    accentColor: "#EF4444",
  },
  {
    id: "munger",
    name: "Charlie Munger",
    title: "伯克希尔·哈撒韦副董事长",
    tags: ["多元思维", "逆向思考", "认知偏误"],
    description: "99年收集世界的蠢事，然后系统性地避开。避免愚蠢比追求聪明容易得多。",
    avatar: "/avatars/munger.jpg",
    skillFile: "munger.md",
    accentColor: "#8B5CF6",
  },
];

export function getCharacterById(id: string): Character | undefined {
  return characters.find((c) => c.id === id);
}

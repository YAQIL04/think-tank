export interface Bilingual {
  zh: string;
  en: string;
}

export interface NewsArticle {
  title: Bilingual;
  summary: Bilingual;
  source_url: string;
  source_name: string;
  published_at: string;
  expert_comments: ExpertComment[];
}

export interface ExpertComment {
  expert_id: string;
  expert_name: string;
  comment: Bilingual;
}

export interface DailyNews {
  articles: NewsArticle[];
  last_updated: string;
}

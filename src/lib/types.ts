export interface Bilingual {
  zh: string;
  en: string;
}

export interface NewsArticle {
  title: string;
  summary: string;
  source_url: string;
  source_name: string;
  published_at: string;
  expert_comments: ExpertComment[];
}

export interface ExpertComment {
  expert_id: string;
  expert_name: string;
  comment: string;
}

export interface DailyNews {
  articles: NewsArticle[];
  last_updated: string;
}

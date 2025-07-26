export enum AppStep {
  TOPIC = 'TOPIC',
  SCRIPT = 'SCRIPT',
  GENERATING = 'GENERATING',
  PREVIEW = 'PREVIEW',
}

export interface ScriptData {
  title: string;
  description: string;
  hashtags: string[];
  script: {
    hook: string;
    body: string;
    cta: string;
  };
  bRollKeywords: string[];
  captions: string[];
}

export interface PexelsPhoto {
  id: number;
  src: {
    portrait: string;
    large: string;
    medium: string;
  };
  alt: string;
}
export interface FeedingSession {
  start: string;
  end?: string;
  strana?: 'L' | 'D';
  strane?: ('L' | 'D')[];
  komentar?: string | null;
  napomena?: string;
}

export interface DiaperEvent {
  dogadjaj: 'pelena';
  vrsta: 'pokakana' | 'popiškena' | 'both';
  start?: string;
  end?: string;
  komentar?: string | null;
}

export interface WeightMeasurement {
  vrijeme: string;
  težina: string;
  komentar: string | null;
}

export interface DayData {
  dojenje: (FeedingSession | DiaperEvent)[];
  vaga: WeightMeasurement[];
}

export interface TrackingData {
  [date: string]: DayData;
} 
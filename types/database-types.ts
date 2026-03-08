// db/types.ts

import type { EventType, MarketType, SeriesType, TagType } from "./http-schemas";

export interface Event {
  id: string;
  slug: string;
  ticker?: string;
  title?: string;
  active: boolean;
  closed: boolean;
  archived?: boolean;
  featured?: boolean;
  restricted?: boolean;
  startDate?: number;   // timestamps in ms
  endDate?: number;
  createdAt: number;
  updatedAt?: number;
  liquidity?: number;
  volume?: number;
  openInterest?: number;
  payload: EventType;      // full JSON
}

export interface Market {
  id: string;
  eventId: string;
  slug?: string;
  question: string;
  active: boolean;
  closed: boolean;
  startDate?: number;
  endDate?: number;
  createdAt: number;
  updatedAt?: number;
  liquidity?: number;
  volume?: number;
  payload: MarketType;      // full JSON of EventMarketSchema
}

export interface Series {
  id: string;
  slug: string;
  title?: string;
  active: boolean;
  closed: boolean;
  startDate?: number;
  createdAt: number;
  updatedAt?: number;
  payload: SeriesType;      // full JSON of SeriesSchema
}

export interface Tag {
  id: string;
  slug?: string;
  label: string;
  payload: TagType;      // full JSON of TagSchema
}

export interface EventSeriesLink {
  eventId: string;
  seriesId: string;
}

export interface EventTagLink {
  eventId: string;
  tagId: string;
}

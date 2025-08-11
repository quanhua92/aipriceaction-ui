import { en } from './en';
import { vn } from './vn';

export type TranslationKey = keyof typeof en;
export type TranslationNestedKey<T> = T extends object 
  ? { [K in keyof T]: K extends string ? `${K}` | `${K}.${TranslationNestedKey<T[K]>}` : never }[keyof T]
  : never;

export type AllTranslationKeys = TranslationNestedKey<typeof en>;

export const translations = {
  en,
  vn,
} as const;

export type Language = keyof typeof translations;
export type TranslationData = typeof en;
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const CHANNEL_LABELS: Record<string, string> = {
  instagram: '인스타그램',
  youtube: '유튜브',
  tiktok: '틱톡',
  blog: '블로그',
  naver_tv: '네이버TV',
  threads: '스레드',
}


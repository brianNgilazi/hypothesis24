
/**
 * Astronomy Picture of the day
 */
export interface APOD{
  date: Date;
  url: string;
  title: string;
  media_type: string;
  copyright: string;
}

export interface WOTD{
  apod: APOD
  date: Date;
  word: string;
  id: string;
}

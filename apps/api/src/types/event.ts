export type EventResponse = {
  id: string;
  name: string;
  description: string | null;
  thumbnailUrl: string | null;
  start: number;
  end: number;
  checkinStart: number;
  checkinEnd: number;
  location: string | null;
  semesterId: number | null;
};
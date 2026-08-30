export interface Profile {
  name: string;
  bio: string;
  avatarUrl: string;
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  clicks: number;
  order: number;
}

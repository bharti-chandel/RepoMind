export interface Repo {
  id: string;
  name: string;
  owner: string;
  url: string;
  description: string;
  fileCount: number;
  createdAt: any;
  userId: string;
}

export interface RepoFile {
  path: string;
  sha: string;
  size: number;
  url: string;
  content?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

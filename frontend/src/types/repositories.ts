export interface RepositorySummary {
  id: number;
  name: string;
  source: string;
  status: string;
  file_count: number;
  total_bytes: number;
  languages: string[];
  last_error: string | null;
  created_at: string;
  updated_at: string;
}

export interface RepositoryFile {
  id: number;
  path: string;
  extension: string;
  language: string;
  size_bytes: number;
  line_count: number;
}

export interface RepositoryDetail extends RepositorySummary {
  files: RepositoryFile[];
}

export interface RepositoryScanResult {
  repository: RepositorySummary;
  message: string;
}

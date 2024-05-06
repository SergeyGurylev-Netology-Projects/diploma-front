export interface fetchStatus {
  status: "idle" | "loading" | "failed" | "complete" | "none"
  error: any
  action: string
  loaded?: boolean
}

export interface Login {
  username: string
  password: string
}

export interface MyCloudUser {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  is_superuser: boolean
  total_files: number
  total_size: number
}

export interface MyCloudCurrentUser extends MyCloudUser {
  token: string
}

export interface MyCloudFile {
  id: number
  title: string
  filename: string
  extension: string
  size: number
  description: string
  handle: string
  url: string
  user: number
  download_count: number
  download_at: string
  created_at: string
}

export interface MyCloudUserSettings {
  color_theme: string
}
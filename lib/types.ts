interface User {
  name: string
  avatar: string
  location?: string
}

interface Content {
  grid: {
    type: "image" | "video"
    url: string
  }[]
}

interface Stats {
  likes: number
  comments: number
  timePosted: string
}

export interface Post {
  id: number
  type: "video" | "photo"
  user: User
  content: Content
  stats: Stats
}
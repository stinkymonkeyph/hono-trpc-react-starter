export interface User {
  id: string
  email: string
  name: string | null
  createdAt: string
  updatedAt: string
  posts: Post[]
}

export interface Post {
  id: string
  title: string
  content: string | null
  published: boolean
  authorId: string
  createdAt: string
  updatedAt: string
}

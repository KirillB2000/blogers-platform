import { db } from "../../db/db"
import { postInputModel } from "../dto/postInputModel"
import { postViewModel } from "../types/postViewModel"

export const postsRepository = {
    findAll (): postViewModel[]  {
        return db.posts
    },

    findById (id: string): postViewModel | null {
        return db.posts.find (p => p.id === id) ?? null
    },

    create(newPost: Omit<postViewModel, 'id'>): postViewModel {
        const created: postViewModel = {
            id: +new Date() + '',
            ...newPost
        }

        return created
    }
} 
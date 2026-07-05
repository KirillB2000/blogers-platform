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
    },

    update(id: string, inputForUpdate: postInputModel): Boolean {
        const index = db.posts.findIndex(p => p.id === id)

        if (index === -1) {
            return false
        }

        db.posts[index] = {...db.posts[index], ...inputForUpdate}
        return true
    },

    delete(id: string): Boolean {
        const postById = this.findById(id)

        if (!postById) {
            return false
        }

        db.posts = db.posts.filter(p => p.id != id)

        return true
    }
} 
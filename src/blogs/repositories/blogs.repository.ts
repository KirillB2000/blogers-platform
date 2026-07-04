import { db } from "../../db/db"
import { blogViewModel } from "../types/blogViewModel"
import { blogsInputModel } from "../dto/blogsInputModel"

export const blogsRepository = {
    findAll (): blogViewModel[] {
        return db.blogs
    },

    findById (id: string): blogViewModel | null {
        return db.blogs.find(b => b.id === id) ?? null
    },

    create(newPost: Omit<blogViewModel, 'id'>): blogViewModel {
        
        const created: blogViewModel = {
            id: +new Date() + '',
            ...newPost
        }

        db.blogs.push(created)

        return created
    }
}
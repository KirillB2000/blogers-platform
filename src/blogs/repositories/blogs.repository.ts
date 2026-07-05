import { db } from "../../db/db"
import { blogViewModel } from "../types/blogViewModel"
import { blogInputModel } from "../dto/blogInputModel"

export const blogsRepository = {
    findAll (): blogViewModel[] {
        return db.blogs
    },

    findById (id: string): blogViewModel | null {
        return db.blogs.find(b => b.id === id) ?? null
    },

    create(newBlog: Omit<blogViewModel, 'id'>): blogViewModel {
        
        const created: blogViewModel = {
            id: +new Date() + '',
            ...newBlog
        }

        db.blogs.push(created)

        return created
    },

    update(id: string, inputForUpdate: blogInputModel): Boolean {
        const index = db.blogs.findIndex(b => b.id === id)

        if(index === -1) {
            return false
        }

        db.blogs[index] = {...db.blogs[index], ...inputForUpdate}

        return true;
    },

    delete(id: string): Boolean {
        const blogById = this.findById(id)

        if(!blogById) {
            return false
        }

        db.blogs = db.blogs.filter(b => b.id != id)

        return true
    }
}
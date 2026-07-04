import { Request, Response } from "express";
import { blogsInputModel } from "../../dto/blogsInputModel";
import { blogViewModel } from "../../types/blogViewModel";
import { blogsRepository } from "../../repositories/blogs.repository";

export const createBlogHandler = (req: Request<{}, {}, blogsInputModel>, res: Response<blogViewModel>) => {
    const newBlog: Omit<blogViewModel, 'id'> = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl
    }

    blogsRepository.create(newBlog)
}
import { Request, Response } from "express";
import { postInputModel } from "../../dto/postInputModel";
import { postViewModel } from "../../types/postViewModel";
import { blogsRepository } from "../../../blogs/repositories/blogs.repository";
import { httpStatuses } from "../../../core/types/http-statuses";
import { postsRepository } from "../../repositories/posts.repository";

export const createPost = (req: Request<{}, {}, postInputModel>, res: Response<postViewModel | {message: string, field: string}>) => {
    const blogByPostId = blogsRepository.findById(req.body.blogId)

    if (!blogByPostId) {
        res.status(httpStatuses.BadRequest).json({message: 'Blog not found', field: 'blogID'}) // Переписать на errorHadler
        return;
    }

    const newPost: Omit<postViewModel, 'id'> = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
        blogName: blogByPostId.name 
    }

    postsRepository.create(newPost)
}
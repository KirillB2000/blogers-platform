import { Request, Response } from "express"
import { blogsRepository } from "../../repositories/blogs.repository"
import { httpStatuses } from "../../../core/types/http-statuses"

export const getBlogByIdHandler = (req: Request<{id: string}>, res: Response) => {
    const blogId = req.params.id.toString()
    
    const blog = blogsRepository.findById(blogId)

    if (!blog) {
        res.sendStatus(httpStatuses.NotFound)
        return;
    }

    return res.status(httpStatuses.Ok).json(blog)
}
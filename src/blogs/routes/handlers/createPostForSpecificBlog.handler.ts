import { Request, Response } from "express"
import { postBlogInputModel } from "../../../posts/dto/postBlogInputModel"
import { ObjectId } from "mongodb"
import { postInputModel } from "../../../posts/dto/postInputModel"
import { postsServices } from "../../../posts/application/posts.services"
import { httpStatuses } from "../../../core/types/http-statuses"
import { postViewModel } from "../../../posts/routes/output/post-data.output"
import { postsQwRepository } from "../../../posts/repositories/posts.queryRepository"

export const createPostForSpecificBlogHandler = async (
    req: Request<{blogId: string}, {}, postBlogInputModel>,
    res: Response
) => {
    const blogId = req.params.blogId
    const postInputDto: postInputModel = {blogId, ...req.body}

    const createdPostId: ObjectId = await postsServices.create(postInputDto)
    const createdPost: postViewModel = await postsQwRepository.findById(createdPostId)

    res.status(httpStatuses.Created).json(createdPost)
}
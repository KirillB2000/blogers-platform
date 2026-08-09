import { Request, Response } from "express"
import { PostBlogInputModel } from "../../../posts/input/dto/postBlogInputModel"
import { ObjectId } from "mongodb"
import { PostInputModel } from "../../../posts/input/dto/postInputModel"
import { postsServices } from "../../../posts/application/posts.services"
import { httpStatuses } from "../../../core/types/http-statuses"
import { PostViewModel } from "../../../posts/output/post-data.output"
import { postsQwRepository } from "../../../posts/repositories/posts.queryRepository"

export const createPostForSpecificBlogHandler = async (
    req: Request<{blogId: string}, {}, PostBlogInputModel>,
    res: Response
) => {
    const blogId = req.params.blogId
    const postInputDto: PostInputModel = {blogId, ...req.body}

    const createdPostId: ObjectId = await postsServices.create(postInputDto)
    const createdPost: PostViewModel = await postsQwRepository.findById(createdPostId)

    res.status(httpStatuses.Created).json(createdPost)
}
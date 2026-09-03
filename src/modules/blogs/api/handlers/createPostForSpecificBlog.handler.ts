import { Request, Response } from "express"
import { PostBlogInputModel } from "../../../posts/api/input/dto/postBlogInputModel"
import { ObjectId } from "mongodb"
import { PostInputModel } from "../../../posts/api/input/dto/postInputModel"
import { postsServices } from "../../../posts/application/posts.services"
import { PostViewModel } from "../../../posts/api/output/post-data.output"
import { postsQwRepository } from "../../../posts/infrastructure/posts.queryRepository"
import { httpStatuses } from "../../../../core/types/http-statuses"

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
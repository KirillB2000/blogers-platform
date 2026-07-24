import { Request, Response } from "express"
import { postBlogInputModel } from "../../../posts/dto/postBlogInputModel"
import { WithId } from "mongodb"
import { postInputModel } from "../../../posts/dto/postInputModel"
import { Post } from "../../../posts/domain/post"
import { postsServices } from "../../../posts/application/posts.services"
import { httpStatuses } from "../../../core/types/http-statuses"
import { mapToPostViewModel } from "../../../posts/routes/mappers/map-from-post-db-type-to-view-model"

export const createPostForSpecificBlogHandler = async (
    req: Request<{blogId: string}, {}, postBlogInputModel>,
    res: Response
) => {
    try {
        const blogId = req.params.blogId
    
        const postInputDto: postInputModel = {blogId, ...req.body}
    
        const createdPost: WithId<Post> | null = await postsServices.create(postInputDto)
    
        if (!createdPost) {
            res.status(httpStatuses.BadRequest).json({message: 'Blog should exist', field: 'blogId'});
            return;
        }
    
        const postDataForResponse = mapToPostViewModel(createdPost)
    
        res.status(httpStatuses.Created).json(postDataForResponse)
    } catch (error) {
        res.status(httpStatuses.InternalServerError).json({error})
    }
}
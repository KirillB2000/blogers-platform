import { ObjectId } from "mongodb";
import { NotFoundError } from "../../../core/exceptions/app-errors.exeption";
import { PagindatedOutput } from "../../../core/types/paginated.output";
import { CommentQueryInput } from "../api/input/commentQueryInput";
import { CommentListPaginatorOutput } from "../api/output/commentListPaginatorOutput";
import { CommentViewModel } from "../api/output/commentViewModel";
import { mapFromCommentDbTypeToViewModel } from "../mappers/mapFromCommentDbTypeToViewModel";
import { mapToCommentListPaginatedOutput } from "../mappers/mapFromCommentDomainToPaginatedOutput";
import { injectable } from "inversify";
import { CommentsModel } from "./comments.model";

@injectable()
export class CommentsQwRepository {
    async findById (
        id: string
    ): Promise<CommentViewModel> {
        const commentDocument = await CommentsModel.findOne({_id: new ObjectId(id)})

        if (!commentDocument) {
            throw new NotFoundError('Comment not found')
        }

        const commentForResponse: CommentViewModel = mapFromCommentDbTypeToViewModel(commentDocument)

        return commentForResponse
    }

    async findAll (
        queryDto: CommentQueryInput,
        postId: string
    ): Promise<CommentListPaginatorOutput> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection
        } = queryDto

        const skip = (pageNumber - 1) * pageSize
        const filter = {postId: postId}

        const items = await CommentsModel
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip(skip)
            .limit(pageSize)
        
        const totalCount = await CommentsModel.countDocuments(filter)

        const meta: PagindatedOutput = {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount
        }

        const commentsWithPagination: CommentListPaginatorOutput = mapToCommentListPaginatedOutput(items, meta) // Антипаттерн 😒

        return commentsWithPagination
    }
}
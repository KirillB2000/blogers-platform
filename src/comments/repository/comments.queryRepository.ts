import { ObjectId } from "mongodb";
import { commentsCollection } from "../../db/collections";
import { CommentViewModel } from "../output/commentViewModel";
import { mapFromCommentDbTypeToViewModel } from "../mappers/mapFromCommentDbTypeToViewModel";
import { NotFoundError } from "../../core/exceptions/app-errors.exeption";
import { CommentListPaginatorOutput } from "../output/commentListPaginatorOutput";
import { CommentQueryInput } from "../input/commentQueryInput";
import { PagindatedOutput } from "../../core/types/paginated.output";
import { mapToCommentListPaginatedOutput } from "../mappers/mapFromCommentDomainToPaginatedOutput";

export const commentsQwRepository = {
    async findById (
        id: string
    ): Promise<CommentViewModel> {
        const dbComment = await commentsCollection.findOne({_id: new ObjectId(id)})

        if (!dbComment) {
            throw new NotFoundError('Comment not found')
        }

        const commentForResponse: CommentViewModel = mapFromCommentDbTypeToViewModel(dbComment)

        return commentForResponse
    },

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

        const items = await commentsCollection
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip(skip)
            .limit(pageSize)
            .toArray()
        
        const totalCount = await commentsCollection.countDocuments(filter)

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
import { ObjectId } from "mongodb";
import { commentsCollection } from "../../db/collections";
import { CommentViewModel } from "../output/commentViewModel";
import { mapFromCommentDbTypeToViewModel } from "../mappers/mapFromCommentDbTypeToViewModel";
import { NotFoundError } from "../../core/exceptions/app-errors.exeption";

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
    }
}
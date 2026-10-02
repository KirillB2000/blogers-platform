import { injectable } from "inversify";
import { CommentsDocument, CommentsModel } from "./comments.model";

@injectable()
export class CommentsRepository {

    async save (comment: CommentsDocument) {
        await comment.save()
    }

    async delete (
        commentId: string
    ): Promise<boolean> {
        const deletionResult = await CommentsModel.deleteOne({ _id: commentId })
        
        return deletionResult.deletedCount > 0
    }

    async findById (
        commentId: string
    ): Promise<CommentsDocument | null> {
        const commentDocument = await CommentsModel.findById(commentId)

        return commentDocument
    }
}
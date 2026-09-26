import { CommentInputModel } from "../api/input/dto/commentInputModel";
import { injectable } from "inversify";
import { CommentsDocument, CommentsModel, CommentsType } from "./comments.model";

@injectable()
export class CommentsRepository {
    async create (
        comment: CommentsType
    ): Promise<string> {
        const insertResult = await CommentsModel.insertOne(comment)

        return insertResult.id
    }

    async delete (
        commentId: string
    ): Promise<boolean> {
        const deletionResult = await CommentsModel.deleteOne({ _id: commentId })
        
        return deletionResult.deletedCount > 0
    }

    async update (
        commentId: string,
        content: CommentInputModel
    ) {
        const updateResult = await CommentsModel.updateOne(
            { _id: commentId },
            { $set: content}
        )

        return updateResult.matchedCount > 0
    }

    async findById (
        commentId: string
    ): Promise<CommentsDocument | null> {
        const commentDocument = await CommentsModel.findById(commentId)

        return commentDocument
    }

    async updateLikesAndDislikes (
        likesNumber: number,
        dislikesNumber: number,
        commentId: string
    ): Promise<void> {
        await CommentsModel.updateOne(
            { _id: commentId },
            { 
                $inc: { 'likesInfo.likesCount': likesNumber, 'likesInfo.dislikesCount': dislikesNumber }
            }
        )
    }
}
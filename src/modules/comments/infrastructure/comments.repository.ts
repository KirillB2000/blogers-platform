import { ObjectId } from "mongodb";
import { CommentInputModel } from "../api/input/dto/commentInputModel";
import { injectable } from "inversify";
import { CommentsModel, CommentsType } from "./comments.model";

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
        const deletionResult = await CommentsModel.deleteOne({_id: new ObjectId(commentId)})
        
        return deletionResult.deletedCount > 0
    }

    async update (
        commentId: string,
        content: CommentInputModel
    ) {
        const updateResult = await CommentsModel.updateOne(
            {_id: new ObjectId(commentId)},
            { $set: content}
        )

        return updateResult.matchedCount > 0
    }
}
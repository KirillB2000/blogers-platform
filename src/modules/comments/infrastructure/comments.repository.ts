import { ObjectId } from "mongodb";
import { CommentDb } from "../domain/comment";
import { CommentInputModel } from "../api/input/dto/commentInputModel";
import { commentsCollection } from "../../../db/collections";

export const commentsRepository = {
    async create (
        comment: CommentDb
    ): Promise<string> {
        const insertResult = await commentsCollection.insertOne(comment)

        return insertResult.insertedId.toString()
    },

    async delete (
        commentId: string
    ): Promise<boolean> {
        const deletionResult = await commentsCollection.deleteOne({_id: new ObjectId(commentId)})
        
        return deletionResult.deletedCount > 0
    },

    async update (
        commentId: string,
        content: CommentInputModel
    ) {
        const updateResult = await commentsCollection.updateOne(
            {_id: new ObjectId(commentId)},
            { $set: content}
        )

        return updateResult.matchedCount > 0
    }
}
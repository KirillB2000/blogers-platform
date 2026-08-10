import { ObjectId } from "mongodb";
import { commentsCollection } from "../../db/collections";
import { PComment } from "../input/comment";
import { CommentInputModel } from "../input/dto/commentInputModel";

export const commentsRepository = {
    async create (
        comment: PComment
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
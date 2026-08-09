import { commentsCollection } from "../../db/collections";
import { PComment } from "../input/comment";

export const commentsRepository = {
    async create (
        comment: PComment
    ): Promise<string> {
        const insertResult = await commentsCollection.insertOne(comment)

        return insertResult.insertedId.toString()
    }
}
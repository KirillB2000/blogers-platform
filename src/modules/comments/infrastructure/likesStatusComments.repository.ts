import { injectable } from "inversify";
import { LikesStatusDocument, LikesStatusModel, LikeStatus } from "./likesStatus.model";

@injectable()
export class LikesStatusCommentsRepository {

    async saveLikeStatus(
        userId: string,
        commentId: string,
        likeStatus: LikeStatus
    ): Promise<void> {
        const likeStatusDb = new LikesStatusModel()
        likeStatusDb.userId = userId
        likeStatusDb.commentId = commentId
        likeStatusDb.myStatus = likeStatus

        await likeStatusDb.save()
    }

    async findLikeStatusForSpecificComment (
        userId: string, 
        commentId: string
    ): Promise<LikesStatusDocument | null> {
        const likeStatusDocument = await LikesStatusModel.findOne(
            { userId: userId, commentId: commentId }
        )

        return likeStatusDocument
    }

    async deleteLikeStatus (
        userId: string,
        commentId: string
    ): Promise<void> {
        await LikesStatusModel.deleteOne(
            { userId: userId, commentId: commentId }
        )
    }

    async updateLikeStatus (
        userId: string,
        commentId: string,
        likeStatus: LikeStatus
    ): Promise<void> {
        await LikesStatusModel.updateOne(
            { userId: userId, commentId: commentId },
            { $set: { myStatus: likeStatus } }
        )
    }
}
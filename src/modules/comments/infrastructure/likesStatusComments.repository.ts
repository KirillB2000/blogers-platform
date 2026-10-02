import { injectable } from "inversify";
import { LikesStatusDocument, LikesStatusModel } from "./likesStatus.model";

@injectable()
export class LikesStatusCommentsRepository {

    async save (likeStatusD: LikesStatusDocument) {
        await likeStatusD.save()
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
}
import { injectable } from "inversify";
import { PostLikesStatusDocument, PostLikesStatusModel } from "./postsLikesStatus.model";

@injectable()
export class PostsLikesStatusRepository {
    async save (postLikeStatusDoc: PostLikesStatusDocument) {
        await postLikeStatusDoc.save()
    }

    async findLikeStatusForSpecificPost(
        userId: string, 
        postId: string
    ): Promise<PostLikesStatusDocument | null> {
        const postLikeStatusDoc = await PostLikesStatusModel.findOne(
            {userId: userId, postId: postId}
        )

        return postLikeStatusDoc
    }

    async deleteLikeStatus (
        userId: string,
        postId: string
    ): Promise<void> {
        await PostLikesStatusModel.deleteOne(
            { userId: userId, postId: postId }
        )
    }
}
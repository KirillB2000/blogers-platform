import { LikeStatus } from "../../../../core/types/likeStatus"
import { LikeDetailsViewModel } from "./postLikeDetailsViewModel"

export type ExtendedLikesInfoViewModel = {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatus
    newestLikes: LikeDetailsViewModel[] | []
}
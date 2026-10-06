import { LikeStatus } from "../../../../core/types/likeStatus"

export type LikesInfoViewModel = {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatus
}
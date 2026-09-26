import { LikeStatus } from "../../infrastructure/likesStatus.model"

export type LikesInfoViewModel = {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatus
}
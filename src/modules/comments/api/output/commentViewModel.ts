import { CommentatorInfoType } from "../../infrastructure/comments.model"
import { LikesInfoViewModel } from "./likesInfoViewModel"

export type CommentViewModel = {
    id: string
    content: string
    commentatorInfo: CommentatorInfoType
    createdAt: Date,
    likesInfo: LikesInfoViewModel
}
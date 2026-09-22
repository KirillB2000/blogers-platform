import { CommentatorInfoType } from "../../infrastructure/comments.model"

export type CommentViewModel = {
    id: string
    content: string
    commentatorInfo: CommentatorInfoType
    createdAt: Date
}
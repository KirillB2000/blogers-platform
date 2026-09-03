import { CommentatorInfo } from "./commentatorInfo"

export type CommentViewModel = {
    id: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: Date
}
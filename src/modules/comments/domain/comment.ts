import { CommentatorInfo } from "../api/output/commentatorInfo"

export type CommentDb = {
    postId: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: Date
}
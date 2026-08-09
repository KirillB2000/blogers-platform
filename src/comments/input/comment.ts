import { CommentatorInfo } from "../output/commentatorInfo"

export type PComment = {
    postId: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: Date
}
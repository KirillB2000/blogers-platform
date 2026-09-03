import { CommentInputModel } from "../../../src/modules/comments/api/input/dto/commentInputModel"

export const commentDto = (
    
): CommentInputModel => {
    return {
        content: 'Content with correct length between 20 and 300 chars'
    }
}
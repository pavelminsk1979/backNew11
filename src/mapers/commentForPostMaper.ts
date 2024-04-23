
import {NewOutputComment} from "../allTypes/commentTypes";




export const commentForPostMaper = (newComment:any):NewOutputComment => {
    debugger
    return {
        id:newComment.id,
        content: newComment.content,
        createdAt: newComment.createdAt,
        commentatorInfo: {
            userId:newComment.commentatorInfo.userId,
            userLogin:newComment.commentatorInfo.userLogin
        },
        "likesInfo": {
            "likesCount": 0,
            "dislikesCount": 0,
            "myStatus": "None"
        }
    }
}
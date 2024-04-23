import {LikeComment} from "../allTypes/LikesCommentsTypes";

export const newCommentMapper = (
    documenComment:any,
    documentLikeComent: LikeComment | null,
    likesCount:number, dislikesCount:number) => {

    if (!documentLikeComent) {
        return {
            id: documenComment._id.toString(),
            content: documenComment.content,
            createdAt: documenComment.createdAt,
            commentatorInfo: {
                userId: documenComment.commentatorInfo.userId,
                userLogin: documenComment.commentatorInfo.userLogin
            },
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None"
            }
        }
    }


    const myStatus=documentLikeComent.statusLike


    return {
        id: documenComment._id.toString(),
        content: documenComment.content,
        createdAt: documenComment.createdAt,
        commentatorInfo: {
            userId: documenComment.commentatorInfo.userId,
            userLogin: documenComment.commentatorInfo.userLogin
        },
        likesInfo: {
            likesCount,
            dislikesCount,
            myStatus
        }
    }

}
import {OutputComment} from "../allTypes/commentTypes";
import {LikeComment, StatusLike} from "../allTypes/LikesCommentsTypes";


export const commentsMaperWithInfoLikeComment = async (
    arrayComentsWithoutLike: OutputComment[],
    userId: string | null,
    arrayDocumentsFromLikeCollection: LikeComment[]
) => {

    const arrayComments = arrayComentsWithoutLike.map((coment: OutputComment) => {

        //нахожу все документы из масива ЛайкКомент у которых
        //айдиКомент такаяже как у текущего коментари
        const likesCommentByIdComment = arrayDocumentsFromLikeCollection.filter(e => e.commentId === coment.id)


        // чтобы установить myStatus юзера который
        // делает данный запрос
        const likeComent = likesCommentByIdComment.find(el => el.userId === userId)

        //чтобы количество Лайкнутых коментариев узнать
        const likesCount = likesCommentByIdComment.filter(e => e.statusLike === StatusLike.Like).length

        //чтобы количество ДизЛайкнутых коментариев узнать
        const dislikesCount = likesCommentByIdComment.filter(e => e.statusLike === StatusLike.Dislike).length

        return {
            id: coment.id,
            content: coment.content,
            createdAt: coment.createdAt,
            commentatorInfo: {
                userId: coment.commentatorInfo.userId,
                userLogin: coment.commentatorInfo.userLogin
            },
            likesInfo: {
                likesCount: likesCount ? likesCount : 0,
                dislikesCount: dislikesCount?dislikesCount:0,
                myStatus: likeComent ? likeComent.statusLike : "None"
            }
        }
    })

    return arrayComments
}
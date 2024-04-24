import {commentsRepository} from "../repositories/comments/comments-repository";
import {LikeComment, StatusLike} from "../allTypes/LikesCommentsTypes";
import {LikesCommentsRepository} from "../repositories/LikesCommentsRepository";


export const commentsSevrice = {

    async deleteComentById(idComent: string) {

        return commentsRepository.deleteComentById(idComent)

    },


    async updateComment(commentId: string, content: string) {
        return commentsRepository.updateComment(commentId, content)
    },


    async setOrUpdateLikeStatus(
        commentId: string,
        statusLike: StatusLike,
        userId: string) {


        /*    ищу в базе обьект один документ   по userId---*/
        const documentByUserId = await LikesCommentsRepository.findDocumentByUserId(userId)

        /*Если документа  нет тогда надо добавить
   newDocumentForCollectionLikesComments в базу*/

        const newDocumentForCollectionLikesComments: LikeComment = {
            commentId, userId, statusLike}


        if (!documentByUserId) {
            return LikesCommentsRepository.addNewDocumentForLikeCommentCollention(newDocumentForCollectionLikesComments)
        }

        /*Если документ есть тогда надо изменить
        statusLike на приходящий */

            return LikesCommentsRepository.setNewStatusLike(userId, statusLike)

    },
}
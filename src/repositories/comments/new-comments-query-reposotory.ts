import {ObjectId} from "mongodb";
import {commentsModel, LikesCommentsModel} from "../../db/mongoDb";
import {newCommentMapper} from "../../mapers/newCommentMapper";
import {StatusLike} from "../../allTypes/LikesCommentsTypes";

export const newCommentsQueryRepository = {

    async findCommentById(id: string, userId: string | null) {

/*данные коментария из одной колекции достану , и чтоб ответ
        мапером собрать нужны данные из
        колекции likeComment*/

        const documenComment = await commentsModel.findOne({_id: new ObjectId(id)})

        if (!documenComment) return null


       /* в колекцииЛайков много документов с одинаковыми commentId -разные
        юзеры лайкают один документ. Ищу документ по двум полям
        commentId  и userId. Конкретный юзер может в конкретном
        документе поставить только один лайк*/

        const documentLikeComent = await LikesCommentsModel.findOne({
            commentId: new ObjectId(id),userId})



        const likesCount = await LikesCommentsModel.countDocuments({ commentId: new ObjectId(id), statusLike: StatusLike.Like });

        const dislikesCount = await LikesCommentsModel.countDocuments({ commentId: new ObjectId(id), statusLike: StatusLike.Dislike });



        return newCommentMapper(
            documenComment,
            documentLikeComent,
            likesCount,
            dislikesCount)

    }

}
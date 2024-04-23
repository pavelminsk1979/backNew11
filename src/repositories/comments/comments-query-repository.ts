import {commentsModel, LikesCommentsModel} from "../../db/mongoDb";
import {ObjectId} from "mongodb";
import {commentMaper} from "../../mapers/commentMaper";
import {OutputComment, SortDataGetCoomentsForCorrectPost} from "../../allTypes/commentTypes";
import {commentMaperWithoutLike} from "../../mapers/commentMaperWithoutLike";
import {commentsMaperWithInfoLikeComment} from "../../mapers/commentsMaperWithInfoLikeComment";
import {LikeComment} from "../../allTypes/LikesCommentsTypes";




export const commentsQueryRepository = {

    async findCommentById(id: string) {

        const comment = await commentsModel.findOne({_id: new ObjectId(id)})

        if(!comment) return null

        return commentMaper(comment)
    },


    async getCommentsForCorrectPost(
        postId:string,
        sortData:SortDataGetCoomentsForCorrectPost,
        userId:string|null){


        const {sortBy,
            sortDirection,
            pageNumber,
            pageSize} = sortData


        const sortDirectionValue = sortDirection === 'asc' ? 1 : -1;

        const comments = await commentsModel
            .find({postId})
            .sort({ [sortBy]: sortDirectionValue } )
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .exec()

        const totalCount = await commentsModel.countDocuments({postId})

        const pagesCount = Math.ceil(totalCount / pageSize)




        /* из базы из колекции лайковКоментариев достаю только те документы у которых айдишкаКкоментария совпадает с
         айдишкамиКОментариев из  массиве comments*/
        const arrayDocumentsFromLikeCollection:LikeComment[] = await LikesCommentsModel.aggregate([
            { $match: { commentId: { $in: comments } } },
            { $group: { _id: '$commentId', count: { $sum: 1 } } }
        ]);


        //Промежуточный вид  массива создаюдля для возврата на фронт
        // массив  без информации об Лайках
        const arrayComentsWithoutLike:OutputComment[] = commentMaperWithoutLike(comments)

        // массив со всеми свойствами согласно SWAGER
        const arrayComments = commentsMaperWithInfoLikeComment(
            arrayComentsWithoutLike
            ,userId,
            arrayDocumentsFromLikeCollection)

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: arrayComments
        }
    }
}
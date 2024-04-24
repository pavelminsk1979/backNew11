import {LikesCommentsModel} from "../db/mongoDb";
import {LikeComment, StatusLike} from "../allTypes/LikesCommentsTypes";

export const LikesCommentsRepository = {


    async findDocumentByUserIdAndCommentId(userId: string,commentId: string) {

        return LikesCommentsModel.findOne({ userId , commentId});

    },

    async setNewStatusLike(userId: string, statusLike: StatusLike) {

        return  LikesCommentsModel.findOneAndUpdate(
            { userId},
            {$set: {statusLike}});
        },


    async addNewDocumentForLikeCommentCollention(newDocumentForCollectionLikesComments:LikeComment) {

        return  LikesCommentsModel.create(
            newDocumentForCollectionLikesComments)
    }


}
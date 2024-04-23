import {LikesCommentsModel} from "../db/mongoDb";
import {LikeComment, StatusLike} from "../allTypes/LikesCommentsTypes";

export const LikesCommentsRepository = {

    async findDocumentByUserId(userId: string) {

        return LikesCommentsModel.findOne({ userId });

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
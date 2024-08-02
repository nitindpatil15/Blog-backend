import mongoose ,{Schema} from "mongoose";

const LikeSchema = new Schema({
    comment: {
        type : Schema.Types.ObjectId,
        ref : "Comment"
    },
    likedBy: {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    blog: {
        type : Schema.Types.ObjectId,
        ref : "Blog"
    },
},{
    timestamps: true
})


export const Like = mongoose.model( 'Like', LikeSchema );
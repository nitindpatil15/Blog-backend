import mongoose,{Schema, Types} from "mongoose";

const blogSchema =new Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
    },
    image:{
        type:String,  //image url
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
}) 

const Blog = mongoose.model("Blog", blogSchema);
export default Blog
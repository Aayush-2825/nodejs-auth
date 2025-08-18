import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
    url:{
        type: String,
        required: true
    },
    publicID:{
        type: String,
        required: true
    },
    uploadedBY:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
},{timestamps: true})


export default mongoose.model('Image',ImageSchema)
import cloudinary from "../config/cloudinary.js"
import { uploadToCloudinary } from "../helpers/cloudinaryHelper.js"
import Image from '../models/image.js'
import fs from 'fs'


export const uploadImageController = async(req,res)=>{
    try {
        if(!req.file){
            return res.status(400).json({
                success: false,
                message: "file is required"
            })
        }
        
        const{url,publicID} = await uploadToCloudinary(req.file.path)
        
        const uploadedImage = new Image({
            url,
            publicID,
            uploadedBY: req.userInfo.userID
        })

        await uploadedImage.save()

        fs.unlinkSync(req.file.path);

        res.status(201).json({
            success: true,
            message: "Image uploaded successfully",
            image: uploadedImage
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "something went wrong"
        })
    }
}

export const fetchImageController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    const sortObj = {};
    sortObj[sortBy] = sortOrder;
    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

    if (images) {
      res.status(200).json({
        success: true,
        currentPage: page,
        totalPages: totalPages,
        totalImages: totalImages,
        data: images,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

export const deleteImageController = async (req, res) => {
  try {
    const getCurrentIdOfImageToBeDeleted = req.params.id;
    const userID = req.userInfo.userID;
    const image = await Image.findById(getCurrentIdOfImageToBeDeleted);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    //check if this image is uploaded by the current user who is trying to delete this image
    if (image.uploadedBY.toString() !== userID) {
      return res.status(403).json({
        success: false,
        message: `You are not authorized to delete this image because you haven't uploaded it`,
      });
    }

    //delete this image first from your cloudinary storage
    await cloudinary.uploader.destroy(image.publicID);

    //delete this image from mongodb database
    await Image.findByIdAndUpdate(getCurrentIdOfImageToBeDeleted);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};
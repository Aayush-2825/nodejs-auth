import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { adminMiddleware } from "../middleware/admin-middleware.js";
import { uploadMiddleware } from "../middleware/upload-middleware.js";
import { deleteImageController, fetchImageController, uploadImageController } from "../controllers/image-controller.js";

const uploadRouter = express.Router()

uploadRouter.post('/upload',authMiddleware,adminMiddleware,uploadMiddleware.single('image'),uploadImageController)
uploadRouter.get('/fetch',authMiddleware,fetchImageController)
uploadRouter.delete('/:id',authMiddleware,adminMiddleware,deleteImageController)

export default uploadRouter
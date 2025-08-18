import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { adminMiddleware } from "../middleware/admin-middleware.js";

const adminRouter = express.Router()

adminRouter.get('/welcome',authMiddleware,adminMiddleware,(req,res)=>{
    res.status(200).json({
        message: 'Welcome'
    })
})

export default adminRouter
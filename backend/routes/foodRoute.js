import express from 'express'
import { addFood, listFood, removeFood } from '../controllers/foodController.js'
import multer from 'multer'

const foodRouter = express.Router();

// Image Storage Engine (Using memory storage for S3)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get('/list',listFood)
foodRouter.post('/remove', removeFood)

export default foodRouter;
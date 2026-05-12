import foodModel from '../models/foodModel.js'
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { s3 } from "../config/s3.js"

// Add food item
const addFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image is required' })
    }

    const imageKey = `food-images/${Date.now()}-${req.file.originalname}`;

    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: imageKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    }));

    const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageKey}`;

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      image: imageUrl
    })

    await food.save();
    res.json({ success: true, message: 'Food Added', imageUrl })

  } catch (error) {
    console.error('addFood error:', error.message)
    res.status(500).json({ success: false, message: 'Failed to add food' })
  }
}

// All food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods })
  } catch (error) {
    console.error('listFood error:', error.message)
    res.status(500).json({ success: false, message: 'Failed to fetch food list' })
  }
}

// Remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);

    if (!food) {
      return res.status(404).json({ success: false, message: 'Food not found' })
    }

    // Delete image from S3 if it's an S3 URL
    if (food.image && food.image.includes(".amazonaws.com/")) {
      const imageKey = food.image.split(".amazonaws.com/")[1];

      await s3.send(new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: imageKey
      }));
    }

    await foodModel.findByIdAndDelete(req.body.id)
    res.json({ success: true, message: 'Food Removed' })

  } catch (error) {
    console.error('removeFood error:', error.message)
    res.status(500).json({ success: false, message: 'Failed to remove food' })
  }
}

export { addFood, listFood, removeFood }
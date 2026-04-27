import fs from 'fs'
import foodModel from '../models/foodModel.js'

// Add food item
const addFood = async (req, res) => {
  try {
    // ✅ التحقق من وجود الصورة
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image is required' })
    }

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      image: req.file.filename
    })

    await food.save();
    res.json({ success: true, message: 'Food Added' })

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

    // ✅ FIX: بس امسح الصورة لو كانت ملف محلي (مش URL من الإنترنت)
    if (food.image && !food.image.startsWith('http')) {
      const imagePath = `uploads/${food.image}`;
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) console.error('Failed to delete image:', err.message)
        })
      }
    }

    await foodModel.findByIdAndDelete(req.body.id)
    res.json({ success: true, message: 'Food Removed' })

  } catch (error) {
    console.error('removeFood error:', error.message)
    res.status(500).json({ success: false, message: 'Failed to remove food' })
  }
}

export { addFood, listFood, removeFood }
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'

// ── Create JWT with expiry ────────────────────
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d' // ✅ Token ينتهي بعد 7 أيام
  })
}

// ── Login ─────────────────────────────────────
const loginUser = async (req, res) => {
  const { email, password } = req.body

  // التحقق من وجود البيانات
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' })
  }

  try {
    const user = await userModel.findOne({ email: email.toLowerCase().trim() })

    // ✅ نفس الرسالة للـ user غير موجود وكلمة مرور غلط (أمان أعلى)
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    const token = createToken(user._id)
    res.json({ success: true, token })

  } catch (error) {
    console.error('Login error:', error.message)
    res.status(500).json({ success: false, message: 'Something went wrong, please try again' })
  }
}

// ── Register ──────────────────────────────────
const registerUser = async (req, res) => {
  const { name, password, email } = req.body

  // التحقق من وجود البيانات
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' })
  }

  try {
    // ✅ Sanitize الـ email
    const cleanEmail = email.toLowerCase().trim()
    const cleanName = name.trim()

    // التحقق من صحة الـ email
    if (!validator.isEmail(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email' })
    }

    // التحقق من قوة كلمة المرور
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' })
    }

    // التحقق من الاسم
    if (cleanName.length < 2) {
      return res.status(400).json({ success: false, message: 'Name must be at least 2 characters' })
    }

    // هل المستخدم موجود؟
    const exists = await userModel.findOne({ email: cleanEmail })
    if (exists) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' })
    }

    // Hash كلمة المرور
    const salt = await bcrypt.genSalt(12) // ✅ 12 بدل 10 — أقوى
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new userModel({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword
    })

    const user = await newUser.save()
    const token = createToken(user._id)

    res.status(201).json({ success: true, token })

  } catch (error) {
    console.error('Register error:', error.message)
    res.status(500).json({ success: false, message: 'Something went wrong, please try again' })
  }
}

export { loginUser, registerUser }
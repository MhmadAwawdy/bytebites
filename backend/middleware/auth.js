import jwt from 'jsonwebtoken'

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, please login again' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.body.userId = decoded.id
    next()
  } catch (error) {
    // التمييز بين token منتهي وtoken غلط
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired, please login again' })
    }
    return res.status(401).json({ success: false, message: 'Invalid token, please login again' })
  }
}

export default authMiddleware
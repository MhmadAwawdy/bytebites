import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import foodRouter from './routes/foodRoute.js'
import userRouter from './routes/userRoute.js'
import 'dotenv/config'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

const app = express()

// ✅ PORT من .env مش hardcoded
const port = process.env.PORT || 4000

// ── Middleware ────────────────────────────────
app.use(express.json())
app.use(cors())

// ── DB ────────────────────────────────────────
connectDB()

// ── Routes ────────────────────────────────────
app.use("/api/food", foodRouter)
app.use("/images", express.static('uploads'))
app.use('/api/user', userRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend is healthy",
    service: "Byte Bites Backend"
  });
});

app.get("/", (req, res) => {
  res.json({ success: true, message: 'API is running 🚀' })
})

// ── 404 ───────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// ── Global Error Handler ──────────────────────
app.use((err, req, res, next) => {
  console.error('Server error:', err.message)
  res.status(500).json({ success: false, message: 'Internal server error' })
})

// ── Start ─────────────────────────────────────
app.listen(port, () => {
  console.log(`🚀 Server started on http://localhost:${port}`)
})
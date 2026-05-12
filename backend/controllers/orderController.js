import orderModel from './../models/orderModel.js';
import userModel from './../models/userModel.js';
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Placing user order for frontend
const placeOrder = async (req, res) => {

  // ✅ FIX 1: مش hardcoded — من .env
  const frontend_url = process.env.FRONTEND_URL || 'http://bytebites-frontend-nosayba-2.s3-website-us-east-1.amazonaws.com';

  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address
    })

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // ✅ FIX 2: العملة usd بدل lkr، والسعر صح
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name
        },
        unit_amount: Math.round(item.price * 100) // cents
      },
      quantity: item.quantity
    }))

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charges"
        },
        unit_amount: 200 // $2.00
      },
      quantity: 1
    })

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: 'payment',
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
    })

    res.json({ success: true, session_url: session.url })

  } catch (error) {
    console.error('placeOrder error:', error.message)
    res.status(500).json({ success: false, message: "Failed to place order" })
  }
}

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === 'true') {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" })
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" })
    }
  } catch (error) {
    console.error('verifyOrder error:', error.message)
    res.status(500).json({ success: false, message: "Verification failed" })
  }
}

// user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId })
    res.json({ success: true, data: orders })
  } catch (error) {
    console.error('userOrders error:', error.message)
    res.status(500).json({ success: false, message: "Failed to fetch orders" })
  }
}

// listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders })
  } catch (error) {
    console.error('listOrders error:', error.message)
    res.status(500).json({ success: false, message: "Failed to fetch orders" })
  }
}

// api for updating order status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status })
    res.json({ success: true, message: "Status Updated" })
  } catch (error) {
    console.error('updateStatus error:', error.message)
    res.status(500).json({ success: false, message: "Failed to update status" })
  }
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus }
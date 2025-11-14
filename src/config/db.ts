import dotenv from 'dotenv'
dotenv.config()


import mongoose from 'mongoose'

const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI as string // <-- Sửa từ DB_URL thành MONGO_URI
    if (!uri) {
      
      throw new Error('MONGO_URI is not defined in .env') 
    }
    await mongoose.connect(uri)
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1) // dừng app nếu không connect được
  }
}

export default connectDB
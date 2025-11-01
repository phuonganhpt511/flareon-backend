import { ORDER_STATUS, STATUS_FEEDBACK } from '~/constants/enum'
import FeedBack from '../models/feedback.model'
import FeedBackRespone from '../models/feedback-res.model'
import Order from '../models/order.model'
import OrderItem from '../models/order-item.model'
import { Types } from 'mongoose'

export const createFeedBackService = async (
  user_id: string,
  order_id: string,
  dish_id: string,
  type: string,
  rating: number,
  content: string,
  image?: string | null
) => {
  try {
    if (!user_id || !order_id || !dish_id || !type || !rating || !content) {
      return {
        success: false,
        message: 'Missing required fields'
      }
    }

    if (rating < 1 || rating > 5) {
      return {
        success: false,
        message: 'Rating must be between 1 and 5'
      }
    }

    const order = await Order.findOne({
      _id: order_id,
      user_id: user_id,
      status: ORDER_STATUS.COMPLETED
    })

    if (!order) {
      return {
        success: false,
        message: 'Order not found or not completed'
      }
    }

    const orderItem = await OrderItem.findOne({
      order_id,
      dish_id
    })
    if (!orderItem) {
      return {
        success: false,
        message: 'Dish not found in this order'
      }
    }

    const existedFeedback = await FeedBack.findOne({
      user_id,
      order_id,
      dish_id
    })

    if (existedFeedback) {
      return {
        success: false,
        message: 'You already gave feedback for this dish in this order'
      }
    }

    const newFeedback = await FeedBack.create({
      user_id,
      order_id,
      dish_id,
      type,
      rating,
      content,
      image: image || null,
      status: STATUS_FEEDBACK.PENDING
    })

    return {
      success: true,
      message: 'Feedback created successfully',
      data: newFeedback
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error creating feedback'
    }
  }
}

export const getAllFeedBackService = async () => {
  try {
    const data = await FeedBack.find()
    return data
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error Get FeedBack'
    }
  }
}

export const getFeedBackByDishIdSV = async (dish_id: string) => {
  try {
    const feedBack = await FeedBack.find({ dish_id: dish_id }).populate('user_id', 'username email')

    return {
      success: true,
      data: feedBack
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error Get feedBack By dishid'
    }
  }
}

export const getDetailFeedbackSV = async (id: string) => {
  try {
    const feedback = await FeedBack.findById(id)
      .populate('user_id', 'username email')
      .populate('dish_id', 'dish_name')
      .lean()

    if (!feedback) {
      return {
        success: false,
        message: 'Feedback not found'
      }
    }

    return {
      success: true,
      data: feedback
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error Get Detail FeedBack'
    }
  }
}

export const updateFeedbackSV = async (id: string, status: string) => {
  try {
    const validStatuses = Object.values(STATUS_FEEDBACK)
    if (!validStatuses.includes(status as STATUS_FEEDBACK)) {
      return {
        success: false,
        message: `Trạng thái không hợp lệ! Chỉ chấp nhận: ${validStatuses.join(', ')}`
      }
    }
    const feedback = await FeedBack.findByIdAndUpdate(id, { status }, { new: true })
      .populate('user_id', 'username email')
      .populate('dish_id', 'dish_name')
      .lean()

    if (!feedback) {
      return { success: false, message: 'Không tìm thấy feedback để cập nhật' }
    }
    return {
      success: true,
      message: 'Cập nhật trạng thái feedback thành công',
      data: feedback
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error Get Detail FeedBack'
    }
  }
}

export const deleteFeedbackService = async (id: string) => {
  try {
    if (!id) throw new Error('Thiếu feedback id')

    const feedback = await FeedBack.findById(id)
    if (!feedback) {
      return {
        success: false,
        message: 'Feedback không tồn tại'
      }
    }

    if (feedback.status === STATUS_FEEDBACK.PENDING) {
      return {
        success: false,
        message: 'Feedback chưa được xử lý, không thể xóa'
      }
    }

    await FeedBack.findByIdAndDelete(id)

    return {
      success: true,
      message: 'Feedback đã được xóa thành công'
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Delete faild'
    }
  }
}

export const createFeedbackResponseService = async (feedback_id: string, user_id: string, content: string) => {
  if (!content) throw new Error('Content is required')
  const feedback = await FeedBack.findById(feedback_id)
  if (!feedback) throw new Error('Feedback không tồn tại')

  const newResponse = new FeedBackRespone({
    feedback_id: new Types.ObjectId(feedback_id),
    user_id: user_id ? new Types.ObjectId(user_id) : undefined,
    content,
    createAt: new Date()
  })

  feedback.status = STATUS_FEEDBACK.RESOLVED
  await feedback.save()
  return await newResponse.save()
}

export const getResponsesByFeedbackService = async (feedback_id: string) => {
  const responses = await FeedBackRespone.find({ feedback_id })
    .populate('user_id', 'username email')
    .sort({ createAt: -1 })

  return responses
}

export const getResponseDetailService = async (id: string) => {
  const response = await FeedBackRespone.findById(id).populate('user_id', 'name email')
  if (!response) throw new Error('Response not found')
  return response
}

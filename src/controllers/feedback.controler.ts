import { Request, Response } from 'express'
import { DEFAULT_MESSAGE } from '~/constants/message'
import {
  createFeedbackResponseService,
  createFeedBackService,
  deleteFeedbackService,
  getAllFeedBackService,
  getDetailFeedbackSV,
  getFeedBackByDishIdSV,
  getResponseDetailService,
  getResponsesByFeedbackService,
  updateFeedbackSV
} from '~/services/feedback.service'

export const getAllFeedBackControler = async (req: Request, res: Response) => {
  try {
    const data = await getAllFeedBackService()
    return res.status(200).json({ message: DEFAULT_MESSAGE.DEFAULT_SUCCESS, data })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server Error Get All FeedBack'
    })
  }
}

export const createFeedBackControler = async (req: Request, res: Response) => {
  try {
    const { user_id, order_id, dish_id, type, rating, content, image } = req.body

    const newFeedBack = await createFeedBackService(user_id, order_id, dish_id, type, rating, content, image)

    return res.status(200).json({ message: DEFAULT_MESSAGE.DEFAULT_SUCCESS, newFeedBack })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server Error create FeedBack'
    })
  }
}

export const getFeedBackByDishIdControler = async (req: Request, res: Response) => {
  try {
    const { dish_id } = req.params

    if (!dish_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing dish_id'
      })
    }

    const result = await getFeedBackByDishIdSV(dish_id)

    if (!result.success) {
      return res.status(500).json(result)
    }

    return res.status(200).json(result)
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error while getting feedback by dish_id'
    })
  }
}

export const getDetailFeedbackControler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Missing feedback ID'
      })
    }

    const result = await getDetailFeedbackSV(id)

    if (!result.success) {
      return res.status(404).json(result)
    }

    return res.status(200).json({ mesage: DEFAULT_MESSAGE.DEFAULT_SUCCESS, result })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error while getting feedback detail'
    })
  }
}

export const updateFeedbackStatusController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const result = await updateFeedbackSV(id, status)

    if (!result.success) {
      return res.status(400).json(result)
    }

    return res.status(200).json({ success: true, message: DEFAULT_MESSAGE.DEFAULT_SUCCESS, result })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteFeedbackController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const result = await deleteFeedbackService(id)

    if (!result.success) {
      return res.status(400).json(result)
    }

    return res.status(200).json(result)
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Đã xảy ra lỗi khi xóa feedback'
    })
  }
}

export const createFeedbackResponseController = async (req: Request, res: Response) => {
  try {
    const { feedback_id } = req.params
    const { content } = req.body
    const user = (req as any).user

    const response = await createFeedbackResponseService(feedback_id, user.id, content)

    res.status(201).json({
      success: true,
      message: 'Response created successfully',
      data: response
    })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const getResponsesByFeedbackController = async (req: Request, res: Response) => {
  try {
    const { feedback_id } = req.params
    const responses = await getResponsesByFeedbackService(feedback_id)

    res.status(200).json({
      success: true,
      data: responses
    })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getResponseDetailController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const response = await getResponseDetailService(id)

    res.status(200).json({
      success: true,
      data: response
    })
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message })
  }
}

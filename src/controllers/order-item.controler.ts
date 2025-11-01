import { Request, Response } from 'express'
import { DEFAULT_MESSAGE } from '~/constants/message'
import {
  getOrderItemsByUserOrTableService,
  getOrderItemService,
  updateSttOrderItemService
} from '~/services/order-item.service'

export const getOrderItemControler = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params
    const Orderitems = await getOrderItemService(orderId)

    return res.status(200).json({ message: DEFAULT_MESSAGE.DEFAULT_SUCCESS, Orderitems })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const updateSttOderItemControler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params // lấy id từ URL
    const { status } = req.body // lấy status từ body

    const result = await updateSttOrderItemService(id, status)

    return res.status(200).json({ message: DEFAULT_MESSAGE.DEFAULT_SUCCESS, result })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const getOrderItemsByUserOrTableController = async (req: Request, res: Response) => {
  try {
    const user_id = req.query.user_id as string | undefined
    const table_id = req.query.table_id as string | undefined

    const result = await getOrderItemsByUserOrTableService(user_id, table_id)
    return res.status(200).json({ message: DEFAULT_MESSAGE.DEFAULT_SUCCESS, result })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

import { Request, Response } from 'express'
import { DEFAULT_MESSAGE } from '~/constants/message'
import { checkoutCartService } from '~/services/cart.service'
import {
  createOrderService,
  deleteOrderService,
  getAllOrderService,
  getDetailOrderByTableIdService,
  updateOrderService,
  updateOrderStatusService,
  checkTableBusyService // <-- 1. IMPORT HÀM MỚI
} from '~/services/order.service'

export const getAllOrderControler = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1
    const limit = parseInt(req.query.limit as string, 10) || 10
    const status = req.query.status as string
    const search = req.query.search as string | undefined

    const result = await getAllOrderService(page, limit, status, search)

    return res.status(200).json({
      message: DEFAULT_MESSAGE.DEFAULT_SUCCESS,
      data: result
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const getDetailOrderByTableIdController = async (req: Request, res: Response) => {
  try {
    const { tableId } = req.params

    const order = await getDetailOrderByTableIdService(tableId)

    if (!order) {
      return res.status(404).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
    }

    return res.status(200).json({
      message: DEFAULT_MESSAGE.DEFAULT_SUCCESS,
      data: order
    })
  } catch (error) {
    // console.error(error)
    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const createOrderControler = async (req: Request, res: Response) => {
  try {
    const data = await createOrderService(req.body)
    return res.status(200).json({
      message: DEFAULT_MESSAGE.DEFAULT_SUCCESS,
      data
    })
  } catch (error) {
    console.log(error)

    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const updateOrderControler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const data = await updateOrderService(id, req.body)
    return res.status(200).json({
      message: DEFAULT_MESSAGE.DEFAULT_SUCCESS,
      data
    })
  } catch (error) {
    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const updateOrderStatusController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!status) {
      return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
    }

    const updateOrder = await updateOrderStatusService(id, status.toUpperCase())

    if (!updateOrder) {
      return res.status(404).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
    }

    return res.status(200).json({
      message: DEFAULT_MESSAGE.DEFAULT_SUCCESS,
      data: updateOrder
    })
  } catch (error) {
    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const deleteOrderControler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await deleteOrderService(id)
    return res.status(200).json({ message: DEFAULT_MESSAGE.DEFAULT_SUCCESS })
  } catch (error) {
    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const checkoutCartController = async (req: Request, res: Response) => {
  try {
    const { user_id, table_id } = req.body

    if (!user_id || !table_id) {
      return res.status(400).json({
        success: false,
        message: 'user_id and table_id are required'
      })
    }

    const order = await checkoutCartService(user_id, table_id)

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to checkout cart'
    })
  }
}

// === 2. THÊM CONTROLLER MỚI VÀO CUỐI ===
export const checkTableBusyController = async (req: Request, res: Response) => {
  try {
    const { tableId } = req.params;
    const result = await checkTableBusyService(tableId);

    // Trả về { isBusy: true, order: {...} } hoặc { isBusy: false }
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message || DEFAULT_MESSAGE.DEFAULT_ERROR });
  }
}
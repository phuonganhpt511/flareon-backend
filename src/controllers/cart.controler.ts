import { Request, Response } from 'express'
import { DEFAULT_MESSAGE } from '~/constants/message'
import {
  addToCartService,
  createCartService,
  removeCartItemService,
  getOneCartService,
  updateQuantityCartItemSV
} from '~/services/cart.service'

export const createCartController = async (req: Request, res: Response) => {
  try {
    const { user_id, table_id } = req.body

    if (!user_id || !table_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing user_id or table_id'
      })
    }

    // Gọi service
    const cart = await createCartService(user_id, table_id)

    return res.status(200).json({
      success: true,
      message: 'Cart created or updated successfully',
      data: cart
    })
  } catch (error: any) {
    console.error(' Error in createCartController:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    })
  }
}

export const addToCartControler = async (req: Request, res: Response) => {
  try {
    const { user_id, table_id, dish_id, quantity } = req.body

    // Kiểm tra dữ liệu đầu vào
    if (!table_id || !dish_id || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Missing table_id, dish_id or quantity'
      })
    }

    // Gọi service xử lý logic
    const result = await addToCartService(user_id, table_id, dish_id, quantity)

    return res.status(200).json({
      success: true,
      message: DEFAULT_MESSAGE.DEFAULT_SUCCESS,
      data: result.data
    })
  } catch (error: any) {
    console.error('Error in addToCartController:', error)
    return res.status(500).json({
      success: false,
      message: error.message || DEFAULT_MESSAGE.DEFAULT_ERROR
    })
  }
}

export const getOneCartController = async (req: Request, res: Response) => {
  try {
    const { table_id, user_id } = req.params

    const cartData = await getOneCartService(table_id, user_id)

    if (!cartData) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found for this table'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Cart fetched successfully',
      data: cartData
    })
  } catch (error: any) {
    // console.error('Error fetching cart:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    })
  }
}

export const removeCartItemController = async (req: Request, res: Response) => {
  try {
    const { cart_item_id } = req.params

    const result = await removeCartItemService(cart_item_id)
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      })
    }

    res.status(200).json({
      success: true,
      message: result.message,
      total_price: result.total_price
    })
  } catch (error: any) {
    console.error('Error removing cart item:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    })
  }
}

export const updateQuantiCartItemControler = async (req: Request, res: Response) => {
  try {
    const { cart_item_id } = req.params
    const { delta } = req.body
    // console.log(cart_item_id)

    if (delta === undefined) {
      return res.status(400).json({ message: 'delta is required' })
    }

    const result = await updateQuantityCartItemSV(cart_item_id, delta)

    return res.status(200).json(result)
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    })
  }
}

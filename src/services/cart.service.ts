import { ORDER_ITEM_STATUS, ORDER_STATUS, TABLE_STATUS } from '~/constants/enum'
import { Cart_Item, Cart } from '../models/cart.model'
import Order from '../models/order.model'
import OrderItem from '../models/order-item.model'
import Dish from '../models/dish.model'
import Table from '../models/table.model'
import { IDishes } from '~/interfaces/dish.type'
import mongoose from 'mongoose'

export const getOneCartService = async (table_id: string, user_id: string) => {
  // Tìm cart theo table_id
  const cart = await Cart.findOne({ table_id, user_id })
  if (!cart) {
    return null
  }

  const items = await Cart_Item.find({ cart_id: cart._id }).populate<{ dish_id: IDishes }>(
    'dish_id',
    'dish_name imageUrl price'
  )

  // Format dữ liệu để trả ra frontend
  const formattedItems = items.map((item) => ({
    cart_item_id: item._id,
    dish_name: item.dish_id?.dish_name,
    image: item.dish_id?.imageUrl || null,
    quantity: item.quantity,
    price: item.price,
    subtotal: item.price * item.quantity,
    note: item.note || ''
  }))

  // Tính tổng tiền giỏ hàng
  const total_price = formattedItems.reduce((sum, item) => sum + item.subtotal, 0)

  // Trả kết quả cuối cùng
  return {
    table_id: cart.table_id,
    user_id: cart.user_id,
    total_price,
    items: formattedItems
  }
}

export const createCartService = async (user_id: string, table_id: string) => {
  try {
    let cart = await Cart.findOne({ user_id, table_id })
    if (!cart) {
      cart = await Cart.create({ user_id, table_id, total_price: 0 })
    }

    const cartItems = await Cart_Item.find({ cart_id: cart._id })
    const total_price = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    cart.total_price = total_price
    await cart.save()

    return cart
  } catch (error) {
    // console.log(error)
    throw new Error('Error creating cart')
  }
}

export const addToCartService = async (user_id: string, table_id: string, dish_id: string, quantity: number) => {
  try {
    let cart = await Cart.findOne({ user_id, table_id })
    if (!cart) {
      cart = await createCartService(user_id, table_id)
    }

    let cart_item = await Cart_Item.findOne({ cart_id: cart._id, dish_id })

    const dish = await Dish.findById(dish_id)
    if (!dish) throw new Error('Dish not found')

    // const price = dish.price
    if (cart_item) {
      cart_item.quantity += quantity
      // cart_item.price = cart_item.quantity * dish.price
      await cart_item.save()
    } else {
      cart_item = await Cart_Item.create({
        cart_id: cart._id,
        dish_id,
        quantity,
        price: dish.price
      })
    }

    //  Cập nhật lại total_price trong Cart
    const cartItems = await Cart_Item.find({ cart_id: cart._id })
    const total_price = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    cart.total_price = total_price
    await cart.save()

    return {
      success: true,
      message: 'Dish added to cart successfully',
      data: {
        cart,
        cart_items: cartItems
      }
    }
  } catch (error) {
    // console.log(error)
    throw new Error('Error add to cart')
  }
}

export const checkoutCartService = async (user_id: string, table_id: string) => {
  try {
    // Tìm giỏ hàng hiện tại
    const cart = await Cart.findOne({ user_id, table_id })
    if (!cart) throw new Error('Cart not found')

    // Lấy các món trong giỏ hàng
    const cartItems = await Cart_Item.find({ cart_id: cart._id })
    if (cartItems.length === 0) throw new Error('Cart is empty')

    // Tính tổng tiền
    const total_price = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Tạo đơn hàng chính
    const order = await Order.create({
      user_id,
      table_id,
      total_price,
      status: ORDER_STATUS.PENDING,
      created_at: new Date()
    })

    // Tạo danh sách order_items tương ứng
    const orderItemsData = cartItems.map((item) => ({
      order_id: order._id,
      dish_id: item.dish_id,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
      // status: ORDER_ITEM_STATUS.PENDING,
      note: item.note
    }))

    await OrderItem.insertMany(orderItemsData)

    await Table.findByIdAndUpdate(table_id, { status: TABLE_STATUS.OCCUPIED })

    // Xóa giỏ hàng sau khi đặt hàng
    await Cart_Item.deleteMany({ cart_id: cart._id })
    cart.total_price = 0
    await cart.save()

    // Populate dữ liệu để trả về đầy đủ
    const orderWithItems = await OrderItem.find({ order_id: order._id }).populate('dish_id', 'dish_name imageUrl price')

    // Format dữ liệu đẹp
    const formattedItems = orderWithItems.map((item) => ({
      dish_name: (item.dish_id as any)?.dish_name,
      image: (item.dish_id as any)?.imageUrl || null,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal,
      note: item.note
    }))

    return {
      success: true,
      message: 'Checkout successfully!',
      data: {
        order_id: order._id,
        table_id,
        total_price,
        status: order.status,
        items: formattedItems
      }
    }
  } catch (error: any) {
    // console.error('Checkout error:', error)
    return {
      success: false,
      message: error.message || 'Error while checking out cart'
    }
  }
}

export const removeCartItemService = async (id: string) => {
  // Tìm cart item để biết thuộc cart nào
  try {
    const cartItem = await Cart_Item.findById(id)
    if (!cartItem) return null

    // Xóa item đó
    await Cart_Item.findByIdAndDelete(id)

    // Sau khi xóa, cập nhật lại total_price trong bảng Cart
    const cartItems = await Cart_Item.find({ cart_id: cartItem.cart_id })
    const total_price = cartItems.reduce((sum, item) => sum + (item.price || 0), 0)

    await Cart.findByIdAndUpdate(cartItem.cart_id, { total_price })

    return { message: 'Item removed successfully', total_price }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error while remove cart'
    }
  }
}

export const updateQuantityCartItemSV = async (id: string, delta: number) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, message: 'Invalid cart item id' }
    }

    const updatedItem = await Cart_Item.findByIdAndUpdate(id, { $inc: { quantity: delta } }, { new: true })

    if (!updatedItem) {
      return { success: false, message: 'Cart item not found' }
    }

    if (updatedItem.quantity <= 0) {
      await updatedItem.deleteOne()
      return { success: true, message: 'Item removed from cart' }
    }

    return {
      success: true,
      message: 'Quantity updated successfully',
      data: updatedItem
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error update quantity cart_item'
    }
  }
}

import { ORDER_ITEM_STATUS } from '~/constants/enum'
import OrderItem from '../models/order-item.model'

export const getOrderItemService = async (order_id: string) => {
  try {
    const data = await OrderItem.find({ order_id }).populate('dish_id', 'dish_name imageUrl price')

    if (!data || data.length === 0) {
      return {
        success: false,
        message: 'No order items found for this order_id'
      }
    }

    return data
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error Get Order Item'
    }
  }
}

export const updateSttOrderItemService = async (id: string, status: ORDER_ITEM_STATUS) => {
  try {
    if (!id) throw new Error('Thiếu order item id')
    if (!status) throw new Error('Thiếu status')
    const orderItem = await OrderItem.findById(id)

    const statusFlow: ORDER_ITEM_STATUS[] = [
      ORDER_ITEM_STATUS.PENDING,
      ORDER_ITEM_STATUS.PROCESSING,
      ORDER_ITEM_STATUS.READY,
      ORDER_ITEM_STATUS.SERVED
    ]

    if (orderItem?.status === ORDER_ITEM_STATUS.CANCELED) {
      return {
        success: false,
        message: 'Canceled order items cannot be updated'
      }
    }

    if (status === ORDER_ITEM_STATUS.CANCELED) {
      orderItem!.status = ORDER_ITEM_STATUS.CANCELED
      await orderItem!.save()
      return {
        success: true,
        message: 'Order item đã được hủy',
        data: orderItem
      }
    }

    const currentIndex = statusFlow.indexOf(orderItem!.status)
    const newIndex = statusFlow.indexOf(status)

    if (newIndex < currentIndex) {
      return {
        success: false,
        message: `Không thể chuyển trạng thái từ ${orderItem!.status} đến ${status}`
      }
    }

    if (newIndex > currentIndex + 1) {
      return {
        success: false,
        message: `Invalid status transition from ${orderItem!.status} to ${status}`
      }
    }

    orderItem!.status = status
    await orderItem!.save()

    return {
      success: true,
      message: 'Order item status updated successfully',
      data: orderItem
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error Update Status Order Item'
    }
  }
}

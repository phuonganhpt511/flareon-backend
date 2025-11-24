import { IOrder } from '~/interfaces/order.type'
import Order from '../models/order.model'
// 1. IMPORT THÊM 2 THỨ NÀY
import { ORDER_STATUS, TABLE_STATUS } from '~/constants/enum' 
import { updateStatusTableService } from './table.service' // Gọi service của Bàn

export const buildOrderPipeline = (dbQuery: any, dbSort: any, skip: number, limit: number, search?: string) => {
  // ... (code hàm này giữ nguyên) ...
  const pipeline: any[] = []

  if (dbQuery && Object.keys(dbQuery).length > 0) {
    pipeline.push({ $match: dbQuery })
  }

  pipeline.push(
    {
      $lookup: {
        from: 'tables',
        localField: 'table_id',
        foreignField: '_id',
        as: 'table'
      }
    },
    { $unwind: { path: '$table', preserveNullAndEmptyArrays: true } }
  )

  pipeline.push(
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } }
  )

  if (search && search.trim() !== '') {
    const regex = new RegExp(search, 'i')
    pipeline.push({
      $match: {
        $or: [{ 'table.table_name': regex }, { 'user.username': regex }]
      }
    })
  }

  if (dbSort && Object.keys(dbSort).length > 0) {
    pipeline.push({ $sort: dbSort })
  } else {
    pipeline.push({ $sort: { createdAt: -1 } })
  }

  if (skip) pipeline.push({ $skip: skip })
  if (limit) pipeline.push({ $limit: limit })

  return pipeline
}

export const getAllOrderService = async (page: number = 1, limit: number = 10, status?: string, search?: string) => {
  // ... (code hàm này giữ nguyên) ...
  try {
    const skip = (page - 1) * limit
    const dbQuery: any = {}

    if (status) {
      dbQuery.status = { $regex: new RegExp(`^${status}$`, 'i') }
    }

    const dbSort = { createdAt: -1 }

    const pipeline = buildOrderPipeline(dbQuery, dbSort, skip, limit, search)
    const orders = await Order.aggregate(pipeline)

    return orders
  } catch (error) {
    throw new Error('Cannot get all order !!')
  }
}

export const getDetailOrderByTableIdService = async (tableId: string) => {
  // ... (code hàm này giữ nguyên) ...
  try {
    const order = await Order.findOne({ table_id: tableId }).populate('table_id').populate('user_id')

    if (!order) {
      return null
    }

    return order
  } catch (error) {
    console.error('Lỗi trong getOneOrderByTableIdService:', error)
    throw new Error('Cannot get order by table id !!')
  }
}

export const createOrderService = async (data: IOrder): Promise<IOrder> => {
  // ... (code hàm này giữ nguyên) ...
  try {
    const newOrder = await new Order(data).save()
    return newOrder
  } catch (error) {
    // console.log(error)
    throw new Error('Cannot create order !!')
  }
}

export const updateOrderService = async (id: string, data: IOrder) => {
  // ... (code hàm này giữ nguyên) ...
  try {
    const updateOrder = await Order.findByIdAndUpdate(id, data, { new: true })
    return updateOrder
  } catch (error) {
    throw new Error('cannot update Order')
  }
}

// === 2. HÀM NÀY ĐÃ ĐƯỢC SỬA ===
export const updateOrderStatusService = async (id: string, status: string) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true })

    // === 3. LOGIC MỚI: TỰ ĐỘNG RESET BÀN ===
    if (updatedOrder && (status === ORDER_STATUS.COMPLETED || status === ORDER_STATUS.CANCELLED)) {
      console.log(`Order ${id} finished, releasing table ${updatedOrder.table_id}...`)
      // Lấy table_id từ đơn hàng vừa cập nhật
      const tableId = updatedOrder.table_id.toString()
      // Gọi service của Bàn, chuyển nó về 'empty' (Còn trống)
      await updateStatusTableService(tableId, TABLE_STATUS.EMPTY) 
      console.log(`Table ${tableId} is now EMPTY.`)
    }
    // ====================================

    return updatedOrder
  } catch (error: any) {
    // console.error('Lỗi trong updateOrderStatusService:', error)
    throw new Error('cannot update Order status: ' + error.message)
  }
}

export const deleteOrderService = async (id: string) => {
  // ... (code hàm này giữ nguyên) ...
  try {
    const order = await Order.findByIdAndDelete(id, { new: true })
    return order
  } catch (error) {
    throw new Error('cannot delete Order')
  }
}

// === 4. HÀM MỚI ĐÃ ĐƯỢC THÊM VÀO ĐÂY ===
export const checkTableBusyService = async (tableId: string) => {
  try {
    // Tìm BẤT KỲ đơn hàng nào đang hoạt động (Pending hoặc Processing) cho bàn này
    const activeOrder = await Order.findOne({
      table_id: tableId,
      status: { $in: [ORDER_STATUS.PENDING, ORDER_STATUS.PROCESSING] } 
    }).populate('user_id', 'username'); 

    if (activeOrder) {
      // Bàn bận
      return {
        isBusy: true,
        order: activeOrder
     };
    }

    // Bàn rảnh
    return { isBusy: false };

  } catch (error) {
    throw new Error('Cannot check table status');
  }
}
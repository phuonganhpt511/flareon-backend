import express from 'express'
import {
  getOrderItemControler,
  getOrderItemsByUserOrTableController,
  updateSttOderItemControler
} from '~/controllers/order-item.controler'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Order Items
 *   description: Quản lý các món ăn trong đơn hàng (OrderItem)
 *
 * /order-item/order/{orderId}:
 *   get:
 *     summary: Lấy danh sách món trong một đơn hàng cụ thể
 *     description: |
 *       Trả về danh sách các món (`OrderItem`) thuộc về một **đơn hàng cụ thể**.
 *       Mỗi món bao gồm thông tin chi tiết như tên món, giá, số lượng và trạng thái.
 *     tags: [Order Items]
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: ID của đơn hàng
 *         schema:
 *           type: string
 *           example: "68fef987e37e3fde60fce2e4"
 *     responses:
 *       200:
 *         description: Danh sách món trong đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách món trong đơn hàng thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "671fc9c2d9993b183f37b6f8"
 *                       dish_id:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Cơm gà xối mỡ"
 *                           price:
 *                             type: number
 *                             example: 45000
 *                       quantity:
 *                         type: number
 *                         example: 2
 *                       status:
 *                         type: string
 *                         enum: [Pending, Processing, Ready, Served, Cancelled]
 *                         example: "Processing"
 *       404:
 *         description: Không tìm thấy đơn hàng hoặc không có món ăn nào
 *       500:
 *         description: Lỗi server
 *
 * /order-item/by-user-or-table:
 *   get:
 *     summary: Lấy danh sách món ăn theo user_id hoặc table_id
 *     description: |
 *       API linh hoạt cho phép lấy danh sách món ăn đã gọi:
 *       - Nếu **khách đăng nhập**, truyền `user_id`.
 *       - Nếu **khách tại bàn**, truyền `table_id`.
 *       - Chỉ cần truyền **1 trong 2 tham số** trong query string.
 *       Ví dụ:
 *       - `/order-item/by-user-or-table?user_id=671fc9c2d9993b183f37b6f3`
 *       - `/order-item/by-user-or-table?table_id=671fc9c2d9993b183f37b6f9`
 *     tags: [Order Items]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: ID người dùng (nếu là khách đăng nhập)
 *         example: "671fc9c2d9993b183f37b6f3"
 *       - in: query
 *         name: table_id
 *         schema:
 *           type: string
 *         description: ID bàn (nếu là khách không đăng nhập)
 *         example: "671fc9c2d9993b183f37b6f9"
 *     responses:
 *       200:
 *         description: Lấy danh sách món ăn đã đặt thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách món ăn theo user_id hoặc table_id thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       dish_id:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Phở bò tái"
 *                           price:
 *                             type: number
 *                             example: 40000
 *                       quantity:
 *                         type: number
 *                         example: 1
 *                       status:
 *                         type: string
 *                         example: "Served"
 *       400:
 *         description: Thiếu user_id hoặc table_id
 *       500:
 *         description: Lỗi server
 *
 * /order-item/{id}/status:
 *   patch:
 *     summary: Cập nhật trạng thái món ăn trong đơn hàng
 *     description: |
 *       Cập nhật **trạng thái của từng món ăn** (`OrderItem`) trong đơn hàng.
 *       Quy trình hợp lệ:
 *       `Pending → Processing → Ready → Served`
 *       Có thể **hủy (Cancelled)** ở bất kỳ giai đoạn nào, trừ khi món đã **Served** hoặc **đã Cancelled**.
 *     tags: [Order Items]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID của món ăn trong đơn hàng (order_item_id)
 *         schema:
 *           type: string
 *           example: "68fef987e37e3fde60fce2e6"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Processing, Ready, Served, Cancelled]
 *                 example: "Processing"
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Order item status updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "68fef987e37e3fde60fce2e6"
 *                     status:
 *                       type: string
 *                       example: "Ready"
 *       400:
 *         description: Trạng thái không hợp lệ
 *       404:
 *         description: Không tìm thấy order item
 *       500:
 *         description: Lỗi server khi cập nhật trạng thái
 */

router.get('/order/:orderId', getOrderItemControler)
router.get('/by-user-or-table', getOrderItemsByUserOrTableController)
router.patch('/:id/status', updateSttOderItemControler)

export default router

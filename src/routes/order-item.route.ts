import express from 'express'
import { getOrderItemControler, updateSttOderItemControler } from '~/controllers/order-item.controler'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Order Items
 *   description: Quản lý các món ăn trong đơn hàng (OrderItem)
 *
 * /order-item/{orderId}:
 *   get:
 *     summary: Lấy danh sách món trong một đơn hàng
 *     description: |
 *       Trả về toàn bộ danh sách các món (`OrderItem`) thuộc về một đơn hàng cụ thể.
 *       Mỗi món bao gồm thông tin chi tiết như tên món, giá, số lượng, trạng thái hiện tại,...
 *     tags:
 *       - Order Items
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: ID của đơn hàng cần lấy món
 *         schema:
 *           type: string
 *           example: "68fef987e37e3fde60fce2e4"
 *     responses:
 *       200:
 *         description: Danh sách các món trong đơn hàng
 *       404:
 *         description: Không tìm thấy đơn hàng hoặc không có món ăn nào
 *       500:
 *         description: Lỗi server
 *
 * /order-item/{id}/status:
 *   patch:
 *     summary: Cập nhật trạng thái món trong đơn hàng
 *     description: |
 *       Cập nhật trạng thái từng món (`OrderItem`) trong đơn hàng.
 *       Trạng thái hợp lệ theo luồng:
 *       `Pending → Processing → Ready → Served`
 *       Có thể **hủy (Cancelled)** ở bất kỳ giai đoạn nào,
 *       trừ khi món đã **Served** hoặc **đã bị Cancelled**.
 *     tags:
 *       - Order Items
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
 *       400:
 *         description: Trạng thái cập nhật không hợp lệ
 *       404:
 *         description: Không tìm thấy order item
 *       500:
 *         description: Lỗi server khi cập nhật trạng thái
 */

router.get('/:orderId', getOrderItemControler)
router.patch('/:id/status', updateSttOderItemControler)

export default router

import express from 'express'
import {
  createOrderControler,
  deleteOrderControler,
  getAllOrderControler,
  getDetailOrderByTableIdController,
  updateOrderControler,
  updateOrderStatusController,
  checkTableBusyController // <-- 1. IMPORT HÀM MỚI
} from '~/controllers/order.controler'

const router = express.Router()

/**
A_E
 *   - name: Orders
 *     description: Quản lý đơn hàng
 *
 * /orders:
 *   get:
 *     summary: Lấy danh sách tất cả đơn hàng
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
g_E
 *         description: Giới hạn số đơn hàng mỗi trang
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           example: READY
 *         description: Lọc theo trạng thái đơn hàng
section_E
 *         name: search
 *         schema:
 *           type: string
 *           example: Bàn 4 || ducanh1925
 *         description: tìm kiếm đơn hàng
 *     responses:
 *       200:
 *         description: Lấy danh sách đơn hàng thành công
 *       400:
 *         description: Lỗi truy vấn
 *
 *   post:
 *     summary: Tạo đơn hàng mới
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *   g_E
 *           schema:
 *             type: object
 *             properties:
 *               table_id:
 *                 type: string
 *                 example: "6521e5c4b3c7e4a2b9f7a101"
section_E
 *                 type: string
 *                 example: "6521e5c4b3c7e4a2b9f7a201"
 *               status:
 *                 type: string
 *                 example: "PENDING"
d_E
 *       201:
 *         description: Tạo đơn hàng thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *
 * /orders/{tableId}:
 *   get:
 *     summary: Lấy chi tiết đơn hàng theo ID bàn
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: tableId
 * g_E
 *         schema:
 *           type: string
 *         description: ID của bàn
 *     responses:
 *       200:
 *         description: Lấy chi tiết đơn hàng thành công
 *       404:
 *         description: Không tìm thấy đơn hàng
 *
 * /orders/{id}:
 *   patch:
 *     summary: Cập nhật thông tin đơn hàng
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
CH_E
 *               table_id:
 *                 type: string
 *                 example: "6521e5c4b3c7e4a2b9f7a101"
 *               user_id:
 *                 type: string
 *   t_E
 *               status:
 *             _E
 *                 example: "READY"
 *     responses:
 *       200:
 *         description: Cập nhật đơn hàng thành công
*       400:
section_E
 *       404:
 *         description: Không tìm thấy đơn hàng
 *
 *   delete:
 *     summary: Xóa đơn hàng theo ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *     g_E
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn hàng cần xóa
 *     responses:
 *       200:
 *         description: Xóa đơn hàng thành công
*       404:
 *         description: Không tìm thấy đơn hàng
 *
 * /orders/{id}/status:
 *   patch:
 *     summary: Cập nhật trạng thái của đơn hàng
*     tags: [Orders]
Services
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
Services
 *               status:
 *                 type: string
 *                 example: "COMPLETED"
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
*       400:
A_E
 *       404:
 *         description: Không tìm thấy đơn hàng
 */

router.get('/', getAllOrderControler)

// === 2. THÊM ROUTE MỚI NÀY VÀO ĐÂY ===
// Route này phải nằm TRƯỚC route '/:tableId' để không bị ghi đè
router.get('/check-table/:tableId', checkTableBusyController)
// ===================================

router.get('/:tableId', getDetailOrderByTableIdController)
router.post('/', createOrderControler)
router.patch('/:id', updateOrderControler)
router.delete('/:id', deleteOrderControler)
router.patch('/:id/status', updateOrderStatusController)

export default router
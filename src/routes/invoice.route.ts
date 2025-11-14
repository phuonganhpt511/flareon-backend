import express from 'express'
import {
  createInvoiceController,
  getAllInvoiceController,
  getDetailInvoiceControler,
  handleVnpayReturnController // ‼️ 1. THÊM IMPORT CONTROLLER MỚI
} from '~/controllers/invoices.controler'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: API quản lý hóa đơn
 */

/**
 * @swagger
 * /invoices:
 *   get:
 *     summary: Lấy danh sách tất cả hóa đơn
 *     tags: [Invoices]
 *     responses:
 *       200:
 *         description: Lấy danh sách hóa đơn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       order_id:
 *                         type: string
 *                       user_id:
 *                         type: string
 *                       table_id:
 *                         type: string
 *                       total_amount:
 *                         type: number
 *                       status:
 *                         type: string
 *       500:
 *         description: Lỗi server hoặc lỗi cơ sở dữ liệu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *               _message:
 *                   type: string
 */

/**
 * @swagger
 * /invoices/{id}:
 *   get:
 *     summary: Lấy chi tiết một hóa đơn
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của hóa đơn cần xem chi tiết
 *     responses:
 *       200:
 *         description: Trả về chi tiết hóa đơn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *               _type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     order_id:
 *                       type: string
 *                     total_amount:
 *                       type: number
 *                     status:
 *                       type: string
 *       404:
 *         description: Không tìm thấy hóa đơn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
s*       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /invoices:
 *   post:
 *     summary: Tạo hóa đơn mới từ đơn hàng
 *     tags: [Invoices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_id:
 *                 type: string
 *                 description: ID của đơn hàng
 *     responses:
 *       201:
 *         description: Tạo hóa đơn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
S*                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     order_id:
 *                       type: string
 *                     total_amount:
 *                     s type: number
 *                     status:
 *                       type: string
s*       400:
 *         description: Lỗi dữ liệu đầu vào (ví dụ order không tồn tại)
 *         content:
 *           application/json:
 *       *       schema:
 *               type: object
s*               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
s*       500:
 *         description: Lỗi server
 */

router.get('/', getAllInvoiceController)
router.get('/:id', getDetailInvoiceControler)
router.post('/', createInvoiceController)

// ‼️ ========================================== ‼️
// ‼️ 2. THÊM ROUTE MỚI VÀ SWAGGER MỚI VÀO CUỐI FILE ‼️
// ‼️ ========================================== ‼️
/**
 * @swagger
 * /invoices/vnpay-return:
 *   get:
 *     summary: Xử lý callback từ VNPay sau khi thanh toán
 *     tags: [Invoices]
 *     parameters:
 *       - in: query
 *         name: vnp_ResponseCode
 *         schema:
 *           type: string
 *           example: '00'
 *         description: Mã phản hồi từ VNPay ('00' là thành công)
 *       - in: query
 *         name: vnp_TxnRef
 *         schema:
 *   S         type: string
 *           example: '691fcc72c351936d54'
 *         description: Mã đơn hàng (chính là order_id)
 *     responses:
 *       200:
 *         description: Xử lý thành công (Cập nhật Hóa đơn VÀ Bàn)
s*       400:
 *         description: Thanh toán thất bại hoặc thiếu mã đơn hàng
 *       500:
 *         description: Lỗi server
 */
router.get('/vnpay-return', handleVnpayReturnController)

export default router
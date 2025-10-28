import express from 'express'
import {
  createGuest,
  getGuestsByTable,
  closeGuestSession
} from '../controllers/guest.controller'

const router = express.Router()

/**
 * @swagger
 * /guests:
 *   post:
 *     summary: Tạo khách vãng lai (không cần đăng nhập)
 *     tags: [Guest]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               phone: { type: string }
 *               note: { type: string }
 *               tableId: { type: string }
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', createGuest)

/**
 * @swagger
 * /guests/table/{tableId}:
 *   get:
 *     summary: Lấy khách đang ngồi tại bàn
 *     tags: [Guest]
 */
router.get('/table/:tableId', getGuestsByTable)

/**
 * @swagger
 * /guests/{id}/close:
 *   patch:
 *     summary: Đánh dấu khách đã rời bàn
 *     tags: [Guest]
 */
router.patch('/:id/close', closeGuestSession)

export default router

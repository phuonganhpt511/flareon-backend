import express from 'express'
import {
  addToCartControler,
  createCartController,
  getOneCartController,
  removeCartItemController,
  updateQuantiCartItemControler
} from '~/controllers/cart.controler'
import { checkoutCartController } from '~/controllers/order.controler'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Quản lý giỏ hàng theo bàn và người dùng
 *
 * /cart/add-item:
 *   post:
 *     summary: Thêm sản phẩm vào giỏ hàng
 *     description: FE gọi khi khách chọn món. Nếu món đã có thì tăng số lượng, chưa có thì thêm mới.
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               table_id:
 *                 type: string
 *                 example: "A01"
 *               dish_id:
 *                 type: string
 *                 example: "670ac3..."
 *               quantity:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Thêm sản phẩm thành công và trả về giỏ hàng mới nhất
 *
 * /cart/cart-item/{table_id}/{user_id}:
 *   get:
 *     summary: Lấy giỏ hàng theo mã bàn và người dùng
 *     description: FE gọi API này để hiển thị danh sách món trong giỏ của bàn.
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: table_id
 *         required: true
 *         schema:
 *           type: string
 *           example: "A01"
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *           example: "671ac9..."
 *     responses:
 *       200:
 *         description: Trả về chi tiết giỏ hàng (gồm danh sách sản phẩm, số lượng, giá)
 *
 * /cart/item/{cart_item_id}:
 *   delete:
 *     summary: Xóa sản phẩm khỏi giỏ hàng
 *     description: FE gọi khi khách muốn bỏ 1 món ra khỏi giỏ.
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cart_item_id
 *         required: true
 *         schema:
 *           type: string
 *           example: "671ac9..."
 *     responses:
 *       200:
 *         description: Xóa món khỏi giỏ thành công
 *
 * /cart/checkout:
 *   post:
 *     summary: Tạo đơn hàng khi click đặt hàng
 *     description: FE gọi khi khách bấm “Thanh toán”, server sẽ tạo hóa đơn và tính tổng tiền.
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 example: "A01"
 *               table_id:
 *                 type: string
 *                 example: "cash"
 *     responses:
 *       200:
 *         description: Thanh toán thành công, trả về thông tin hóa đơn
 * /cart/{cart_item_id}/quantity:
 *   patch:
 *     summary: Tăng giảm số lượng
 *     description: FE gọi khi tăng giảm số lượng món ăn
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cart_item_id
 *         required: true
 *         schema:
 *           type: string
 *           example: "671ac9..."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               delta:
 *                 type: number
 *                 example: 1
 *
 *     responses:
 *       200:
 *         description: Thanh toán thành công, trả về thông tin hóa đơn
 */

router.post('/', createCartController)
router.get('/cart-item/:table_id/:user_id', getOneCartController)
router.post('/add-item', addToCartControler)
router.post('/checkout', checkoutCartController)
router.patch('/:cart_item_id/quantity', updateQuantiCartItemControler)
router.delete('/item/:cart_item_id', removeCartItemController)
export default router

import express from 'express'
import { USER_ROLE } from '~/constants/enum'
import {
  createFeedBackControler,
  createFeedbackResponseController,
  deleteFeedbackController,
  getAllFeedBackControler,
  getDetailFeedbackControler,
  getFeedBackByDishIdControler,
  getResponseDetailController,
  getResponsesByFeedbackController,
  updateFeedbackStatusController
} from '~/controllers/feedback.controler'
import { authMiddleware, roleMiddleware } from '~/middlewares/auth'

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Feedback:
 *       type: object
 *       description: Phản hồi của người dùng về món ăn
 *       properties:
 *         _id:
 *           type: string
 *           description: ID của feedback
 *         user_id:
 *           type: string
 *           description: ID người dùng gửi feedback
 *         order_id:
 *           type: string
 *           description: ID của đơn hàng chứa món ăn được đánh giá
 *         dish_id:
 *           type: string
 *           description: ID món ăn được đánh giá
 *         type:
 *           type: string
 *           description: Loại phản hồi (positive, negative, neutral,...)
s*         rating:
 *           type: number
 *           description: Số sao đánh giá (1–5)
 *         content:
 *           type: string
 *           description: Nội dung phản hồi
 *         image:
 *           type: string
 *           description: Đường dẫn hình ảnh minh họa nếu có
s*         status:
 *           type: string
 *           description: Trạng thái phản hồi (pending, approved, rejected)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo phản hồi
 *
 *     FeedbackResponse:
 *       type: object
 *       description: Phản hồi từ admin cho feedback của người dùng
 *       properties:
 *         _id:
 *           type: string
 *           description: ID của phản hồi
 *         feedback_id:
 *           type: string
 *           description: ID của feedback được phản hồi
 *         user_id:
 *           type: string
 *           description: ID của admin phản hồi
A*         content:
 *           type: string
 *           description: Nội dung phản hồi của admin
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo phản hồi
s*
 * tags:
 *   - name: Feedback
 *     description: Quản lý phản hồi và phản hồi của admin
 *
 * /feedback:
 *   get:
 *     summary: Lấy danh sách tất cả feedback
 *     tags: [Feedback]
 *     responses:
 *       200:
 *         description: Danh sách feedback
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feedback'

 *
 *   post:
 *     summary: Tạo feedback mới
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Feedback'
 *     responses:
 *       201:
 *         description: Feedback được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *
 * /feedback/{id}:
 *   get:
 *     summary: Lấy chi tiết một feedback theo ID(trang admin)
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
s*         required: true
 *         description: ID của feedback cần xem
 *     responses:
 *       200:
 *         description: Chi tiết feedback
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *   delete:
 *     summary: Xóa feedback (chỉ dành cho admin)
 *     description: |
 *       Chỉ **Admin** có thể xóa feedback.
 *       Feedback ở trạng thái **Pending** (chưa xử lý) sẽ không thể bị xóa.
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của feedback cần xóa
 *     responses:
 *       200:
 *         description: Feedback đã được xóa thành công
s*       400:
 *         description: Feedback chưa được xử lý hoặc không tồn tại
 *       403:
 *         description: Không đủ quyền hạn (chỉ admin được phép)
 *       500:
 *         description: Lỗi server
 *
 * /feedback/{id}/status:
 *   patch:
 *     summary: Cập nhật trạng thái của feedback hoặc khi admin phản hồi sẽ tự động cập nhật status
 *     description: |
 *       Admin có thể cập nhật trạng thái của feedback giữa ba trạng thái:
 *       - **Pending** – Đang chờ xử lý
 *       - **Resolved** – Đã xử lý xong
 *       - **Rejected** – Đã từ chối
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *   S parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của feedback cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Resolved, Rejected]
 *             example:
 *               status: "Resolved"
s*     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
G*               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
CSS*                 description: Thông tin feedback sau khi cập nhật
 *       400:
 *         description: Feedback không tồn tại hoặc dữ liệu không hợp lệ
 *       403:
 *         description: Không đủ quyền hạn
 *       500:
 *         description: Lỗi server
 *
 *
 * /feedback/dish/{dish_id}:
 *   get:
 *     summary: Lấy tất cả feedback theo ID món ăn
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: dish_id
 *         schema:
 *           type: string
s*         required: true
 *         description: ID món ăn cần xem phản hồi
 *     responses:
 *       200:
 *         description: Danh sách feedback của món ăn
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feedback'

 *
 * /feedback/{feedback_id}/responses:
 *   get:
 *     summary: Lấy danh sách phản hồi từ admin của một feedback hiển thị ra client
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: feedback_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của feedback cần lấy phản hồi
s*     responses:
 *       200:
 *         description: Danh sách phản hồi của feedback
 *         content:
 *           application/json:
 *             schema:
 *     S           type: array
 *               items:
 *                 $ref: '#/components/schemas/FeedbackResponse'
 *
 * /feedback/{feedback_id}/response:
 *   post:
 *     summary: Tạo phản hồi cho một feedback (chỉ admin)
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: feedback_id
 *   F       schema:
 *           type: string
 *         required: true
 *         description: ID của feedback được phản hồi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
Service*           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Nội dung phản hồi của admin
 *     responses:
 *       201:
 *         description: Phản hồi được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *           s     $ref: '#/components/schemas/FeedbackResponse'
s*       403:
 *         description: Không đủ quyền hạn (chỉ admin được phép)
 *
 * /feedback/response/{id}:
 *   get:
 *     summary: Xem chi tiết phản hồi theo ID
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
s*         required: true
 *         description: ID của phản hồi cần xem chi tiết
 *     responses:
 *       200:
 *         description: Chi tiết phản hồi
 *         content:
 *           application/json:
 *             schema:
s*               $ref: '#/components/schemas/FeedbackResponse'
 */

router.get('/', getAllFeedBackControler)
router.get('/:id', getDetailFeedbackControler)
router.get('/:feedback_id/responses', getResponsesByFeedbackController)
router.patch('/:id', authMiddleware, roleMiddleware([USER_ROLE.ADMIN]), updateFeedbackStatusController)
router.post(
  '/:feedback_id/response',
  authMiddleware,
  roleMiddleware([USER_ROLE.ADMIN]),
  createFeedbackResponseController
)
router.delete('/:id', authMiddleware, roleMiddleware([USER_ROLE.ADMIN]), deleteFeedbackController)
router.get('/response/:id', getResponseDetailController)
router.get('/dish/:dish_id', getFeedBackByDishIdControler)
router.post('/', createFeedBackControler)

export default router
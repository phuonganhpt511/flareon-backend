import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db'

import userRouter from './routes/user.route'
import authRouter from './routes/auth.route'
import cateRouter from './routes/cate.route'
import dishesRouter from './routes/dish.route'
import tableRouter from './routes/table.route'
import orderRouter from './routes/order.route'
import orderItemRouter from './routes/order-item.route'
import invoices from './routes/invoice.route'
import cartRouter from './routes/cart.route'
import feedbackRouter from './routes/feedback.route'

import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import cors from 'cors'

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Flareon Website API ',
      version: '1.0.0'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.route.ts']
}

const openapiSpecification = swaggerJSDoc(options)

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000
const HOST = process.env.HOST || 'localhost'
connectDB()

app.use(
  cors({
    origin: '*',
    methods: 'GET,POST,PATCH,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
  })
)
app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))

// ...Router
app.use('/auth', authRouter)
app.use('/users', userRouter)

app.use('/dishes', dishesRouter)
app.use('/category', cateRouter)
app.use('/tables', tableRouter)
app.use('/orders', orderRouter)
app.use('/order-item', orderItemRouter)
app.use('/invoices', invoices)
app.use('/cart', cartRouter)
app.use('/feedback', feedbackRouter)

app.listen(PORT, () => console.log(`Server running at http://${HOST}:${PORT}`))

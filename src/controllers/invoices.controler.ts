import { Request, Response } from 'express'
import { createInvoiceService, getAllInvoiceService, getDetailInvoicesService } from '~/services/invoices.service'

export const getAllInvoiceController = async (req: Request, res: Response) => {
  try {
    const result = await getAllInvoiceService()

    if (!result.success) {
      return res.status(500).json(result)
    }

    // Nếu có dữ liệu
    return res.status(200).json(result)
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server Error Get All Invoices'
    })
  }
}

export const getDetailInvoiceControler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const result = await getDetailInvoicesService(id)

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message
      })
    }

    return res.status(200).json(result)
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating invoice'
    })
  }
}

export const createInvoiceController = async (req: Request, res: Response) => {
  try {
    const { order_id } = req.body

    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      })
    }

    const result = await createInvoiceService({
      order_id
    })

    if (!result.success) {
      return res.status(500).json(result)
    }

    return res.status(201).json(result)
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating invoice'
    })
  }
}

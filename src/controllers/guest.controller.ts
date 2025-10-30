import { Request, Response } from 'express'
import Guest from '../models/guest.model'


export const createGuest = async (req: Request, res: Response) => {
  try {
    const { name, phone, note, tableId } = req.body

    if (!name || !tableId) {
      return res
        .status(400)
        .json({ message: 'Vui lòng nhập tên và cung cấp tableId' })
    }


    const existing = await Guest.findOne({
      name,
      tableId,
      status: 'active'
    })
    if (existing) {
      return res.status(200).json({
        message: 'Khách này đã tồn tại tại bàn hiện tại',
        data: existing
      })
    }

    const newGuest = new Guest({ name, phone, note, tableId })
    await newGuest.save()

    res.status(201).json({
      message: 'Tạo khách vãng lai thành công',
      data: newGuest
    })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error })
  }
}


export const getGuestsByTable = async (req: Request, res: Response) => {
  try {
    const { tableId } = req.params
    const guests = await Guest.find({ tableId, status: 'active' })
    res.json(guests)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error })
  }
}


export const closeGuestSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updated = await Guest.findByIdAndUpdate(
      id,
      { status: 'done' },
      { new: true }
    )
    res.json({ message: 'Khách đã rời bàn', data: updated })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error })
  }
}

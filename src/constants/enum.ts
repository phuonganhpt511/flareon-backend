export enum USER_ROLE {
  CUSTOMER = 0,
  WAITER = 1,
  CASHIER = 2,
  CHEF = 3,
  ADMIN = 4
}

export enum CATEGORY_STATUS {
  INACTIVE = 0, //Dừng HĐ
  ACTIVE = 1 //Hoạt động
}

export enum DISHES_STATUS {
  AVAILABLE = 'available', // Còn bán
  UNAVAILABLE = 'unavailable' // Ngừng bán
}

export enum TABLE_STATUS {
  EMPTY = 'empty', // Bàn trống
  OCCUPIED = 'occupied', // Bàn có người
  RESERVED = 'reserved', // Bàn đã đặt trước
  MAINTENANCE = 'maintenance' // Bàn đang bảo trì
}

export enum ORDER_STATUS {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  READY = 'Ready',
  SERVED = 'Served',
  CANCELED = 'Cancelled',
  COMPLETED = 'Completed'
}

export enum ORDER_ITEM_STATUS {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  READY = 'Ready',
  SERVED = 'Served',
  CANCELED = 'Cancelled'
}

export enum TYPE_FEEDBACK {
  DISHES = 'Dish',
  SERVICE = 'Service',
  APP = 'App'
}

export enum STATUS_FEEDBACK {
  PENDING = 'Pending', //đang chờ giải quyết
  RESOLVED = 'Resolved', //đã giải quyết
  REJECTED = 'Rejected'
}

export enum STATUS_INVOICES {
  UNPAID = 'unpaid',
  PAID = 'paid',
  CANCELED = 'canceled',
  MERGED = 'merged'
}

export enum STATUS_PAYMENTS {
  SUCCESS = 'Success',
  FAILED = 'Failed',
  REFUNDED = 'Refunded'
}

export enum PAYMENT_METHOD {
  CASH = 'Cash',
  BANK = 'Bank_Transfer'
}

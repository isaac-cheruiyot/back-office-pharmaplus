// lib/OrderManager.ts
import { Order, Header, Detail, Payment, InTransitOrder, ProductDetailsMap } from '@/types/Order';


export class OrderManager {
  private orderMap: Record<number, Order>;

  constructor() {
    this.orderMap = {};
  }

  addOrder(orderId: number, header: Header, details: Detail[], payment: Payment): void {
    this.orderMap[orderId] = new Order(header, details, payment);
  }

  getAllHeaders(): Header[] {
    return Object.values(this.orderMap).map(order => order.header);
  }

  getAllPayments(): Order[] {
    return Object.values(this.orderMap).map(order => order);
  }

  getHeaderByOrderId(orderId: number): Header | undefined {
    return this.orderMap[orderId]?.header;
  }

  getDetailsByOrderId(orderId: number): Detail[] | undefined {
    return this.orderMap[orderId]?.details;
  }

  getPaymentByOrderId(orderId: number): Payment | undefined {
    return this.orderMap[orderId]?.payment;
  }

  cancelOrder(orderId: number): string {
    const order = this.orderMap[orderId];
    if (!order) return 'Order not found.';

    const status = order.header.status_description;
    if (status === 'Delivered' || status === 'Received') {
      return 'This order cannot be cancelled as it has already been delivered or received.';
    }

    order.header.status_description = 'Cancelled by Customer';
    return 'Order has been successfully cancelled.';
  }

  // ✅ Filter orders by payment amount (min and/or max)
  filterByPaymentAmount(min?: number, max?: number): Order[] {
    return Object.values(this.orderMap).filter(order => {
      const amount = order.payment.total_order_amount;
      if (min != null && amount < min) return false;
      if (max != null && amount > max) return false;
      return true;
    });
  }

  // ✅ Filter orders by payment type
  filterByPaymentType(type: string): Order[] {
    return Object.values(this.orderMap).filter(order =>
      order.payment.payment_type.toLowerCase() === type.toLowerCase()
    );
  }

  // ✅ Filter orders by payment date range
  filterByDateRange(startDate: Date, endDate: Date): Order[] {
    return Object.values(this.orderMap).filter(order => {
      const paymentDate = new Date(order.header.modified_at);
      return paymentDate >= startDate && paymentDate <= endDate;
    });
  }

  // ✅ Filter orders by payment status
  filterByPaymentStatus(status: string): Order[] {
    return Object.values(this.orderMap).filter(order =>
      order.payment.payment_status.toLowerCase() === status.toLowerCase()
    );
  }
}



// start of intransit order Manager

export type InTransitOrderStatus =
  | 'INTRANSIT'
  | 'IN WAREHOUSE'
  | 'ON THE WAY FOR DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED BY CUSTOMER'

export class InTransitOrderManager {
  private orderMap: Record<number, InTransitOrder>

  constructor() {
    this.orderMap = {}
  }

  addOrder(order: InTransitOrder): void {
    this.orderMap[order.id] = order
  }

  getAllOrders(): InTransitOrder[] {
    return Object.values(this.orderMap)
  }

  getOrderById(orderId: number): InTransitOrder | undefined {
    return this.orderMap[orderId]
  }

  getParsedProductDetails(orderId: number): ProductDetailsMap | null {
    const order = this.orderMap[orderId]
    if (!order) return null

    try {
      return JSON.parse(order.product_details)
    } catch (e) {
      console.error('Failed to parse product details:', e)
      return null
    }
  }

  getOrdersByStatus(status: InTransitOrderStatus): InTransitOrder[] {
    return this.getAllOrders().filter(order => order.order_status === status)
  }

  getOrdersOlderThan(days: number): InTransitOrder[] {
    return this.getAllOrders().filter(order => order.days_since_order > days)
  }

  removeOrder(orderId: number): void {
    delete this.orderMap[orderId]
  }

  isOrderCancellable(orderId: number): boolean {
    const order = this.orderMap[orderId]
    if (!order) return false

    return !['DELIVERED', 'CANCELLED BY CUSTOMER'].includes(order.order_status.toUpperCase())
  }

  cancelOrder(orderId: number): string {
    const order = this.orderMap[orderId]

    if (!order) return 'Order not found.'

    if (!this.isOrderCancellable(orderId)) {
      return 'Order cannot be cancelled because it is either delivered or already cancelled.'
    }

    order.order_status = 'CANCELLED BY CUSTOMER'
    return 'Order has been successfully cancelled.'
  }
}


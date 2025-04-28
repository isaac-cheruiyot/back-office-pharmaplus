// models/Order.ts
export interface Header {
    id: number;
    rfn: string;
    src: number;
    user_id: number;
    grand_total: number;
    created: string;
    received: string;
    store_id: string;
    store_processing_order: string;
    modified_at: string;
    status_id: number;
    status_description: string;
  }
  
  export interface Detail {
    id: number;
    rfn: number;
    product_id: string;
    item_name: string
    qty: number;
    unit_price: number;
    sub_total: number;
  }
  
  export interface Payment {
    id: number;
    rfn: number;
    payment_status: string;
    payment_type: string;
    payment_transaction_id: string;
    delivery_charges: number;
    packaging_cost: number;
    promotional_discount: number;
    custom_discount: number;
    total_order_amount: number;
  }
  
  export class Order {
    header: Header;
    details: Detail[];
    payment: Payment;
  
    constructor(header: Header, details: Detail[], payment: Payment) {
      this.header = header;
      this.details = details;
      this.payment = payment;
    }
  }


  // intransitOrder
  

  export interface ProductDetail {
    name: string
    quantity: number
    price: number
  }
  
  export interface ProductDetailsMap {
    [productCode: string]: ProductDetail
  }
  
  export interface InTransitOrder {
    id: number
    user_id: number
    cart_id: number
    customer_phone: string
    customer_address: string
    payment_mode: string
    amount_paid: number
    balance: number
    product_details: string // Store raw string initially; parse later
    order_status: string
    created_on: string
    days_since_order: number
  }
  
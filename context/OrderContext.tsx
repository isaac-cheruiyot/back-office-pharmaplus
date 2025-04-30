'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Order, InTransitOrder, Header, Detail, Payment } from '@/types/Order'
import { OrderManager, InTransitOrderManager } from '@/lib/OrderManager'

// ---------- Shared Types ----------
interface OrderContextType {
  orderManager: OrderManager
  inTransitOrders: InTransitOrder[]
  fetchOrders: () => Promise<void>
  fetchInTransitOrders: () => Promise<void>
  cancelOrder: (orderId: number) => string
  cancelInTransitOrder: (orderId: number) => string
  loading: boolean
  error: string | null
}

// ---------- Main Order Context ----------
const OrderContext = createContext<OrderContextType | undefined>(undefined)

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orderManager] = useState(new OrderManager())
  const [inTransitOrders, setInTransitOrders] = useState<InTransitOrder[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)

    try {
      const basicUser = process.env.NEXT_PUBLIC_BASIC_AUTH_USER!
      const basicPass = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS!
      const authHeader = `Basic ${btoa(`${basicUser}:${basicPass}`)}`


      const res = await fetch(
        `https://web.pharmaplus.co.ke/datapool/read_ecommerce_orders/fetch?&page=0&size=50`,
        {
          headers: {
            Authorization: authHeader,
          },
        }
      )

      const data = await res.json()

      if (!res.ok) throw new Error('Failed to fetch orders.')

      if (Array.isArray(data.content)) {
        data.content.forEach((order: any) => {
          const orderId = order.header.id
          const header: Header = order.header
          const details: Detail[] = order.details
          const payment: Payment = order.payment
          
          orderManager.addOrder(orderId, header, details, payment)
        })

        // Log the current state of orders after adding
        const currentOrders = orderManager.getAllHeaders()
      } else {
        console.error('Invalid data format:', data)
        setError('No orders found or incorrect data format')
      }
    } catch (err: any) {
      console.error('Error fetching orders:', err)
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const fetchInTransitOrders = async () => {
    setLoading(true)
    setError(null)

    try {
      const basicUser = process.env.NEXT_PUBLIC_BASIC_AUTH_USER!
      const basicPass = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS!
      const authHeader = `Basic ${btoa(`${basicUser}:${basicPass}`)}`
      const user = JSON.parse(localStorage.getItem('user') || '{}')

      const res = await fetch(
        `https://web.pharmaplus.co.ke/ecmws/read_customer_in_transit_orders/fetch?&size=50`,
        {
          headers: {
            Authorization: authHeader,
          },
        }
      )

      if (!res.ok) throw new Error('Failed to fetch in-transit orders.')

      const data = await res.json()

      if (Array.isArray(data.content)) {
        const formattedOrders: InTransitOrder[] = data.content.map((order: any) => ({
          id: order.id,
          user_id: order.user_id,
          cart_id: order.cart_id,
          customer_phone: order.customer_phone,
          customer_address: order.customer_address,
          payment_mode: order.payment_mode,
          amount_paid: order.amount_paid,
          balance: order.balance,
          product_details: order.product_details,
          order_status: order.order_status,
          created_on: order.created_on,
          days_since_order: order.days_since_order,
        }))

        setInTransitOrders(formattedOrders)

      } else {
        setError('No in-transit orders found or incorrect data format')
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const cancelOrder = (orderId: number): string => {
    const result = orderManager.cancelOrder(orderId)
    return result
  }

  const cancelInTransitOrder = (orderId: number): string => {
    const index = inTransitOrders.findIndex(order => order.id === orderId)
    if (index === -1) {
      return 'In-transit order not found.'
    }

    if (['DELIVERED', 'CANCELLED BY CUSTOMER'].includes(inTransitOrders[index].order_status.toUpperCase())) {
      return 'In-transit order cannot be cancelled.'
    }

    const updatedOrders = [...inTransitOrders]
    updatedOrders[index].order_status = 'CANCELLED BY CUSTOMER'
    setInTransitOrders(updatedOrders)

    return 'In-transit order has been successfully cancelled.'
  }

  useEffect(() => {
    fetchOrders()
    fetchInTransitOrders()
  }, [])

  return (
    <OrderContext.Provider
      value={{
        orderManager,
        inTransitOrders,
        fetchOrders,
        fetchInTransitOrders,
        cancelOrder,
        cancelInTransitOrder,
        loading,
        error,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export const useOrderManager = () => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrderManager must be used within an OrderProvider')
  }
  return context
}

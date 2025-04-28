import { Check, X } from "lucide-react";
import React from "react";

// Define the InTransitProps interface
interface InTransitProps {
  id: number;
  user_id: number;
  cart_id: number;
  customer_phone: string;
  customer_address: string;
  payment_mode: string;
  amount_paid: number;
  balance: number;
  product_details: string;
  order_status: string;
  created_on: string;
  days_since_order: number;
}

// Define the OrderProps interface (existing structure)
interface OrderProps {
  order_id: number;
  header: {
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
  };
}

type OrderTrackerProps = {
  order: OrderProps | InTransitProps;
  steps: { id: number; title: string }[];
};

const OrderTracker = ({ order, steps }: OrderTrackerProps) => {
  // Type guard to distinguish between the two types of orders
  const isInTransit = 'order_status' in order; // Check if it's InTransitProps
  
  // For InTransit orders
  const status_id = isInTransit
    ? steps.findIndex((step) => step.title === order.order_status) // Get status index for InTransit
    : (order as OrderProps).header.status_id; // Use header's status_id for regular orders

  const activeStep = status_id;
  const isCancelled = isInTransit
    ? order.order_status === 'CANCELLED BY CUSTOMER'
    : (steps[activeStep]?.title === 'CANCELLED BY CUSTOMER');

  return (
    <div className="flex flex-col h-full items-start p-4 gap-4">
      {steps.map((step, index) => {
        const isCompleted = index < activeStep && !isCancelled;
        const isCurrent = index === activeStep && !isCancelled;
        const isUpcoming = index > activeStep && !isCancelled;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="flex items-start relative h-full">
            {/* Circle and Line */}
            <div className="flex flex-col items-center justify-between h-full">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border-4 ${
                  isCompleted
                    ? 'bg-primary border-primary'
                    : isCurrent
                    ? isCancelled
                      ? 'bg-secondary border-secondary'
                      : 'bg-primary border-primary'
                    : 'bg-white border-gray-300'
                }`}
              >
                {isCompleted && (
                  <Check className="text-white font-semibold" />
                )}
                {isCurrent && !isCompleted && !isCancelled && (
                  <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                )}
                {isCancelled && isCurrent && (
                  <X className="text-white" />
                )}
              </div>
              {!isLast && (
                <div
                  className={`flex-grow mt-2 w-px ${isCancelled ? 'bg-red-300' : 'bg-gray-300'}`}
                ></div>
              )}
            </div>

            {/* Step Details */}
            <div className="ml-3 mb-6">
              <div
                className={`text-sm font-semibold ${
                  isCompleted || isCurrent ? 'text-primary' : isUpcoming ? 'text-gray-400' : ''
                }`}
              >
                {step.title}
              </div>
            </div>
          </div>
        );
      })}

      {/* Cancelled note */}
      {isCancelled && (
        <div className="ml-8 text-sm text-secondary mt-2">
          This order was cancelled by the customer.
        </div>
      )}
    </div>
  );
};

export default OrderTracker;

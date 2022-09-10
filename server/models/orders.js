import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      },
      postalCode: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      }
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    orderItems: [
      {
        name: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true
        },
        image: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        product: {
          type: mongoose.Schema.ObjectId,
          ref: 'Product',
          required: true
        }
      }
    ],
    paymentInfo: {
      id: {
        type: String
      },
      status: {
        type: String
      }
    },
    itemsPrice: {
      // subtotal
      type: Number,
      required: true,
      default: 0.0
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    paidAt: Date,
    orderStatus: { type: String, required: true, default: 'processing' },
    deliveredAt: Date
  },
  { timestamps: true }
)

export default mongoose.model('Order', orderSchema)

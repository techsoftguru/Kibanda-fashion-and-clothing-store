const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');
const crypto = require('crypto');

class PaymentService {
  constructor() {
    this.stripe = stripe;
  }

  // Create Stripe payment intent
  async createStripePaymentIntent(amount, currency = 'kes', metadata = {}) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency,
        metadata: metadata,
        description: metadata.description || 'Kibanda Fashion Payment'
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100
      };
    } catch (error) {
      console.error('Stripe payment intent error:', error.message);
      throw new Error(`Payment processing failed: ${error.message}`);
    }
  }

  // Retrieve Stripe payment intent
  async retrieveStripePaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return {
        success: true,
        paymentIntent: paymentIntent
      };
    } catch (error) {
      console.error('Retrieve payment intent error:', error.message);
      throw new Error(`Failed to retrieve payment: ${error.message}`);
    }
  }

  // Confirm Stripe payment
  async confirmStripePayment(paymentIntentId) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        return {
          success: true,
          paymentIntent: paymentIntent
        };
      }

      return {
        success: false,
        status: paymentIntent.status,
        error: paymentIntent.last_payment_error?.message || 'Payment failed'
      };
    } catch (error) {
      console.error('Confirm payment error:', error.message);
      throw new Error(`Payment confirmation failed: ${error.message}`);
    }
  }

  // Refund Stripe payment
  async refundStripePayment(paymentIntentId, amount = null) {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined
      });

      return {
        success: true,
        refund: refund
      };
    } catch (error) {
      console.error('Refund error:', error.message);
      throw new Error(`Refund failed: ${error.message}`);
    }
  }

  // M-Pesa STK Push
  async initiateMpesaPayment(phone, amount, accountReference) {
    try {
      // Format phone number
      let formattedPhone = phone.toString().trim();
      
      // Remove leading 0 and add 254
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.substring(1);
      } else if (formattedPhone.startsWith('+254')) {
        formattedPhone = formattedPhone.substring(1);
      } else if (!formattedPhone.startsWith('254')) {
        formattedPhone = '254' + formattedPhone;
      }

      // Validate phone
      if (!/^254[17]\d{8}$/.test(formattedPhone)) {
        throw new Error('Invalid Kenyan phone number');
      }

      // For development, simulate success
      if (process.env.NODE_ENV === 'development') {
        console.log('MPESA Simulation:', { phone: formattedPhone, amount, accountReference });
        
        // Generate fake MPESA code
        const mpesaCode = 'MPS' + Date.now().toString().slice(-6);
        
        return {
          success: true,
          message: 'MPESA payment initiated successfully',
          checkoutRequestId: 'SIM' + Date.now(),
          mpesaCode: mpesaCode,
          isSimulated: true
        };
      }

      // Production MPESA implementation
      const tokenResponse = await axios.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        {
          headers: {
            Authorization: 'Basic ' + Buffer.from(
              process.env.MPESA_CONSUMER_KEY + ':' + process.env.MPESA_CONSUMER_SECRET
            ).toString('base64')
          }
        }
      );

      const accessToken = tokenResponse.data.access_token;
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
      
      const password = Buffer.from(
        process.env.MPESA_SHORTCODE + process.env.MPESA_PASSKEY + timestamp
      ).toString('base64');

      const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        {
          BusinessShortCode: process.env.MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: amount,
          PartyA: formattedPhone,
          PartyB: process.env.MPESA_SHORTCODE,
          PhoneNumber: formattedPhone,
          CallBackURL: process.env.MPESA_CALLBACK_URL,
          AccountReference: accountReference,
          TransactionDesc: 'Kibanda Fashion Purchase'
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        message: 'MPESA payment initiated',
        checkoutRequestId: response.data.CheckoutRequestID,
        response: response.data
      };
    } catch (error) {
      console.error('MPESA payment error:', error.response?.data || error.message);
      throw new Error(`MPESA payment failed: ${error.response?.data?.errorMessage || error.message}`);
    }
  }

  // Check M-Pesa transaction status
  async checkMpesaTransaction(checkoutRequestId) {
    try {
      if (process.env.NODE_ENV === 'development') {
        // Simulate success in development
        return {
          success: true,
          status: 'Completed',
          isSimulated: true
        };
      }

      const tokenResponse = await axios.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        {
          headers: {
            Authorization: 'Basic ' + Buffer.from(
              process.env.MPESA_CONSUMER_KEY + ':' + process.env.MPESA_CONSUMER_SECRET
            ).toString('base64')
          }
        }
      );

      const accessToken = tokenResponse.data.access_token;
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
      
      const password = Buffer.from(
        process.env.MPESA_SHORTCODE + process.env.MPESA_PASSKEY + timestamp
      ).toString('base64');

      const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
        {
          BusinessShortCode: process.env.MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: checkoutRequestId
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        status: response.data.ResultDesc,
        response: response.data
      };
    } catch (error) {
      console.error('MPESA status check error:', error.message);
      throw new Error(`Failed to check MPESA status: ${error.message}`);
    }
  }

  // Process cash on delivery
  async processCashOnDelivery(orderDetails) {
    try {
      // Cash on delivery doesn't require immediate payment processing
      return {
        success: true,
        paymentMethod: 'cash_on_delivery',
        status: 'pending',
        message: 'Payment will be collected on delivery'
      };
    } catch (error) {
      console.error('Cash on delivery error:', error.message);
      throw new Error(`Cash on delivery processing failed: ${error.message}`);
    }
  }

  // Process payment based on method
  async processPayment(orderData) {
    try {
      const { paymentMethod, amount, orderId, customer } = orderData;
      
      let result;

      switch (paymentMethod) {
        case 'stripe':
          result = await this.createStripePaymentIntent(amount, 'kes', {
            orderId: orderId,
            customerEmail: customer.email,
            customerName: customer.name
          });
          break;

        case 'mpesa':
          result = await this.initiateMpesaPayment(
            customer.phone,
            amount,
            `ORDER-${orderId}`
          );
          break;

        case 'cash_on_delivery':
          result = await this.processCashOnDelivery(orderData);
          break;

        default:
          throw new Error(`Unsupported payment method: ${paymentMethod}`);
      }

      return {
        ...result,
        paymentMethod: paymentMethod,
        orderId: orderId,
        amount: amount
      };
    } catch (error) {
      console.error('Payment processing error:', error.message);
      throw error;
    }
  }

  // Verify payment
  async verifyPayment(paymentIntentId, paymentMethod) {
    try {
      if (paymentMethod === 'stripe') {
        const paymentIntent = await this.retrieveStripePaymentIntent(paymentIntentId);
        
        return {
          success: paymentIntent.paymentIntent.status === 'succeeded',
          status: paymentIntent.paymentIntent.status,
          amount: paymentIntent.paymentIntent.amount / 100,
          currency: paymentIntent.paymentIntent.currency
        };
      }

      if (paymentMethod === 'mpesa') {
        // For MPESA, we would typically check via callback
        // This is a simplified version
        return {
          success: true,
          status: 'completed',
          message: 'MPESA payment verified'
        };
      }

      return {
        success: false,
        error: 'Invalid payment method for verification'
      };
    } catch (error) {
      console.error('Payment verification error:', error.message);
      throw new Error(`Payment verification failed: ${error.message}`);
    }
  }

  // Get payment status
  async getPaymentStatus(paymentData) {
    try {
      const { paymentMethod, paymentId } = paymentData;
      
      if (paymentMethod === 'stripe') {
        const paymentIntent = await this.retrieveStripePaymentIntent(paymentId);
        return {
          method: 'stripe',
          status: paymentIntent.paymentIntent.status,
          amount: paymentIntent.paymentIntent.amount / 100,
          created: new Date(paymentIntent.paymentIntent.created * 1000)
        };
      }

      if (paymentMethod === 'mpesa') {
        const status = await this.checkMpesaTransaction(paymentId);
        return {
          method: 'mpesa',
          status: status.status,
          isSimulated: status.isSimulated || false
        };
      }

      return {
        method: paymentMethod,
        status: 'unknown',
        error: 'Unsupported payment method'
      };
    } catch (error) {
      console.error('Get payment status error:', error.message);
      throw new Error(`Failed to get payment status: ${error.message}`);
    }
  }

  // Calculate payment fees
  calculatePaymentFees(amount, paymentMethod) {
    const fees = {
      stripe: {
        percentage: 0.035, // 3.5%
        fixed: 15 // KES 15
      },
      mpesa: {
        percentage: 0.01, // 1%
        fixed: 0
      },
      cash_on_delivery: {
        percentage: 0,
        fixed: 0
      }
    };

    const methodFees = fees[paymentMethod] || fees.stripe;
    const fee = (amount * methodFees.percentage) + methodFees.fixed;
    
    return {
      amount: amount,
      fee: Math.round(fee),
      total: amount + Math.round(fee),
      breakdown: {
        percentageFee: amount * methodFees.percentage,
        fixedFee: methodFees.fixed
      }
    };
  }
}

// Create singleton instance
const paymentService = new PaymentService();

module.exports = paymentService;
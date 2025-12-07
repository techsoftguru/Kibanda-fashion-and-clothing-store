const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

class SMSService {
  constructor() {
    // Configure SMS provider (using Africa's Talking as example)
    this.apiKey = process.env.SMS_API_KEY;
    this.username = process.env.SMS_USERNAME;
    this.senderId = process.env.SMS_SENDER_ID || 'Kibanda';
    this.provider = process.env.SMS_PROVIDER || 'africas_talking';
  }

  // Format phone number for Kenya
  formatPhoneNumber(phone) {
    if (!phone) return null;
    
    let formatted = phone.toString().trim();
    
    // Remove any non-digit characters
    formatted = formatted.replace(/\D/g, '');
    
    // Add country code if missing
    if (formatted.startsWith('0')) {
      formatted = '254' + formatted.substring(1);
    } else if (formatted.startsWith('7') || formatted.startsWith('1')) {
      formatted = '254' + formatted;
    }
    
    // Validate length
    if (formatted.length !== 12) {
      throw new Error('Invalid phone number length');
    }
    
    return formatted;
  }

  // Send SMS via Africa's Talking
  async sendViaAfricaTalking(phone, message) {
    try {
      const response = await axios.post(
        'https://api.africastalking.com/version1/messaging',
        {
          username: this.username,
          to: phone,
          message: message,
          from: this.senderId
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'apiKey': this.apiKey,
            'Accept': 'application/json'
          }
        }
      );

      return {
        success: true,
        messageId: response.data.SMSMessageData.Recipients[0]?.messageId,
        cost: response.data.SMSMessageData.Recipients[0]?.cost,
        provider: 'Africa\'s Talking'
      };
    } catch (error) {
      console.error('Africa\'s Talking SMS error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Send SMS via Twilio
  async sendViaTwilio(phone, message) {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

      const response = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        new URLSearchParams({
          To: phone,
          From: twilioPhone,
          Body: message
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64')
          }
        }
      );

      return {
        success: true,
        messageId: response.data.sid,
        provider: 'Twilio'
      };
    } catch (error) {
      console.error('Twilio SMS error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Send SMS via custom provider
  async sendViaCustomProvider(phone, message) {
    try {
      // Custom SMS provider implementation
      const response = await axios.post(
        process.env.SMS_API_URL,
        {
          api_key: this.apiKey,
          sender_id: this.senderId,
          phone: phone,
          message: message
        }
      );

      return {
        success: true,
        messageId: response.data.message_id,
        provider: 'Custom'
      };
    } catch (error) {
      console.error('Custom SMS provider error:', error);
      throw error;
    }
  }

  // Main SMS sending method
  async sendSMS(phone, message) {
    try {
      // Format phone number
      const formattedPhone = this.formatPhoneNumber(phone);
      
      if (!formattedPhone) {
        throw new Error('Invalid phone number');
      }

      // Validate message
      if (!message || message.trim().length === 0) {
        throw new Error('SMS message cannot be empty');
      }

      // Truncate message if too long
      if (message.length > 160) {
        message = message.substring(0, 157) + '...';
      }

      let result;

      // Choose provider based on configuration
      switch (this.provider) {
        case 'africas_talking':
          result = await this.sendViaAfricaTalking(formattedPhone, message);
          break;

        case 'twilio':
          result = await this.sendViaTwilio(formattedPhone, message);
          break;

        case 'custom':
          result = await this.sendViaCustomProvider(formattedPhone, message);
          break;

        default:
          throw new Error(`Unsupported SMS provider: ${this.provider}`);
      }

      console.log(`SMS sent to ${formattedPhone}: ${message.substring(0, 50)}...`);
      return result;
    } catch (error) {
      console.error('SMS sending error:', error.message);
      throw error;
    }
  }

  // SMS Templates
  templates = {
    orderConfirmation: (order) => ({
      message: `Your order #${order.orderNumber} has been confirmed. Total: KES ${order.total}. We'll notify you when it ships. - Kibanda Fashion`
    }),

    orderShipped: (order) => ({
      message: `Your order #${order.orderNumber} has been shipped! Tracking: ${order.trackingNumber || 'N/A'}. - Kibanda Fashion`
    }),

    orderDelivered: (order) => ({
      message: `Your order #${order.orderNumber} has been delivered. Thank you for shopping with us! - Kibanda Fashion`
    }),

    paymentConfirmation: (order) => ({
      message: `Payment of KES ${order.total} for order #${order.orderNumber} confirmed. - Kibanda Fashion`
    }),

    otpVerification: (otp) => ({
      message: `Your Kibanda Fashion verification code is: ${otp}. Valid for 10 minutes.`
    }),

    passwordReset: (resetUrl) => ({
      message: `Reset your Kibanda Fashion password: ${resetUrl}. Link expires in 10 minutes.`
    }),

    welcome: () => ({
      message: `Welcome to Kibanda Fashion! Enjoy exclusive offers and fast delivery. Download our app: ${process.env.FRONTEND_URL}`
    }),

    cartReminder: () => ({
      message: `You have items in your cart! Complete your purchase to enjoy our latest collections. - Kibanda Fashion`
    }),

    promotion: (promoCode, discount) => ({
      message: `Use code ${promoCode} for ${discount}% off your next purchase! Valid for 48 hours. - Kibanda Fashion`
    })
  };

  // Send order confirmation SMS
  async sendOrderConfirmationSMS(phone, order) {
    const template = this.templates.orderConfirmation(order);
    return await this.sendSMS(phone, template.message);
  }

  // Send order shipped SMS
  async sendOrderShippedSMS(phone, order) {
    const template = this.templates.orderShipped(order);
    return await this.sendSMS(phone, template.message);
  }

  // Send order delivered SMS
  async sendOrderDeliveredSMS(phone, order) {
    const template = this.templates.orderDelivered(order);
    return await this.sendSMS(phone, template.message);
  }

  // Send payment confirmation SMS
  async sendPaymentConfirmationSMS(phone, order) {
    const template = this.templates.paymentConfirmation(order);
    return await this.sendSMS(phone, template.message);
  }

  // Send OTP SMS
  async sendOTPSMS(phone, otp) {
    const template = this.templates.otpVerification(otp);
    return await this.sendSMS(phone, template.message);
  }

  // Send password reset SMS
  async sendPasswordResetSMS(phone, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const template = this.templates.passwordReset(resetUrl);
    return await this.sendSMS(phone, template.message);
  }

  // Send welcome SMS
  async sendWelcomeSMS(phone) {
    const template = this.templates.welcome();
    return await this.sendSMS(phone, template.message);
  }

  // Send cart reminder SMS
  async sendCartReminderSMS(phone) {
    const template = this.templates.cartReminder();
    return await this.sendSMS(phone, template.message);
  }

  // Send promotion SMS
  async sendPromotionSMS(phone, promoCode, discount) {
    const template = this.templates.promotion(promoCode, discount);
    return await this.sendSMS(phone, template.message);
  }

  // Bulk SMS sending
  async sendBulkSMS(phones, message) {
    const results = [];
    
    for (const phone of phones) {
      try {
        const result = await this.sendSMS(phone, message);
        results.push({ phone, success: true, result });
      } catch (error) {
        results.push({ phone, success: false, error: error.message });
      }
    }
    
    return results;
  }

  // SMS delivery status check
  async checkDeliveryStatus(messageId) {
    try {
      // Implementation depends on SMS provider
      // This is a placeholder for Africa's Talking
      const response = await axios.get(
        `https://api.africastalking.com/version1/messaging/${messageId}`,
        {
          headers: {
            'apiKey': this.apiKey,
            'Accept': 'application/json'
          }
        }
      );

      return {
        status: response.data.status,
        deliveryTime: response.data.deliveryTime,
        networkCode: response.data.networkCode
      };
    } catch (error) {
      console.error('SMS delivery status check error:', error);
      throw error;
    }
  }

  // SMS balance check
  async checkBalance() {
    try {
      // Implementation for Africa's Talking
      const response = await axios.get(
        'https://api.africastalking.com/version1/user',
        {
          params: { username: this.username },
          headers: {
            'apiKey': this.apiKey,
            'Accept': 'application/json'
          }
        }
      );

      return {
        balance: response.data.UserData.balance,
        currency: 'KES'
      };
    } catch (error) {
      console.error('SMS balance check error:', error);
      return {
        balance: 'Unknown',
        currency: 'KES'
      };
    }
  }

  // SMS scheduling (future implementation)
  async scheduleSMS(phone, message, sendTime) {
    // This would require a job queue system
    // For now, we'll log it and send immediately
    console.log(`Scheduled SMS for ${sendTime}: ${message.substring(0, 50)}...`);
    
    // Store in database for later processing
    const scheduledSMS = {
      phone,
      message,
      sendTime,
      status: 'scheduled'
    };

    // You would typically save this to a database
    // and have a cron job to process scheduled SMS

    return {
      success: true,
      scheduledId: Date.now().toString(),
      scheduledFor: sendTime
    };
  }
}

// Create singleton instance
const smsService = new SMSService();

module.exports = smsService;
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Verify connection configuration
    this.transporter.verify((error) => {
      if (error) {
        console.error('Email service error:', error);
      } else {
        console.log('Email service is ready to send messages');
      }
    });
  }

  // Send email with template
  async sendEmail(options) {
    try {
      const mailOptions = {
        from: `"Kibanda Fashion" <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.htmlToText(options.html),
        ...(options.attachments && { attachments: options.attachments })
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  // Convert HTML to plain text (simple version)
  htmlToText(html) {
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Email templates
  templates = {
    orderConfirmation: (order, user) => ({
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 10px 20px; background: #000; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Kibanda Fashion</h1>
              <h2>Order Confirmation</h2>
            </div>
            <div class="content">
              <p>Hello ${user.name},</p>
              <p>Thank you for your order! Here are your order details:</p>
              
              <div class="order-details">
                <h3>Order #${order.orderNumber}</h3>
                <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Status:</strong> ${order.status}</p>
                
                <h4>Items:</h4>
                <ul>
                  ${order.items.map(item => `
                    <li>${item.quantity}x ${item.product?.name || 'Product'} - KES ${item.total.toLocaleString()}</li>
                  `).join('')}
                </ul>
                
                <h4>Total: KES ${order.total.toLocaleString()}</h4>
                
                <h4>Shipping Address:</h4>
                <p>
                  ${order.shippingAddress.name}<br>
                  ${order.shippingAddress.street}<br>
                  ${order.shippingAddress.city}, ${order.shippingAddress.country}<br>
                  ${order.shippingAddress.postalCode}
                </p>
              </div>
              
              <p>You can track your order using this link:</p>
              <p>
                <a href="${process.env.FRONTEND_URL}/order-tracking?order=${order.orderNumber}" class="button">
                  Track Your Order
                </a>
              </p>
              
              <p>If you have any questions, please contact our support team.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Kibanda Fashion. All rights reserved.</p>
              <p>This email was sent to ${user.email}</p>
            </div>
          </div>
        </body>
        </html>
      `
    }),

    passwordReset: (user, resetUrl) => ({
      subject: 'Password Reset Request - Kibanda Fashion',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #000; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Kibanda Fashion</h1>
              <h2>Password Reset</h2>
            </div>
            <div class="content">
              <p>Hello ${user.name},</p>
              <p>You requested a password reset for your Kibanda Fashion account.</p>
              <p>Click the button below to reset your password:</p>
              
              <p>
                <a href="${resetUrl}" class="button">
                  Reset Password
                </a>
              </p>
              
              <p>This link will expire in 10 minutes.</p>
              <p>If you didn't request this password reset, please ignore this email.</p>
              <p>For security reasons, do not share this link with anyone.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Kibanda Fashion. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }),

    welcomeEmail: (user) => ({
      subject: 'Welcome to Kibanda Fashion!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #000; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .benefits { margin: 20px 0; }
            .benefit-item { margin: 10px 0; padding-left: 20px; position: relative; }
            .benefit-item:before { content: '✓'; position: absolute; left: 0; color: #2ecc71; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Kibanda Fashion!</h1>
            </div>
            <div class="content">
              <p>Hello ${user.name},</p>
              <p>Thank you for joining Kibanda Fashion! We're excited to have you as part of our community.</p>
              
              <div class="benefits">
                <h3>Here's what you can do with your account:</h3>
                <div class="benefit-item">Track your orders</div>
                <div class="benefit-item">Save multiple addresses</div>
                <div class="benefit-item">Create wishlists</div>
                <div class="benefit-item">Get exclusive deals</div>
                <div class="benefit-item">Write product reviews</div>
              </div>
              
              <p>Get started by browsing our latest collections:</p>
              <p>
                <a href="${process.env.FRONTEND_URL}/shop" class="button">
                  Start Shopping
                </a>
              </p>
              
              <p>Need help? Our support team is always here to assist you.</p>
              <p>Happy shopping!</p>
              <p>The Kibanda Fashion Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Kibanda Fashion. All rights reserved.</p>
              <p>This email was sent to ${user.email}</p>
            </div>
          </div>
        </body>
        </html>
      `
    }),

    paymentConfirmation: (order, user) => ({
      subject: `Payment Confirmed - Order ${order.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2ecc71; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .payment-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2ecc71; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Payment Confirmed!</h1>
            </div>
            <div class="content">
              <p>Hello ${user.name},</p>
              <p>Your payment has been successfully processed.</p>
              
              <div class="payment-details">
                <h3>Payment Details</h3>
                <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                <p><strong>Amount Paid:</strong> KES ${order.total.toLocaleString()}</p>
                <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                ${order.paymentDetails.mpesaCode ? `<p><strong>M-Pesa Code:</strong> ${order.paymentDetails.mpesaCode}</p>` : ''}
                ${order.paymentDetails.transactionId ? `<p><strong>Transaction ID:</strong> ${order.paymentDetails.transactionId}</p>` : ''}
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              
              <p>Your order is now being processed. We'll notify you when it ships.</p>
              <p>Thank you for shopping with Kibanda Fashion!</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Kibanda Fashion. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    })
  };

  // Send order confirmation email
  async sendOrderConfirmation(order, user) {
    const template = this.templates.orderConfirmation(order, user);
    return await this.sendEmail({
      to: user.email,
      ...template
    });
  }

  // Send password reset email
  async sendPasswordReset(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const template = this.templates.passwordReset(user, resetUrl);
    return await this.sendEmail({
      to: user.email,
      ...template
    });
  }

  // Send welcome email
  async sendWelcomeEmail(user) {
    const template = this.templates.welcomeEmail(user);
    return await this.sendEmail({
      to: user.email,
      ...template
    });
  }

  // Send payment confirmation email
  async sendPaymentConfirmation(order, user) {
    const template = this.templates.paymentConfirmation(order, user);
    return await this.sendEmail({
      to: user.email,
      ...template
    });
  }

  // Send order status update email
  async sendOrderStatusUpdate(order, user, newStatus) {
    const subject = `Order ${order.orderNumber} Status Update`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3498db; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .status-box { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #3498db; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Status Updated</h1>
          </div>
          <div class="content">
            <p>Hello ${user.name},</p>
            <p>Your order status has been updated:</p>
            
            <div class="status-box">
              <h3>Order #${order.orderNumber}</h3>
              <p><strong>New Status:</strong> ${newStatus}</p>
              ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
              ${order.trackingUrl ? `<p><strong>Track Your Order:</strong> <a href="${order.trackingUrl}">${order.trackingUrl}</a></p>` : ''}
            </div>
            
            <p>Thank you for shopping with Kibanda Fashion!</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Kibanda Fashion. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to: user.email,
      subject,
      html
    });
  }
}

// Create singleton instance
const emailService = new EmailService();

module.exports = emailService;
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Email templates
const emailTemplates = {
  welcome: (name) => ({
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
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .button { display: inline-block; padding: 12px 24px; background: #000; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Kibanda Fashion</h1>
          </div>
          <div class="content">
            <h2>Welcome ${name}!</h2>
            <p>Thank you for joining Kibanda Fashion. We're excited to have you as part of our community.</p>
            <p>Start exploring our latest collections and enjoy exclusive member benefits.</p>
            <p>
              <a href="${process.env.FRONTEND_URL}/shop" class="button">
                Start Shopping
              </a>
            </p>
            <p>If you have any questions, feel free to contact our support team.</p>
            <p>Happy shopping!</p>
            <p>The Kibanda Fashion Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Kibanda Fashion. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  orderConfirmation: (order, name) => ({
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
          .button { display: inline-block; padding: 12px 24px; background: #000; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmation</h1>
            <h2>#${order.orderNumber}</h2>
          </div>
          <div class="content">
            <p>Hello ${name},</p>
            <p>Thank you for your order! Here are your order details:</p>
            
            <div class="order-details">
              <h3>Order Summary</h3>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Status:</strong> ${order.status}</p>
              
              <h4>Items:</h4>
              <ul>
                ${order.items.map(item => `
                  <li>${item.quantity}x ${item.product?.name || 'Product'} - KES ${item.total.toLocaleString()}</li>
                `).join('')}
              </ul>
              
              <h4>Shipping Address:</h4>
              <p>
                ${order.shippingAddress.name}<br>
                ${order.shippingAddress.street}<br>
                ${order.shippingAddress.city}, ${order.shippingAddress.country}<br>
                ${order.shippingAddress.postalCode}
              </p>
              
              <h4>Order Total: KES ${order.total.toLocaleString()}</h4>
            </div>
            
            <p>You can track your order using this link:</p>
            <p>
              <a href="${process.env.FRONTEND_URL}/order-tracking/${order.orderNumber}" class="button">
                Track Your Order
              </a>
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Kibanda Fashion. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  passwordReset: (name, resetUrl) => ({
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
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .button { display: inline-block; padding: 12px 24px; background: #000; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset</h1>
          </div>
          <div class="content">
            <p>Hello ${name},</p>
            <p>You requested a password reset for your Kibanda Fashion account.</p>
            <p>Click the button below to reset your password:</p>
            <p>
              <a href="${resetUrl}" class="button">
                Reset Password
              </a>
            </p>
            <p>This link will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Kibanda Fashion. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  orderStatusUpdate: (order, name, newStatus) => ({
    subject: `Order ${order.orderNumber} Status Update`,
    html: `
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
          .button { display: inline-block; padding: 12px 24px; background: #3498db; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Status Updated</h1>
          </div>
          <div class="content">
            <p>Hello ${name},</p>
            <p>Your order status has been updated:</p>
            
            <div class="status-box">
              <h3>Order #${order.orderNumber}</h3>
              <p><strong>New Status:</strong> ${newStatus}</p>
              ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
              ${order.trackingUrl ? `<p><strong>Track Your Order:</strong> <a href="${order.trackingUrl}">Click here</a></p>` : ''}
            </div>
            
            <p>
              <a href="${process.env.FRONTEND_URL}/order-tracking/${order.orderNumber}" class="button">
                View Order Details
              </a>
            </p>
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

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Kibanda Fashion" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || stripHtml(options.html)
    };

    // Add attachments if provided
    if (options.attachments) {
      mailOptions.attachments = options.attachments;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Helper function to strip HTML tags for text version
const stripHtml = (html) => {
  return html
    .replace(/<[^>]*>/g, ' ') // Replace tags with space
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim();
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
  const template = emailTemplates.welcome(user.name);
  return await sendEmail({
    to: user.email,
    subject: template.subject,
    html: template.html
  });
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (order, user) => {
  const template = emailTemplates.orderConfirmation(order, user.name);
  return await sendEmail({
    to: user.email,
    subject: template.subject,
    html: template.html
  });
};

// Send password reset email
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const template = emailTemplates.passwordReset(user.name, resetUrl);
  return await sendEmail({
    to: user.email,
    subject: template.subject,
    html: template.html
  });
};

// Send order status update email
const sendOrderStatusUpdateEmail = async (order, user, newStatus) => {
  const template = emailTemplates.orderStatusUpdate(order, user.name, newStatus);
  return await sendEmail({
    to: user.email,
    subject: template.subject,
    html: template.html
  });
};

// Verify email service is working
const verifyEmailService = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email service is ready');
    return true;
  } catch (error) {
    console.error('Email service verification failed:', error);
    return false;
  }
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendPasswordResetEmail,
  sendOrderStatusUpdateEmail,
  verifyEmailService,
  emailTemplates
};
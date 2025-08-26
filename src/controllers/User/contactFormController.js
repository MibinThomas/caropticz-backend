import transporter from "../../config/emailConfig.js";

import notifications from "../../models/NotificationModel.js";

export const sendContactForm = async (req, res) => {
  try {
    const { name, email, phone, message, services } = req.body;

    if (!name || !email || !phone || !message || !services) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Send email
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.RECEIVER_EMAIL || "yourbusiness@example.com",
      subject: `New Contact Form Submission`,
      html: `
        <h3>Contact Details</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Services:</strong> ${services}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Save notification in DB
    await notifications.create({
      title: "New Contact Form Submission",
      message: `${name} sent a message regarding: ${services}`,
      type: "system", // since this is an internal system notification
    });

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Email Send Error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

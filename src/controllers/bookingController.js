import mongoose from "mongoose";
import Bookings from "../models/Booking.js";
import notifications from "../models/NotificationModel.js";

const bookingController = {
  // Logged-in booking
  createBooking: async (req, res) => {
    console.log("im inside booking");

    const {
      fullName,
      email,
      mobile,
      service,
      date,
      timeSlot,
      address,
      payment,
    } = req.body;
    req.body;
    const userId = req.user;

    if (!fullName || !email || !mobile || !service || !date || !payment) {
      return res.status(400).json({
        message: "All fields are required",
        received: req.body, // Helps debug missing fields
      });
    }

    try {
      console.log("Inside try");

      let paymentStatus = "pending";

      // If payment is Cash on Delivery
      if (payment === "Cash on Delivery") {
        paymentStatus = "pending";
      }

      const newBooking = new Bookings({
        fullName,
        email,
        mobile,
        service,
        date,
        timeSlot,
        address,
        userId: userId,
        paymentStatus,
      });

      console.log("New Booking", newBooking);

      await newBooking.save();

      // Notification for User
      await notifications.create({
        userId, // User who booked
        title: "Booking Created",
        message: `Your booking for ${service} on ${date} has been created.`,
        type: "booking",
      });

      // Notification for Admin
      await notifications.create({
        title: "New Booking",
        message: `${fullName} booked ${service} on ${date} at ${
          timeSlot || "N/A"
        }`,
        type: "system",
      });

      res.status(201).json({
        message: "Booking created successfully",
        booking: newBooking,
      });
      console.log("Successs booking");
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  // Guest booking
  createGuestBooking: async (req, res) => {
    console.log("Im in guest booking");

    const {
      fullName,
      email,
      mobile,
      service,
      date,
      timeSlot,
      address,
      payment,
    } = req.body;

    // if (
    //   !fullName ||
    //   !email ||
    //   !mobile ||
    //   !service ||
    //   !date ||
    //   !payment
    //   // ||
    //   // !timeSlot ||
    //   // !address
    // ) {
    //   return res.status(400).json({ message: "All fields are required" });
    // }

    if (!fullName || !email || !mobile || !service || !date || !payment) {
      return res.status(400).json({
        message: "All fields are required",
        received: req.body, // Helps debug missing fields
      });
    }

    try {
      console.log("Inside try");

      let paymentStatus = "pending";

      // If payment is Cash on Delivery
      if (payment === "Cash on Delivery") {
        paymentStatus = "pending";
      }

      const newBooking = new Bookings({
        fullName,
        email,
        mobile,
        service,
        date,
        timeSlot,
        address,
        userId: null,
        paymentStatus,
      });

      console.log("New Booking", newBooking);

      await newBooking.save();

      res.status(201).json({
        message: "Guest booking created successfully",
        booking: newBooking,
      });
      console.log("Successs booking");
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  // Bookings by user
  getUserBookings: async (req, res) => {
    try {
      const { id } = req.params;

      // Find bookings for the user and populate user details
      const bookings = await Bookings.find({ userId: id })
        .populate("userId") // populate user information
        .sort({ createdAt: -1 }); // latest bookings first

      if (bookings.length === 0) {
        return res.status(404).json({ message: "No bookings found" });
      }

      res.status(200).json({
        message: "Bookings found",
        bookings,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  getSingleBooking: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Bookings.findById(id).populate("userId");
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.status(200).json({ message: "Booking found", booking });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  //unDelivered bookings
  getUncompletedBookings: async (req, res) => {
    try {
      const { userId } = req.query; 

      // Build the filter
      const filter = { status: { $ne: "completed" } };
      if (userId) {
        filter.userId = userId;
      }

      const uncompletedBookings = await Bookings.find(filter)
        .populate("userId")
        .sort({ createdAt: -1 });

      if (uncompletedBookings.length > 0) {
        res.status(200).json({
          message: "Uncompleted bookings found",
          bookings: uncompletedBookings,
        });
      } else {
        res.status(404).json({ message: "No uncompleted bookings found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  // Get all bookings
  getAllBookings: async (req, res) => {
    try {
      const bookings = await Bookings.find()
        .populate("userId")
        .sort({ createdAt: -1 });
      if (bookings.length > 0) {
        res.status(200).json({ message: "All bookings retrieved", bookings });
      } else {
        res.status(404).json({ message: "No bookings found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  // Update booking
  updateBookingStatus: async (req, res) => {
    const { id } = req.params;
    const { fullName, email, mobile, service, date } = req.body;
    try {
      const updatedBooking = await Bookings.findByIdAndUpdate(
        id,
        { fullName, email, mobile, service, date },
        { new: true }
      );
      if (updatedBooking) {
        res
          .status(200)
          .json({ message: "Booking updated successfully", updatedBooking });
      } else {
        res.status(404).json({ message: "Booking not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
  deleteBooking: async (req, res) => {
    const { id } = req.params;

    try {
      const deletedBooking = await Bookings.findByIdAndDelete(id);
      if (deletedBooking) {
        res
          .status(200)
          .json({ message: "Booking deleted successfully", deletedBooking });
      } else {
        res.status(404).json({ message: "Booking not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
};

export default bookingController;

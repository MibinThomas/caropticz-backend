import bookings from "../../models/Booking.js";

const bookingController = {
  getAllBookings: async (req, res) => {
    try {
      const allBookings = await bookings.find().sort({ createdAt: -1 });

      if (!allBookings.length) {
        return res.status(404).json({ message: "No bookings found" });
      }

      res.status(200).json({
        message: "Bookings retrieved successfully",
        bookings: allBookings,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  updateBookingStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { action, rescheduledDate, rescheduledTimeSlot } = req.body;

      let updateFields = {};

      if (action === "approve") {
        updateFields.status = "confirmed";
      } else if (action === "reschedule") {
        if (!rescheduledDate || !rescheduledTimeSlot) {
          return res.status(400).json({
            success: false,
            message: "Rescheduled date and time slot are required",
          });
        }
        updateFields = {
          status: "rescheduled",
          rescheduledDate,
          rescheduledTimeSlot,
        };
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid action. Use 'approve' or 'reschedule'",
        });
      }

      const updatedBooking = await bookings.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true, runValidators: true }
      );

      if (!updatedBooking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      res.status(200).json({
        success: true,
        message: `Booking ${action}d successfully`,
        data: updatedBooking,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },

  getBookingStats: async (req, res) => {
    try {
      const { period } = req.query; // daily, monthly, yearly
      if (!period)
        return res.status(400).json({ message: "Period is required" });

      let startCurrent, startPrevious, endCurrent;

      const now = new Date();

      switch (period) {
        case "daily":
          startCurrent = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          endCurrent = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1
          );

          startPrevious = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - 1
          );
          break;

        case "monthly":
          startCurrent = new Date(now.getFullYear(), now.getMonth(), 1);
          endCurrent = new Date(now.getFullYear(), now.getMonth() + 1, 1);

          startPrevious = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          break;

        case "yearly":
          startCurrent = new Date(now.getFullYear(), 0, 1);
          endCurrent = new Date(now.getFullYear() + 1, 0, 1);

          startPrevious = new Date(now.getFullYear() - 1, 0, 1);
          break;

        default:
          return res.status(400).json({ message: "Invalid period" });
      }

      // Current period stats
      const currentStats = await bookings.aggregate([
        {
          $match: { createdAt: { $gte: startCurrent, $lt: endCurrent } },
        },
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            pendingBookings: {
              $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
            },
            toApproveBookings: {
              $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] },
            },
          },
        },
      ]);

      // Previous period stats
      const previousStats = await bookings.aggregate([
        {
          $match: { createdAt: { $gte: startPrevious, $lt: startCurrent } },
        },
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            pendingBookings: {
              $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
            },
            toApproveBookings: {
              $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] },
            },
          },
        },
      ]);

      const formatStats = (current, previous) => {
        const prev = previous[0] || {
          totalBookings: 0,
          pendingBookings: 0,
          toApproveBookings: 0,
        };
        const curr = current[0] || {
          totalBookings: 0,
          pendingBookings: 0,
          toApproveBookings: 0,
        };

        const percentageChange = (currentVal, previousVal) => {
          if (previousVal === 0) return currentVal === 0 ? 0 : 100;
          return (((currentVal - previousVal) / previousVal) * 100).toFixed(1);
        };

        return {
          totalBookings: {
            count: curr.totalBookings,
            change: percentageChange(curr.totalBookings, prev.totalBookings),
          },
          pendingBookings: {
            count: curr.pendingBookings,
            change: percentageChange(
              curr.pendingBookings,
              prev.pendingBookings
            ),
          },
          toApproveBookings: {
            count: curr.toApproveBookings,
            change: percentageChange(
              curr.toApproveBookings,
              prev.toApproveBookings
            ),
          },
        };
      };

      const stats = formatStats(currentStats, previousStats);

      res.status(200).json({ period, stats });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong", error });
    }
  },
};

export default bookingController;

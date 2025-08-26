import express from "express";
import bookingController from "../controllers/bookingController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();


router.post('/', authMiddleware, bookingController.createBooking)
router.post('/guest', bookingController.createGuestBooking)

router.get('/:id',authMiddleware,bookingController.getSingleBooking)
router.get('/user/:id',authMiddleware, bookingController.getUserBookings)
router.get("/uncompleted",authMiddleware,bookingController.getUncompletedBookings);



router.put('/:id', authMiddleware, bookingController.updateBookingStatus)
router.delete('/:id', authMiddleware, bookingController.deleteBooking)
// router.get('/:id',bookingController.getUserBookings)
export default router
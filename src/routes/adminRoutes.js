import express from "express";
import galleryController from "../controllers/Admin/galleryController.js"; 
import adminAuth from "../middlewares/adminAuthMiddleware.js";
import multerMiddleware from "../middlewares/multerMiddleware.js"
import bookingController from "../controllers/Admin/bookingController.js";
import userController from "../controllers/Admin/userDetailsController.js";
import serviceAdminController from "../controllers/Admin/serviceController.js";
import serviceTypeController from "../controllers/Admin/serviceTypeController.js";
import adminNotification from "../controllers/Admin/notificationAdminController.js";

const router = express.Router();

router.post('/gallery', multerMiddleware('images', true), galleryController.createGallery)
router.get('/gallery',galleryController.getGalleriesbyType)
router.get('/gallery/:id',galleryController.getGalleryById)
router.put('/gallery/:id',multerMiddleware('images', true),galleryController.editGallery)
router.delete('/gallery/:id',galleryController.deleteGallery)


// router.post('/services', adminAuth,multerMiddleware('images', true), serviceController.createService)



//serviceType(Category)

router.post("/category",serviceTypeController.addServiceType)
router.put("/category/:id",serviceTypeController.editServiceType)
router.patch("/category/:id/toggle",serviceTypeController.toggleServiceTypeAvailability)
router.get("/category",serviceTypeController.getAllServiceTypes)


//service management
//write adminAuth
router.post('/services',multerMiddleware('images', true), serviceAdminController.createService)
router.get('/services',serviceAdminController.getAllServicesAdmin)
router.put('/services/:serviceId',multerMiddleware('images', true),serviceAdminController.editServices)
router.patch('/services/block-unblock/:serviceId',multerMiddleware('images', true), serviceAdminController.toggleServiceAvailablity)


//booking management
router.get('/bookings', adminAuth,bookingController.getAllBookings ) //tested and verified
router.put('/bookings/:id',adminAuth, bookingController.updateBookingStatus) //TESTED AND VERIFIED 
//api to get monthly,weekly, daily count filter
router.get('/bookings/stats',adminAuth, bookingController.getBookingStats) //Tested and verified

//user management
//write adminAuth
router.get('/users',userController.getAllUsers )
router.patch('/block-unblock/:id',userController.blockUser)



//notification

router.get('/notifications',adminNotification.getAdminNotifications)
router.patch('/notifications/:id/read', adminNotification.markAdminNotificationAsRead)

export default router;
import express from 'express';
import multerMiddleware from '../middlewares/multerMiddleware.js';
import galleryController from '../controllers/User/galleryController.js';

const router = express.Router();

// router.post('/gallery',multerMiddleware('images', true), galleryController.createGallery)
// router.get('/gallery', galleryController.getGalleries)
// router.get('/gallery/:id',galleryController.getGalleryById)
// router.put('/gallery/:id',galleryController.editGallery)
// router.delete('/gallery/:id',galleryController.deleteGallery)

router.get('/',galleryController.getGallery)

// router.get('/gallery',galleryController)
// router.get('/portfolio',galleryController.getAllPortfolios)
// router.get('/portfolio/:id',galleryController.getPortfolioById)

export default router
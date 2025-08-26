
import Gallery from "../../models/GalleryModel.js";


const galleryController = {
  // Get all galleries
  getGallery: async (req, res) => {
    try {
      const galleries = await Gallery.find().sort({ createdAt: -1 }); // latest first
      res.status(200).json({ success: true, data: galleries });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default galleryController;

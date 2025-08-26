import Gallery from "../../models/GalleryModel.js";

const galleryController = {
  // createGallery: async (req, res) => {
  //   try {
  //     const { title, description, tags, type } = req.body;

  //     const images = req.files?.images?.map((file) => file.filename) || [];

  //     const newGallery = new Gallery({
  //       title: title || "",
  //       description: description || "",
  //       images,
  //       tags: tags || [],
  //       type,
  //     });

  //     await newGallery.save();

  //     return res
  //       .status(201)
  //       .json({ message: "Gallery created successfully", newGallery });
  //   } catch (error) {
  //     return res
  //       .status(500)
  //       .json({ message: "Internal server error", error: error.message });
  //   }
  // },

  createGallery: async (req, res) => {
    try {
      const { title, description, tags, type } = req.body;
      const images = req.files?.images?.map((file) => file.filename) || [];

      const newGallery = new Gallery({
        title,
        description,
        images,
        tags,
        type,
      });
      await newGallery.save();

      res.status(201).json({
        message: "Gallery created successfully",
        gallery: newGallery,
      });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },
  // getAllGalleries: async (req, res) => {
  //   try {
  //     const galleries = await Gallery.find({ type: "gallery" });
  //     return res
  //       .status(200)
  //       .json({ message: "All galleries retrieved", galleries });
  //   } catch (error) {
  //     return res.status(500).json({ message: "Internal server error", error });
  //   }
  // },

  // READ all types or filter by type
  getGalleriesbyType: async (req, res) => {
    try {
      const { type } = req.query;

      // If no type is provided, return all
      // Otherwise, filter by the provided type
      const query = type && type.toLowerCase() !== "all" ? { type } : {};

      const galleries = await Gallery.find(query).sort({ createdAt: -1 });

      res.status(200).json(galleries);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },

  // READ single gallery by ID
  getGalleryById: async (req, res) => {
    try {
      const gallery = await Gallery.findById(req.params.id);
      if (!gallery)
        return res.status(404).json({ message: "Gallery not found" });
      res.status(200).json(gallery);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },

  // UPDATE gallery
  editGallery: async (req, res) => {
    console.log("Im inside edit gallery");
    try {
      const { title, description, tags, type } = req.body;

      console.log("reqbody", req.body);
      // const images = req.files?.map((file) => file.filename);
      const images = req.files?.images?.map((file) => file.filename) || [];

      const updatedGallery = await Gallery.findByIdAndUpdate(
        req.params.id,
        {
          ...(title && { title }),
          ...(description && { description }),
          ...(tags && { tags }),
          ...(type && { type }),
          ...(images?.length ? { images } : {}),
        },
        { new: true, runValidators: true }
      );

      if (!updatedGallery)
        return res.status(404).json({ message: "Gallery not found" });
      res.status(200).json({
        message: "Gallery updated successfully",
        gallery: updatedGallery,
      });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },

  // DELETE gallery
  deleteGallery: async (req, res) => {
    try {
      const deletedGallery = await Gallery.findByIdAndDelete(req.params.id);
      if (!deletedGallery)
        return res.status(404).json({ message: "Gallery not found" });
      res.status(200).json({ message: "Gallery deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },

  // getAllPortfolios: async (req, res) => {
  //   try {
  //     const portfolios = await Gallery.find({ type: "portfolio" });
  //     return res
  //       .status(200)
  //       .json({ message: "All portfolios retrieved", portfolios });
  //   } catch (error) {
  //     return res.status(500).json({ message: "Internal server error", error });
  //   }
  // },
  // getPortfolioById: async (req, res) => {
  //   const { id } = req.params;
  //   try {
  //     const portfolio = await Gallery.findById(id);
  //     if (!portfolio) {
  //       return res.status(404).json({ message: "Portfolio not found" });
  //     } else {
  //       return res.status(200).json({ message: "Portfolio found", portfolio });
  //     }
  //   } catch (error) {
  //     return res.status(500).json({ message: "Internal server error", error });
  //   }
  // }
};

export default galleryController;

import Review from "../models/ReviewModel.js";

const reviewController = {
  createReview: async (req, res) => {
    const { productId } = req.params;
    const userId = req.user;
    const { rating, comment } = req.body;
    try {
      if (rating >= 1 && rating <= 5) {
        const newReview = new Review({
          userId: userId,
          productId: productId,
          rating,
          comment,
        });
        await newReview.save();
        return res
          .status(201)
          .json({ message: "Review created successfully", newReview });
      } else {
        return res
          .status(400)
          .json({ message: "Invalid rating. Rating must be between 1 and 5" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
  getReviewsPerProduct: async (req, res) => {
    const { productId } = req.params;
    try {
      const reviews = await Review.find({ productId }).populate("productId");
      if (reviews.length === 0) {
        return res.status(404).json({ message: "No reviews found" });
      } else {
        return res.status(200).json({ message: "Reviews found", reviews });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
};

export default reviewController;

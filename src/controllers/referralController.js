import Refferral from "../models/ReferralModel.js";

const refferalController = {
  getMyRefferrals: async (req, res) => {
    const userId = req.user;
    try {
      const refferrals = await Refferral.find({ userId });
      if (refferrals.length > 0) {
        res.status(200).json({ message: "Refferrals found", refferrals });
      } else {
        res.status(404).json({ message: "No refferrals found" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  },
};

export default refferalController;

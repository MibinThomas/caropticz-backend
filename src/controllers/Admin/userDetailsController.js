import Users from "../../models/User.js";

const userController = {
  getAllUsers: async (req, res) => {
    console.log("Trying to get the users");
    try {
      console.log("Inside try");
      const usersList = await Users.find({ role: "user" }).sort({
        createdAt: -1,
      });

      console.log("User list:", usersList);

      if (!usersList.length) {
        return res.status(404).json({ message: "No users found" });
      }

      res.status(200).json({
        message: "Users retrieved successfully",
        usersList,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  blockUser: async (req, res) => {
    
    console.log("Inside blockUser");
    try {
      const { id } = req.params;

      const user = await Users.findById(id);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.isBlocked = !user.isBlocked;
      await user.save();

      res.status(200).json({
        message: `User ${
          user.isBlocked ? "blocked" : "unblocked"
        } successfully`,
        user,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },
};

export default userController;

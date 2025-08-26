// import ServiceType from "";
import ServiceType from "../../models/ServiceTypeModel.js";

const serviceTypeController = {
  // Add a new service type
  addServiceType: async (req, res) => {
    try {
      const { name, description } = req.body;
      if (!name)
        return res.status(400).json({ message: "Type name is required" });

      const existingType = await ServiceType.findOne({ name });
      if (existingType)
        return res.status(400).json({ message: "Type already exists" });

      const newType = await ServiceType.create({ name, description });
      res.status(201).json({ message: "Service type created", type: newType });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Edit a service type
  editServiceType: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      if (!name)
        return res.status(400).json({ message: "Type name is required" });

      const updatedType = await ServiceType.findByIdAndUpdate(
        id,
        { name, description },
        { new: true, runValidators: true }
      );

      if (!updatedType)
        return res.status(404).json({ message: "Type not found" });

      res
        .status(200)
        .json({ message: "Service type updated", type: updatedType });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Block/Unblock a service type
  toggleServiceTypeAvailability: async (req, res) => {
    try {
      const { id } = req.params;

      const type = await ServiceType.findById(id);
      if (!type) return res.status(404).json({ message: "Type not found" });

      //   const relatedServices = await Service.find({ type: id });
      //   if (relatedServices.length > 0) {
      //     return res.status(400).json({
      //       message: "Cannot block type: services are associated with this type",
      //     });
      //   }

      type.isBlocked = !type.isBlocked;
      await type.save();

      res.status(200).json({
        message: `Service type ${type.isBlocked ? "blocked" : "unblocked"}`,
        type,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Get all service types
  getAllServiceTypes: async (req, res) => {
    try {
      const types = await ServiceType.find();
      res.status(200).json({ types });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

export default serviceTypeController;

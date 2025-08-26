import Service from "../../models/ServiceModel.js";
import ServiceType from "../../models/ServiceTypeModel.js";

const serviceAdminController = {
  createService: async (req, res) => {
    try {
      const { title, description, typeId, durationInMins, price, tags } =
        req.body;

      // Ensure the type existsg
      const serviceType = await ServiceType.findById(typeId);

      if (!serviceType) {
        return res.status(400).json({ message: "Invalid service type" });
      }

      // Check if the service type is blocked
      if (serviceType.isBlocked) {
        return res
          .status(403)
          .json({
            message: "Cannot create service under a blocked service type",
          });
      }

      // Check if service with same title already exists
      const existingService = await Service.findOne({ title });
      if (existingService) {
        return res.status(400).json({ message: "Service already exists" });
      }

      // Map uploaded images
      // const images = req.files ? req.files.map((file) => file.filename) : [];
      const images =
        req.files && req.files.images
          ? req.files.images.map((file) => file.filename)
          : [];
      // Create new service
      const newService = new Service({
        title,
        description,
        type: typeId,
        durationInMins,
        price,
        tags: tags ? tags.split(",") : [],
        images,
      });

      await newService.save();
      return res
        .status(201)
        .json({ message: "Service created successfully", service: newService });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  getAllServicesAdmin: async (req, res) => {
    try {
      const services = await Service.find()
        .populate("type", "name") // populate category name
        .sort({ createdAt: -1 }); // optional: latest first

      if (services.length === 0) {
        return res.status(404).json({ message: "No services found" });
      }

      return res.status(200).json({
        message: "All services retrieved (admin view)",
        services,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  editServices: async (req, res) => {
    try {
      const { serviceId } = req.params;
      const { title, description, typeId, durationInMins, price, tags } =
        req.body;

      // Find existing service
      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      // Validate typeId if provided
      if (typeId) {
        const serviceType = await ServiceType.findById(typeId);
        if (!serviceType) {
          return res.status(400).json({ message: "Invalid service type" });
        }
        service.type = typeId;
      }

      // Update fields if provided
      if (title) service.title = title;
      if (description) service.description = description;
      if (durationInMins) service.durationInMins = durationInMins;
      if (price) service.price = price;
      if (tags) service.tags = tags.split(",");

      // Handle new images if uploaded
      if (req.files && req.files.images) {
        const newImages = req.files.images.map((file) => file.filename);
        service.images = [...service.images, ...newImages]; // append new images
      }

      await service.save();
      return res
        .status(200)
        .json({ message: "Service updated successfully", service });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  toggleServiceAvailablity: async (req, res) => {
    try {
      const { serviceId } = req.params;

      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      service.isAvailable = !service.isAvailable; // toggle
      await service.save();

      return res.status(200).json({
        message: `Service is now ${
          service.isAvailable ? "available" : "blocked"
        }`,
        service,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
};

export default serviceAdminController;

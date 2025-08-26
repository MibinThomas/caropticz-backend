import Service from "../models/ServiceModel.js";
import ServiceType from "../models/ServiceTypeModel.js";

const serviceController = {
  // createService: async (req, res) => {
  //   const {title, description, typeId, durationInMins, price, tags} = req.body;
  //   const images = req.files?.images?.map((file) => file.filename) || [];
  //    try {
  //       const existingService = await Service.findOne({ title });
  //       if (existingService) {
  //         return res.status(400).json({ message: "Service already exists" });
  //       }else{
  //         const newService = new Service({
  //           title,
  //           description,
  //           type,
  //           durationInMins,
  //           price,
  //           images,
  //           tags
  //         })
  //         await newService.save();
  //         return res.status(201).json({ message: "Service created successfully", newService });
  //       }
  //    } catch (error) {
  //       return res.status(500).json({ message: "Internal server error", error });
  //    }
  // },

  getAllServices: async (req, res) => {
    try {
      const services = await Service.find({ isAvailable: true });
      if (services.length > 0) {
        return res
          .status(200)
          .json({ message: "All services retrieved", services });
      } else {
        return res.status(404).json({ message: "No services found" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  getServiceById: async (req, res) => {
    const { id } = req.params;
    try {
      const service = await Service.findById({
        _id: id,
        isAvailable: true,
      }).populate("type", "name"); // populate only the 'name' field from ServiceType
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      } else {
        return res.status(200).json({ message: "Service found", service });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  // getServiceByCategoryName: async (req, res) => {
  //   const { name } = req.params;
  //   try {
  //     const service = await Service.find({ type: name });
  //     if (!service) {
  //       return res.status(404).json({ message: "Service not found" });
  //     } else {
  //       return res.status(200).json({ message: "Service found", service });
  //     }
  //   } catch (error) {
  //     return res.status(500).json({ message: "Internal server error", error });
  //   }
  // },

  getServiceByCategoryName: async (req, res) => {
    const { name } = req.params;

    try {
      // Find the service type first
      const serviceType = await ServiceType.findOne({ name: name });
      if (!serviceType) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Find all services of this type that are available
      const services = await Service.find({
        type: serviceType._id,
        isAvailable: true,
      }).populate("type", "name"); // populate category name

      if (services.length === 0) {
        return res
          .status(404)
          .json({ message: "No available services in this category" });
      }

      return res.status(200).json({ message: "Services found", services });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  },
};

export default serviceController;

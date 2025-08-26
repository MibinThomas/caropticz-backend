import mongoose from "mongoose";

// const serviceTypeSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
// });

const serviceTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true }, 
  isBlocked: { type: Boolean, default: false },
});

const ServiceType = mongoose.model("ServiceType", serviceTypeSchema);

export default ServiceType;

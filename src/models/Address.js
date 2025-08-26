import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    buildingName: String,
    street: String,
    area: String,
    city: { type: String, default: "Dubai" },
    emirate: {
      type: String,
      enum: [
        "Abu Dhabi",
        "Dubai",
        "Sharjah",
        "Ajman",
        "Fujairah",
        "Ras Al Khaimah",
        "Umm Al Quwain"
      ],
    },
    poBox: String,
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);
export default Address;

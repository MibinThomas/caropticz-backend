import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim : true,
    },
    description: {
      type: String,
      trim : true
    },
    images: {
      type: [String],
      default : []
    },
    tags: {
      type: [String],
      default :[],
      trim :true,
    },
    type: {
      type: String,
      trim : true
    },
  },
  { timestamps: true }
);


const Gallery = mongoose.model("Gallery", gallerySchema);
export default Gallery;

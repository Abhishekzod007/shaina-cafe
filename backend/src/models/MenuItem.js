import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mainCategory: { type: String, required: true, enum: ["Drinks", "Food"] },
    subCategory: { type: String, required: true },

    variantCategory:[
      {
        name: String,   // small, medium, large
        price: Number   // 120, 150, 180
      }
    ],

    
    description: { type: String },

    tags: [String],

    image: { type: String },           // Cloudinary URL
    imagePublicId: { type: String },    // Needed for delete

    addons: [
  {
    name: { type: String },
    price: { type: Number }
  }
],

  },
  { timestamps: true }
);

export default mongoose.model("MenuItem", menuItemSchema);

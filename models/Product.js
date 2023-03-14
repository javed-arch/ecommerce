import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product Name is required"],
    },
    slug: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
    },
    user_id: {
      type: mongoose.ObjectId,
      ref: "User",
    },
    category_id: {
      type: mongoose.ObjectId,
      ref: "Category",
    },
    description: {
      type: {},
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Product name must be at least 3 characters long"],
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters long"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: [
        "Electronics",
        "Clothing",
        "Books",
        "Home & Kitchen",
        "Sports",
        "Toys",
        "Beauty",
        "Automotive",
        "Food & Beverages",
        "Health",
        "Other",
      ],
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    imageUrl: {
      type: String,
      trim: true,
      match: [
        /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
        "Please provide a valid image URL",
      ],
    },
    brand: {
      type: String,
      trim: true,
      maxlength: [100, "Brand name cannot exceed 100 characters"],
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: [0, "Rating cannot be less than 0"],
        max: [5, "Rating cannot be more than 5"],
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster searches
productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ isActive: 1 });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

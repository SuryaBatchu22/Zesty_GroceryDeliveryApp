import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: Array, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    inStock: { type: Boolean, default: true },

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

productSchema.virtual("review", {
    ref: "review",            // The name of the Review model
    localField: "_id",        // Field in Product model
    foreignField: "productId" // Field in Review model
});

const Product = mongoose.models.product || mongoose.model('product', productSchema)

export default Product;
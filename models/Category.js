import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String }, // e.g., bootstrap icon name
  image: { type: String },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null } 
}, { timestamps: true, strict: false });

// Force clear model to handle Next.js hot reloading schema changes
if (mongoose.models.Category) {
  delete mongoose.models.Category;
}

export default mongoose.model('Category', categorySchema);

import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  category: { type: String }, // Keep for legacy compatibility during migration
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  thumbnail: { type: String, default: '' },
  level: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'], 
    default: 'All Levels' 
  },
  language: { type: String, default: 'English' },
  isPublished: { type: Boolean, default: false },
  moderationStatus: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'approved' 
  }
}, { timestamps: true });

export default mongoose.models.Course || mongoose.model('Course', courseSchema);

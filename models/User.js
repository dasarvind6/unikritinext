import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, sparse: true, unique: true },
  email: { type: String, sparse: true, unique: true },
  password: { type: String, select: false },
  role: { 
    type: String, 
    enum: ['student', 'instructor', 'admin'], 
    default: 'student' 
  },
  bio: { type: String, default: '' },
  avatar: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['active', 'suspended', 'pending_approval'], 
    default: 'active' 
  }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);

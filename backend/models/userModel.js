import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email is already registered"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  profilePhoto: {
    type: String,
    default: "",
  },
  circle: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;
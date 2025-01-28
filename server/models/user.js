const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ['company', 'seeker'],
    required: true,
  },
  fullName: {
    type: String,
  },
  displayName: {
    type: String,
  },
  qualifications: {
    type: String,
  },
  certifications: {
    type: String,
  },
  description: {
    type: String,
  },
  perMinuteRate: {
    amount: {
      type: Number,
      required: true,
      default: 1 ,// Default rate
    },
    currency: {
      type: String,
      default: 'USD',
    }
  },
  profilePhotoUrl:{
    type: String,
  },
  timeZone: {
    type: [String],
  },
  availableDays: {
    type: [String] ,// Array of days
  },
  availableHoursstart: {
    type: String ,// Start and end hours (e.g. 9AM-5PM)
  },
  availableHoursend: {
    type: String ,// Start and end hours (e.g. 9AM-5PM)
  },
  languages: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  profilePhoto: {
    type: String, // URL for the profile photo
  },
  socialLinks: {
    facebook: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
  },
  birthday: {
    type: Date,  // Store the birthday as a Date object
  },
  interest:{
    type: String,
  },
  profileCompleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
}, { timestamps: true });


const User = mongoose.model('User', userSchema);

module.exports = User;

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["superadmin", "admin"], default: "admin" },
    firstLogin: { type: Boolean, default: true }, // First login tracking
    lastLogout: { type: Date, default: null }, // Last logout time
    resetToken: { type: String, default: null }, // For password reset
    resetTokenExpiry: { type: Date, default: null },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

// **Middleware to Hash Password Before Saving**
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// **Method to Compare Passwords**
AdminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Admin", AdminSchema);

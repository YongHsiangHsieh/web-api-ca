import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

/**
 * User Schema for MongoDB
 * 
 * Stores user authentication data and their movie lists.
 * 
 * Fields:
 * - username: Unique identifier for the user (3-20 chars, alphanumeric + underscore)
 * - password: Hashed password (bcrypt)
 * - favorites: Array of TMDB movie IDs the user has favorited
 * - mustWatch: Array of TMDB movie IDs the user wants to watch
 * - createdAt/updatedAt: Auto-managed timestamps
 */
const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  
  // Movie lists - store TMDB movie IDs as numbers
  // Default to empty arrays so new users start with no movies
  favorites: { type: [Number], default: [] },
  mustWatch: { type: [Number], default: [] },
}, {
  timestamps: true,  // Adds createdAt and updatedAt automatically
});

UserSchema.methods.comparePassword = async function (passw) {
  return await bcrypt.compare(passw, this.password);
};
UserSchema.statics.findByUserName = function (username) {
  return this.findOne({ username: username });
};
UserSchema.pre("save", async function () {
  const saltRounds = 10; // You can adjust the number of salt rounds
  if (this.isModified("password") || this.isNew) {
    const hash = await bcrypt.hash(this.password, saltRounds);
    this.password = hash;
  }
});
export default mongoose.model("User", UserSchema);

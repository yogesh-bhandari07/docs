import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    colorTheme: { type: String, required: true },
    url: { type: String, required: true },
    logo: { type: String, default: "" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// ✅ Virtual field to generate full logo URL
projectSchema.virtual("logoUrl").get(function () {
  if (!this.logo) return ""; // If no logo is uploaded, return empty string
  let logUrl = this.logo.replace("\\", "/");
  return `${process.env.BASE_URL}/${logUrl}`; // Adjust based on upload path
});

const Project = mongoose.model("Project", projectSchema);
export default Project;

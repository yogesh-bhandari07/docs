import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
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

projectSchema.index({ name: "text", description: "text" });

//auto ganerate unique slug using name
projectSchema.pre("save", async function (next) {
  this.status = true;

  this.slug = this.name.toLowerCase().replace(/\s+/g, "-");

  next();
});

// ✅ Virtual field to generate full logo URL
projectSchema.virtual("logoUrl").get(function () {
  if (!this.logo) return ""; // If no logo is uploaded, return empty string
  let logUrl = this.logo.replace("\\", "/");
  return `${process.env.BASE_URL}/${logUrl}`; // Adjust based on upload path
});

const Project = mongoose.model("Project", projectSchema);
export default Project;

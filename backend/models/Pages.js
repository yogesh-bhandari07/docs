import mongoose from "mongoose";

const Pages = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: false },
    status: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

Pages.index({ name: "text", description: "text" });

Pages.pre("save", async function (next) {
  this.status = true;
  this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  next();
});

const Page = mongoose.model("Page", Pages);
export default Page;

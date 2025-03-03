import mongoose from "mongoose";

const PageAPIs = new mongoose.Schema(
  {
    url: { type: String, required: true },
    method: {
      type: String,
      required: true,
      enum: ["GET", "POST", "PUT", "DELETE"],
    },
    headers: { type: Array, required: false },
    params: { type: Array, required: false },
    body: { type: Array, required: false },
    sample: { type: Array, required: false },
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
    pageID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Page",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const PageAPI = mongoose.model("PageAPI", PageAPIs);
export default PageAPI;

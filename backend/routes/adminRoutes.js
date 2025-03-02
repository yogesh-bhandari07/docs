import express from "express";
import {
  loginAdmin,
  logoutAdmin,
  registerAdmin,
  addProject,
  getProjects,
  deleteProject,
} from "../middleware/controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";
const router = express.Router();
const storage = multer.diskStorage({
  destination: "uploads/",
  /**
   * Generates a unique filename for the uploaded file by prefixing the current timestamp
   * to the original filename.
   *
   * @param {Object} req - The request object.
   * @param {Object} file - The file object containing details of the uploaded file.
   * @param {Function} cb - Callback function to return the generated filename.
   */

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", authMiddleware, logoutAdmin);
router.post("/add-project", authMiddleware, upload.single("logo"), addProject);
router.get("/projects", authMiddleware, getProjects);
router.delete("/projects/:id", authMiddleware, deleteProject);
export default router;

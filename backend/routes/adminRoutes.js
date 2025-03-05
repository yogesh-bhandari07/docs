import express from "express";
import {
  loginAdmin,
  logoutAdmin,
  registerAdmin,
  addProject,
  getProjects,
  deleteProject,
  getProject,
} from "../middleware/controllers/adminController.js";
import {
  getParentPages,
  addPage,
  getPages,
  getApiDetails,
  addUpdateApiDetails,
  getPageData,
  updatePageContent,
} from "../middleware/controllers/pagesController.js";
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
router.get("/get-project/:slug", authMiddleware, getProject);
router.delete("/projects/:id", authMiddleware, deleteProject);
router.get("/get-parent-pages/:projectID", authMiddleware, getParentPages);
router.get("/get-pages/:projectID", authMiddleware, getPages);
router.get("/get-page/:pageID", authMiddleware, getPageData);
router.post("/page-api", authMiddleware, addUpdateApiDetails);

router.post("/add-page", authMiddleware, addPage);

router.put("/update-page", authMiddleware, updatePageContent);
export default router;

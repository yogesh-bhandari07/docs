import express from "express";

import {
  getProjectData,
  getPages,
  getPageData,
} from "../middleware/controllers/pagesController.js";

const router = express.Router();

router.get("/get-project/:slug", getProjectData);
router.get("/get-pages/:projectID", getPages);
router.get("/get-page/:pageID", getPageData);
export default router;

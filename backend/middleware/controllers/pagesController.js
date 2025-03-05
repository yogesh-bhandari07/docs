import Page from "../../models/Pages.js";
import PageAPI from "../../models/PageAPI.js";

export const getPages = async (req, res) => {
  try {
    const projectID = req.params.projectID;
    const pages = await Page.find({ projectID }).lean();

    const pageMap = new Map();
    pages.forEach((page) => pageMap.set(page._id.toString(), page));

    const nestedPages = [];
    pages.forEach((page) => {
      if (page.parentID) {
        const parent = pageMap.get(page.parentID.toString());
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(page);
        }
      } else {
        nestedPages.push(page);
      }
    });

    res.json(nestedPages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getApiDetails = async (req, res) => {
  try {
    const apiDetails = await PageAPI.find({ pageID: req.params.pageID });
    res.json(apiDetails);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const addPage = async (req, res) => {
  try {
    const { name, title, parentID, projectID } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const content = "";
    console.log(name, title, slug, parentID, projectID);
    const page = new Page({
      name,
      title,
      slug,
      parentID,
      projectID,
      createdBy: req.admin.id,
      content,
      status: true,
    });

    await page.save();
    res.status(201).json({ message: "Page added successfully!", page });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addUpdateApiDetails = async (req, res) => {
  try {
    const apiDetails = await PageAPI.findOne({ pageID: req.body.pageID });
    if (apiDetails) {
      apiDetails.url = req.body.url;
      apiDetails.method = req.body.method;
      apiDetails.headers = req.body.headers;
      apiDetails.params = req.body.params;
      apiDetails.body = req.body.body;
      apiDetails.sample = req.body.sample;
      await apiDetails.save();
      return res
        .status(200)
        .json({ message: "API details updated successfully!", apiDetails });
    } else {
      const { url, method, headers, params, body, sample } = req.body;
      const pageID = req.body.pageID;
      const projectID = req.body.projectID;
      const api = new PageAPI({
        url,
        method,
        headers,
        params,
        body,
        sample,
        pageID,
        projectID,
        createdBy: req.admin.id,
      });
      await api.save();
      res.status(201).json({ message: "API details added successfully!", api });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getParentPages = async (req, res) => {
  try {
    const pages = await Page.find({
      projectID: req.params.projectID,
      parentID: null,
    });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPageData = async (req, res) => {
  try {
    const page = await Page.findById(req.params.pageID).lean();
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    const pageAPIs = await PageAPI.find({ pageID: page._id }).lean();

    res.json({ page, apis: pageAPIs });
  } catch (error) {
    console.error("Error fetching page data:", error);
    res.status(500).json({ error: error.message });
  }
};

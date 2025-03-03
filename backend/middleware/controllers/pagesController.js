import Page from "../../models/Pages.js";

export const getPages = async (req, res) => {
  try {
    const page = await Page.find({ projectID: req.params.projectID });
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
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
    const { name } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const page = new Page({ name, slug, projectID: req.params.projectID });

    await page.save();
    res.status(201).json({ message: "Page added successfully!", page });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addUpdateApiDetails = async (req, res) => {
  try {
    const apiDetails = await PageAPI.findOne({ pageID: req.params.pageID });
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
      const pageID = req.params.pageID;
      const projectID = req.params.projectID;
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

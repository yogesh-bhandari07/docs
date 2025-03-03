import Admin from "../../models/admin.js";
import Project from "../../models/Project.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    await Admin.findByIdAndUpdate(admin._id, { lastLogin: new Date() });

    res.json({ token, admin });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const logoutAdmin = async (req, res) => {
  try {
    await Admin.findByIdAndUpdate(req.admin.id, { lastLogout: new Date() });
    res.json({ message: "Admin Logged Out Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin)
      return res.status(400).json({ message: "Admin already exists" });

    const newAdmin = new Admin({ name, email, password });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error registering admin", error });
  }
};

export const addProject = async (req, res) => {
  try {
    const { name, colorTheme, url } = req.body;
    const logo = req.file ? req.file.path : ""; // If image uploaded
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const status = true;
    const project = new Project({
      name,
      colorTheme,
      url,
      logo,
      slug,
      status,
      createdBy: req.admin.id, // Store admin ID
    });

    await project.save();
    res.status(201).json({ message: "Project added successfully!", project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.admin.id });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    await project.remove();
    res.json({ message: "Project deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createError = require("http-errors");
const Project = require("../models/Project");

function mapDoc(doc) {
  return {
    title: doc.title,
    completion: doc.completion,
    description: doc.description,
    id: doc._id,
  };
}

// POST api/projects
async function add(req, res, next) {
  try {
    const created = await Project.create(req.body);
    return res.status(201).json({
      success: true,
      message: "Project added successfully.",
      data: mapDoc(created),
    });
  } catch (err) {
    return next(err);
  }
}

// GET api/projects
async function getAll(req, res, next) {
  try {
    const list = await Project.find();
    return res.json({
      success: true,
      message: "Projects list retrieved successfully.",
      data: list.map(mapDoc),
    });
  } catch (err) {
    return next(err);
  }
}

// GET api/projects/:id
async function getById(req, res, next) {
  try {
    const doc = await Project.findById(req.params.id);
    if (!doc) return next(createError(404, "Project not found"));

    return res.json({
      success: true,
      message: "Project retrieved successfully.",
      data: mapDoc(doc),
    });
  } catch (err) {
    return next(err);
  }
}

// PUT api/projects/:id
async function update(req, res, next) {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) return next(createError(404, "Project not found"));

    return res.json({
      success: true,
      message: "Project updated successfully.",
    });
  } catch (err) {
    return next(err);
  }
}

// DELETE api/projects/:id
async function remove(req, res, next) {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return next(createError(404, "Project not found"));

    return res.json({
      success: true,
      message: "Project removed successfully.",
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { add, getAll, getById, update, remove };
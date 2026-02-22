const createError = require("http-errors");
const Service = require("../models/Service");

function mapDoc(doc) {
  return {
    title: doc.title,
    description: doc.description,
    id: doc._id
  };
}

// POST api/services
async function add(req, res, next) {
  try {
    const created = await Service.create(req.body);
    return res.status(201).json({
      success: true,
      message: "Service added successfully.",
      data: mapDoc(created)
    });
  } catch (err) {
    return next(err);
  }
}

// GET api/services
async function getAll(req, res, next) {
  try {
    const list = await Service.find();
    return res.json({
      success: true,
      message: "Services list retrieved successfully.",
      data: list.map(mapDoc)
    });
  } catch (err) {
    return next(err);
  }
}

// GET api/services/:id
async function getById(req, res, next) {
  try {
    const doc = await Service.findById(req.params.id);
    if (!doc) return next(createError(404, "Service not found"));
    return res.json({
      success: true,
      message: "Service retrieved successfully.",
      data: mapDoc(doc)
    });
  } catch (err) {
    return next(err);
  }
}

// PUT api/services/:id
async function update(req, res, next) {
  try {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return next(createError(404, "Service not found"));
    return res.json({
      success: true,
      message: "Service updated successfully."
    });
  } catch (err) {
    return next(err);
  }
}

// DELETE api/services/:id
async function remove(req, res, next) {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) return next(createError(404, "Service not found"));
    return res.json({
      success: true,
      message: "Service removed successfully."
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { add, getAll, getById, update, remove };
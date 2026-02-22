const createError = require("http-errors");
const Reference = require("../models/Reference");

function mapDoc(doc) {
  return {
    firstname: doc.firstname,
    lastname: doc.lastname,
    email: doc.email,
    position: doc.position,
    company: doc.company,
    id: doc._id,
  };
}

// POST api/references
async function add(req, res, next) {
  try {
    const created = await Reference.create(req.body);
    return res.status(201).json({
      success: true,
      message: "Reference added successfully.",
      data: mapDoc(created),
    });
  } catch (err) {
    return next(err);
  }
}

// GET api/references
async function getAll(req, res, next) {
  try {
    const list = await Reference.find();
    return res.json({
      success: true,
      message: "References list retrieved successfully.",
      data: list.map(mapDoc),
    });
  } catch (err) {
    return next(err);
  }
}

// GET api/references/:id
async function getById(req, res, next) {
  try {
    const doc = await Reference.findById(req.params.id);
    if (!doc) return next(createError(404, "Reference not found"));

    return res.json({
      success: true,
      message: "Reference retrieved successfully.",
      data: mapDoc(doc),
    });
  } catch (err) {
    return next(err);
  }
}

// PUT api/references/:id
async function update(req, res, next) {
  try {
    const updated = await Reference.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) return next(createError(404, "Reference not found"));

    return res.json({
      success: true,
      message: "Reference updated successfully.",
    });
  } catch (err) {
    return next(err);
  }
}

// DELETE api/references/:id
async function remove(req, res, next) {
  try {
    const deleted = await Reference.findByIdAndDelete(req.params.id);
    if (!deleted) return next(createError(404, "Reference not found"));

    return res.json({
      success: true,
      message: "Reference removed successfully.",
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { add, getAll, getById, update, remove };
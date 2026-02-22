const createError = require("http-errors");
const User = require("../models/User");

function mapDoc(doc) {
  return {
    firstname: doc.firstname,
    lastname: doc.lastname,
    email: doc.email,
    password: doc.password,
    created: doc.created,
    updated: doc.updated,
    id: doc._id,
  };
}

// POST api/users
async function add(req, res, next) {
  try {
    // If your model doesn't set defaults, this guarantees dates exist
    if (!req.body.created) req.body.created = Date.now();
    if (!req.body.updated) req.body.updated = Date.now();

    const created = await User.create(req.body);
    return res.status(201).json({
      success: true,
      message: "User added successfully.",
      data: mapDoc(created),
    });
  } catch (err) {
    return next(err);
  }
}

// GET api/users
async function getAll(req, res, next) {
  try {
    const list = await User.find();
    return res.json({
      success: true,
      message: "Users list retrieved successfully.",
      data: list.map(mapDoc),
    });
  } catch (err) {
    return next(err);
  }
}

// GET api/users/:id
async function getById(req, res, next) {
  try {
    const doc = await User.findById(req.params.id);
    if (!doc) return next(createError(404, "User not found"));

    return res.json({
      success: true,
      message: "User retrieved successfully.",
      data: mapDoc(doc),
    });
  } catch (err) {
    return next(err);
  }
}

// PUT api/users/:id
async function update(req, res, next) {
  try {
    // REQUIRED: on update, set updated date
    req.body.updated = Date.now();

    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) return next(createError(404, "User not found"));

    return res.json({
      success: true,
      message: "User updated successfully.",
    });
  } catch (err) {
    return next(err);
  }
}

// DELETE api/users/:id
async function remove(req, res, next) {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return next(createError(404, "User not found"));

    return res.json({
      success: true,
      message: "User removed successfully.",
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { add, getAll, getById, update, remove };
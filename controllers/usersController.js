const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

function mapDoc(doc) {
  return {
    firstname: doc.firstname,
    lastname: doc.lastname,
    email: doc.email,
    created: doc.created,
    updated: doc.updated,
    id: doc._id,
  };
}

// POST api/users
async function add(req, res, next) {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
      return next(createError(400, "Firstname, lastname, email, and password are required."));
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });

    if (existing) {
      return next(createError(409, "A user with this email already exists."));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // If your model doesn't set defaults, this guarantees dates exist
    const payload = {
      firstname,
      lastname,
      email: normalizedEmail,
      password: hashedPassword,
      created: req.body.created || Date.now(),
      updated: req.body.updated || Date.now(),
    };

    const created = await User.create(payload);
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
    const payload = { ...req.body, updated: Date.now() };

    if (payload.email) {
      payload.email = String(payload.email).toLowerCase().trim();
    }

    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }

    const updated = await User.findByIdAndUpdate(req.params.id, payload, {
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
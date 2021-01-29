'use strict';

// const Users = require('../../models/users');

const list = async (req, res, next) => {
  try {
    const doc = await Users.find();

    return res.status(200).json(doc);
  } catch (err) {
    next(err);
  }
};

const find = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await Users.findOne({ _id: id });

    return res.status(200).json(doc);
  } catch (err) {
    next(err);
  }
};

const insert = async (req, res, next) => {
  try {
    const doc = await Users.create(req.body);

    return res.status(200).json(doc);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await Users.findOneAndUpdate({ _id: id }, { $set: req.body }, { new: true });

    return res.status(200).json(doc);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await Users.findOneAndRemove({ _id: id });

    return res.status(200).json(doc);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  list,
  find,
  insert,
  update,
  remove,
};

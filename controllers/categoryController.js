import Category from "../models/Category.js";
import slugify from "slugify";

export const createCategory = async (req, res, next) => {
  try {
    const isExist = await Category.findOne({ name: req.body.name });
    if (isExist)
      return res
        .status(409)
        .json({ message: "Category Already Exist", success: false, data: [] });
    const savedCategory = await Category.create({
      ...req.body,
      slug: slugify(req.body.name),
    });
    return res.status(201).json({
      message: "Successfully Created",
      data: savedCategory,
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    if (categories.length > 0)
      return res.status(200).json({
        success: true,
        message: "data fetched Successfully",
        data: categories,
      });
    return res
      .status(404)
      .json({ message: "No Data Found", success: false, data: [] });
  } catch (err) {
    next(err);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category)
      return res.status(200).json({
        success: true,
        message: "data fetched Successfully",
        data: category,
      });
    return res
      .status(404)
      .json({ message: "no Data Found", success: false, data: [] });
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const updateCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { ...req.body, slug: slugify(req.body.name) },
      { new: true }
    );
    return res
      .status(200)
      .json({
        success: true,
        message: "Category Updated Successfully",
        data: updateCategory,
      });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const isExist = await Category.findById(req.params.id);
    if (isExist) {
      await isExist.delete();
      return res.status(200).json({
        success: true,
        message: "Category Deleted Successfully",
        data: [],
      });
    } else {
      return res
        .status(404)
        .json({ message: "No Category Found", success: false, data: [] });
    }
  } catch (err) {
    next(err);
  }
};

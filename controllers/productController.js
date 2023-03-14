import slugify from "slugify";
import Product from "../models/Product.js";
import { s3 } from "../config/aws.js";
import fs from "fs";

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    if (products.length > 0)
      return res.status(200).json({
        success: true,
        message: "data fetched Successfully",
        data: products,
      });
    return res
      .status(404)
      .json({ message: "No Data Found", success: false, data: [] });
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product)
      return res.status(200).json({
        success: true,
        message: "data fetched Successfully",
        data: product,
      });
    return res
      .status(404)
      .json({ message: "no Data Found", success: false, data: [] });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const savedProduct = await Product.create({
      ...req.body,
      user_id: req.user.id,
      slug: slugify(req.body.name),
    });
    const { image } = req.files;
    if (image) {
      const imagePath = image.path;
      const blob = fs.readFileSync(imagePath);
      const uploadedImage = await s3
        .upload({
          Key: image.name,
          Body: blob,
          Bucket: process.env.AWS_S3_BUCKET_NAME,
        })
        .promise();
      savedProduct.image = uploadedImage.Location;
      await savedProduct.save();
    } else {
      return res
        .status(404)
        .json({ message: "Image not Found", success: false, data: [] });
    }
    return res.status(201).json({
      success: true,
      message: "data save Successfully",
      data: savedProduct,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const products = await Product.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(req.body.name) },
      { new: true }
    );
    const { image } = req.files;
    if (image) {
      const imagePath = image.path;
      const blob = fs.readFileSync(imagePath);
      const uploadedImage = await s3
        .upload({
          Key: image.name,
          Body: blob,
          Bucket: process.env.AWS_S3_BUCKET_NAME,
        })
        .promise();
      products.image = uploadedImage.Location;
      await products.save();
    }
    return res.status(201).json({
      success: true,
      message: "Product Updated Successfully",
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.pid);
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const productFiltersController = async (req, res, next) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await Product.find(args);
    res.status(200).send({
      success: true,
      message: "Product fetched Successfully",
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

export const productCountController = async (req, res, next) => {
  try {
    const total = await Product.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      message: "Product fetched Successfully",
      count: total,
    });
  } catch (err) {
    next(err);
  }
};

export const productListController = async (req, res, next) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await Product.find({})
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "Product fetched Successfully",
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

export const searchProductController = async (req, res, next) => {
  try {
    const { keyword } = req.params;
    const results = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });
    res.json(results);
  } catch (err) {
    next(err);
  }
};

export const relatedProductController = async (req, res, next) => {
  try {
    const { pid, cid } = req.params;
    const products = await Product.find({
      category_id: cid,
      _id: { $ne: pid },
    })
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (err) {
    next(err);
  }
};

export const productCategoryController = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    const products = await Product.find({ category_id: category._id }).populate(
      "category"
    );
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (err) {
    next(err);
  }
};

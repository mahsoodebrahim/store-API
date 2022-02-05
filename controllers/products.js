const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({})
    .sort("name -price")
    .select("name price");
  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  const { name, sort, fields } = req.query;

  if (name) {
    req.query.name = { $regex: `${name}`, $options: "i" };
  }

  let results = Product.find(req.query);

  if (sort) {
    results = results.sort(sort.replace(",", " "));
  }

  if (fields) {
    results = results.select(fields.replace(",", " "));
  }

  const products = await results;

  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};

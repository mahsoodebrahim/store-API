const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({ price: { $gt: 25 } })
    .sort("-price")
    .select("name price");

  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  const { name, sort, fields, numericFilters } = req.query;

  if (name) {
    req.query.name = { $regex: `${name}`, $options: "i" };
  }

  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };

    const regex = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regex,
      (match) => `-${operatorMap[match]}-`
    );

    const options = ["price", "rating"];

    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");

      if (options.includes(field)) {
        req.query[field] = { [operator]: Number(value) };
      }
    });
  }

  let results = Product.find(req.query);

  if (sort) {
    results = results.sort(sort.replace(",", " "));
  }

  if (fields) {
    results = results.select(fields.replace(",", " "));
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  results = results.skip(skip).limit(limit);

  const products = await results;

  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};

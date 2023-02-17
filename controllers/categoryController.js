import Category from "../models/category.js";

export async function home(req, res) {
  try {
    const categories = await Category.find({ name: { $ne: "_default" } });
    res.render("categories", { categories });
  } catch (error) {
    console.log("Error: ", error);
    res.render("internalServerError.ejs");
  }
}

export async function addCategory(req, res) {
  try {
    await Category.create({
      name: req.body.name,
    });
    res.redirect("/category");
  } catch (error) {
    console.log("Error: ", error);
    res.render("internalServerError.ejs");
  }
}

export async function deleteCategory(req, res) {
  try {
    await Category.deleteOne({
      _id: req.params.id,
    });
    res.redirect("/category");
  } catch (error) {
    console.log("Error: ", error);
    res.render("internalServerError.ejs");
  }
}

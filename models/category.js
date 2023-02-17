import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    statics: {
      async defaultCategory() {
        /* finds or creates default category for habits*/

        let category = await this.findOne({
          name: "_default",
        });
        if (!category) {
          category = await this.create({
            name: "_default",
          });
        }

        return category;
      },
    },
  }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;

const Category = require('../models/categoryModel');

const categoryController = {
  createCategory: (req, res) => {
    Category.create(req.body, (err, category) => {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json(category);
    });
  },

  getCategories: (req, res) => {
    Category.findAll((err, categories) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json(categories);
    });
  },

  updateCategory : (req,res) =>{
    Category.update(req.params.cid,req.body,(err)=>{
      if(err) return res.status(400).json({ error :err.message});
      res.json({ message:'Category Updated Successfully' })
    })
  },

  deleteCategory: (req, res) => {
    Category.delete(req.params.cid, (err) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Category deleted successfully' });
    });
  },
};

module.exports = categoryController;

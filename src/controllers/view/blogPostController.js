"use strict";
/* -------------------------------------------------------
    EXPRESSJS - BLOG Project with Mongoose
------------------------------------------------------- */

const BlogPost = require("../../models/blogPostModel");
const BlogCategory = require("../../models/blogCategoryModel");

const removeQueryParam = require("../../helpers/removeQueryParam")

module.exports = {
  list: async (req, res) => {
    const posts= await res.getModelList(BlogPost,{isPublished:true},"blogCategoryId")

    const selectedCategoryId = req.query.filter?.blogCategoryId || ''

    const details = await res.getModelListDetails(BlogPost,{isPublished:true})

    const categories = await BlogCategory.find()
    const recentPosts = await BlogPost.find().sort({createdAt:"desc"}).limit(4)

    let pageUrl = ''


    const queryString = req.originalUrl.split("?")[1]

    if(queryString) pageUrl = removeQueryParam(queryString,'page')

    pageUrl = pageUrl ? '&' + pageUrl : ''


    res.render("index",{categories,recentPosts, posts, selectedCategoryId, details,pageUrl})
  },

  create: async (req, res) => {
    if (req.method == "POST") {
      const data = await BlogPost.create(req.body);
      if (data) res.redirect("/view/posts");
    } else {
      const categories = await BlogCategory.find();

      res.render("postForm", { categories,post: null });
    }
  },

  read: async (req, res) => {
    const post = await BlogPost.findOne({ _id: req.params.postId }).populate(
      "blogCategoryId"
    );

    res.render("postRead", { post });
  },

  update: async (req, res) => {
    if (req.method == "POST") {
      const data = await BlogPost.updateOne(
        { _id: req.params.postId },
        req.body,
        { runValidators: true }
      );

      if (data) res.redirect("/view/posts");
    } else {
      const categories = await BlogCategory.find();
      const post = await BlogPost.findById(req.params.postId).populate(
        "blogCategoryId"
      );

      res.render("postForm", { categories, post });
    }
  },

  delete: async (req, res) => {
    const data = await BlogPost.deleteOne({ _id: req.params.postId });
    if (data) res.redirect("/view/posts");
  },
};

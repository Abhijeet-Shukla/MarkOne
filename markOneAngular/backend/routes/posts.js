const express = require('express');
const Post = require('../models/post');

const route = express.Router();

route.post("", (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  console.log(post);

  post.save().then( result => {
    res.status(201).json({
      message: "Post added successfully",
      postId: result._id
    });
  });
});

route.get('', (req, res) => {
  Post.find()
  .then(documents => {
    console.log(documents);

    return res.status(200).json({
      message: "Posts fetched Successfully",
      posts: documents
    });
  });
});

route.delete('/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
  .then(result => {
    console.log(result);
    return res.status(200).json({ message: 'Post Deleted' });
  })
});

route.patch('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content
  });

  Post.updateOne({ _id: req.params.id }, post)
  .then( result => {
    console.log(result);
    return res.status(200).json({ message: "Post Updated"});
  })
});

route.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if(post){
      res.status(200).json(post);
    }
    else{
      res.status(400).json({
        message: 'The post does not exist...'
      })
    }
  })
})

module.exports = route;

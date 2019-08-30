const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    naslov: req.body.naslov,
    opis: req.body.opis,
    imagePath: url + '/slike/' + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(kreiranPost => {
    res.status(201).json({
      message: 'Dodat je novi post uspesno!',
      post: {
        ...kreiranPost,
        id: kreiranPost._id
      }
    })
    console.log(kreiranPost)
  })
  .catch(error => {
    res.status(500).json({
      message: "Creating a post failed!"
    })
  })
}

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currenPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currenPage) {
    postQuery
      .skip(pageSize * (currenPage - 1))
      .limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'Uspesno poslat response!',
        posts: fetchedPosts,
        maxPosts: count
      })
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching post failed!"
      })
    })
}

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: 'Post nije pronadjen!'
      })
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching post failed!"
    })
  })
}

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/slike/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    naslov: req.body.naslov,
    opis: req.body.opis,
    imagePath: imagePath,
    creator: req.userData._id
  })
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
    if (result.n > 0) {
      res.status(200).json({
        message: 'Uspesno updatovan post!'
      })
    } else {
      res.status(401).json({
        message: 'Not authorized!'
      })
    }
  })
  .catch(error =>{
    res.status(500).json({
      message: "Couldn't update post!"
    })
  })
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      // console.log(result)
      if (result.n > 0) {
        res.status(200).json({
          message: 'Uspesno obrisan post!'
        })
      } else {
        res.status(401).json({
          message: 'Not authorized!'
        })
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching post failed!"
      })
    })
}
const express = require('express');

const userAuth = require('../middleware/check-auth');
const fileExports = require('../middleware/file');

const router = express.Router();

const postControllers = require('../controllers/post');

router.post("", userAuth, fileExports, postControllers.createPost);

router.get("", postControllers.getPosts);

router.get('/:id', postControllers.getPost);

router.put('/:id', userAuth, fileExports, postControllers.updatePost);

router.delete('/:id', userAuth, postControllers.deletePost);

module.exports = router;
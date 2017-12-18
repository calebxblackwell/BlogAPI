const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');


// "Add a couple of blog posts on server load so you'll automatically have some data to look at when the server starts."
function lorem() {
  return 'Lorem ipsum dolor sit amet.'
}

// seed so that initial GET requests will return something
BlogPosts.create(
  'Best places to eat', lorem(), 'J. Smith');
BlogPosts.create(
  'Best movies of 2017', lorem(), 'Jane Smith');

// add endpoint for GET. to call `BlogPosts.get()` and return JSON objects of stored blog posts.
router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});


// add endpoint for POST requests, which should cause a new blog post to be added (using `BlogPosts.create()`). Endpoint should send a 400 error if the post doesn't contain `title`, `content`, and `author`.
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `No \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = BlogPosts.create(
  	req.body.title, req.body.content, req.body.author);
  res.status(201).json(item);
});


// add endpoint for PUT requests to call `BlogPosts.update()` and return the updated post.
router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = [
  	'id', 'title', 'content', 'author', 'publishDate'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `No \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post \`${req.params.id}\``);
  const updatedItem = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate
  });
  res.status(204).end();
});


// add endpoint for DELETE requests that call `BlogPosts.delete()`
router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post \`${req.params.ID}\``);
  res.status(204).end();
});

module.exports = router;

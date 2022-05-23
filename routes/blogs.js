var express = require('express');
let { blogPosts } = require('../sampleBlogs');
var router = express.Router();


///////////////////////////////////////////////////////////////////
router.get("/postblog", function (req, res, next) {
  res.render('postBlog');
})

router.post("/submit", function (req, res, next) {
  console.log(req.body)
  console.log("bloglist before ", blogPosts)
  const today = new Date()
  const newPost = {
      title: req.body.title,
      text: req.body.text,
      author: req.body.author,
      createdAt: today.toISOString(),
      id: String(blogPosts.length + 1)
  }
  blogPosts.push(newPost)
  console.log("bloglist after ", blogPosts)

  res.send("OK");
})


/* GET users listing. */
router.get("/", function (req, res, next) {
  res.json("Blogs Index Route");
});


///////////////////////////////////////////////////////////////

router.get("/all", function (req, res, next) {
    const sortOrder = req.query.sort;
    blogPosts.sort((a, b) => {
        const aCreatedAt = a.createdAt
        const bCreatedAt = b.createdAt
        
        /* Compare by date object for extra utility
        const aCreatedAt = new Date(a.createdAt)
        const bCreatedAt = new Date(b.createdAt) */

        if (sortOrder === "asc") {
            if (aCreatedAt < bCreatedAt) {
              return -1;
            }
            if (aCreatedAt > bCreatedAt) {
              return 1;
            }
        }
        if (sortOrder === "desc") {
            if (aCreatedAt > bCreatedAt) {
              return -1;
            }
            if (aCreatedAt < bCreatedAt) {
              return 1;
            }
        }
        return 0;
      })

  res.json(blogPosts);
});

router.get("/singleblog/:blogId", function (req, res, next) {
  const blogId = req.params.blogId;
  res.json(findBlogId(blogId));
});

const findBlogId = (blogId) => {
  const foundBlog = blogPosts.find(element => element.id === blogId);
  return foundBlog;
};


/////////////////////////////////////////////////////////////////////////////////////////////////


router.get("/displayblogs", function (req, res, next){
  res.render('displayBlogs');
})

////////////////////////////////////////////////////////////////////////////////////////////////

router.get("/displaysingleblogs/:blogId", function (req, res, next){
  res.render('displaySingleBlogs');
})






router.delete("/deleteblog/:blogId", function (req, res, next){
  console.log('deleteBlog', req.params.blogId);
  const blogId = req.params.blogId
  const filteredBlogList = generateBlogs(blogPosts,blogId);
  saveBlogPosts(filteredBlogList);
  
  console.log(filteredBlogList);
  
  res.send('deleteBlog');
})

function generateBlogs(blogList, blogId) {

  const filterList = blogList.filter(function(blog) {

    return blog.id !== blogId
  })

  return filterList
}

function saveBlogPosts(blogList){

  blogPosts = blogList
}

module.exports = router;
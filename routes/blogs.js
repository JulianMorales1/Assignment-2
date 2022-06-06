var express = require('express');
let { blogPosts } = require('../sampleBlogs');
var router = express.Router();

const { blogsDB } = require("../mongo");


const getPostsCollectionLength = async ()=>{
  const collection = await blogsDB().collection("posts");
  const posts = await collection.count()

  //const posts = db.posts.count() Changed to above for mongo
  let counter = 0;
  
  return posts
}

///////////////////////////////////////////////////////////////////
router.get("/postblog", async function (req, res, next) {
  res.render('postBlog');
})

router.post("/submit", async function (req, res, next) {
  
  const today =  new Date()
  const newPost = {
      title: req.body.title,
      text: req.body.text,
      author: req.body.author,
      createdAt: today.toISOString(),
      id: getPostsCollectionLength() + 1
  }
  const collection = await blogsDB().collection("posts");
  await collection.insertOne(newPost)

  //  blogPosts.push(newPost)  Changed to above for mongo
  

  res.send("OK");
})




/////////////* GET users listing. *////////////////////////
router.get("/", async function (req, res, next) {
  const collection = await blogsDB().collection("posts");
  const posts = await collection.find({}).toArray();
  res.json(posts);
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



const deletePosts = async (blogId)=>{
   const collection = await blogsDB().collection("posts");
    await collection.deleteOne({id:blogId})
}


router.delete("/deleteblog/:blogId",  async function (req, res, next){ 
 
  const blogId = Number(req.params.blogId)
  
  await deletePosts(blogId)

  // const filteredBlogList = generateBlogs(blogPosts,blogId);

  // saveBlogPosts(filteredBlogList);
  
  res.send('deleteBlog');
})


// function generateBlogs(blogList, blogId) {

//   const filterList = blogList.filter(function(blog) {

//     return blog.id !== blogId
//   })

//   return filterList
// }

// function saveBlogPosts(blogList){

//   blogPosts = blogList
// }

module.exports = router;
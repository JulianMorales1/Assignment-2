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
const getPosts = async (limit, skip, sortField, sortOrder, filterField, filterValue) => {
    


    const collection = await blogsDB().collection("posts");

    let queryLimit = 1000
      if (limit !== undefined && limit !== NaN) {
          queryLimit = limit
      }
    
    let querySkip = 0
      if(skip !== undefined && skip !== NaN) {
        querySkip = skip
      }

    const sortObj = {}
      if(sortField !== "" && sortField !== undefined && sortOrder !== "" && sortOrder !== undefined ) {
    sortObj[sortField] = sortOrder
      }

    const filterObj =  {}
      if (filterField !== "" && filterField !== undefined && filterValue !== "" && filterValue !== undefined) {
      filterObj[filterField] = filterValue
      }
    
   
   
    const dbResult = await collection.find(filterObj).sort(sortObj).limit(queryLimit).skip(querySkip).toArray()
    
    return dbResult
  }



router.get("/all", async function (req, res, next) {

    const limitQueryParam = Number(req.query.limit)
    const skipQueryParam = Number(req.query.skip)
    const sortFieldQueryParam = req.query.sortField
    const sortOrderQueryParam = Number(req.query.sortOrder)
    const filterFieldQueryParam = req.query.filterField
    const filterValueQueryParam = req.query.filterValue

    

    console.log(limitQueryParam)
    console.log(skipQueryParam)
    console.log(sortFieldQueryParam)
    console.log(sortOrderQueryParam)
    console.log(filterFieldQueryParam)
    console.log(filterValueQueryParam)
    // const sortOrder = req.query.sort;

    const posts = await getPosts(limitQueryParam, skipQueryParam, sortFieldQueryParam, sortOrderQueryParam, filterFieldQueryParam, filterValueQueryParam)

    

    // blogPosts.sort((a, b) => {
    //     const aCreatedAt = a.createdAt
    //     const bCreatedAt = b.createdAt
        
    //     /* Compare by date object for extra utility
    //     const aCreatedAt = new Date(a.createdAt)
    //     const bCreatedAt = new Date(b.createdAt) */

    //     if (sortOrder === "asc") {
    //         if (aCreatedAt < bCreatedAt) {
    //           return -1;
    //         }
    //         if (aCreatedAt > bCreatedAt) {
    //           return 1;
    //         }
    //     }
    //     if (sortOrder === "desc") {
    //         if (aCreatedAt > bCreatedAt) {
    //           return -1;
    //         }
    //         if (aCreatedAt < bCreatedAt) {
    //           return 1;
    //         }
    //     }
    //     return 0;
      // })

  res.json(posts);
});

const getSinglePost = async (postId)=>{
  const collection = await blogsDB().collection("posts");
  const result = await collection.find({id:postId}).toArray();
  return result
};

router.get("/singleblog/:blogId", async function (req, res, next) {
  const blogId = Number(req.params.blogId);
  const postId = await getSinglePost(blogId)

  console.log(postId)

  res.json(postId);
});

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
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
const port = 3000

//ket noi voi co so du lieu
mongoose.connect('mongodb://localhost:27017/nodejs_lvm')

//dinh nghia schema
const BlogSchema = new mongoose.Schema({
    title: String,
    author: String,
    body: String,
    comments: [{body: String, date: Date}],
    date: {type: Date, default: Date.now},
    hidden: Boolean,
    meta: {
        vote: Number,
        favs: Number,
    }
})
//tao model tu schema
const Blog = mongoose.model('Blog', BlogSchema)
//sd BodyParser de phan tich yc tu HTTP chua json 
app.use(bodyParser.json())

//route de lay ra cac blog
app.get('/api/blogs', async (req, res)=> {
       try {
         const blogs = await Blog.find();
         res.json(blogs)
       } catch (error) {
        res.status(500).json({error: error.message})
       }
})
// route them blog
app.post('/api/blogs', async (req, res)=> {
    const {title, author, body, comments, date, hidden, meta} = req.body;
    try {
        const newBlog = new Blog({title, author, body, comments, date, hidden, meta});
        const savedBlog = await newBlog.save();
        res.json(savedBlog)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})
//route tim blog theo id
app.get('/api/blogs/:id', async (req, res)=> {
    try {
        const blog = await Blog.findById(req.params.id);
        if(!blog){
            res.status(404).json({error: "Blog khong ton tai"})
        }
        res.json(blog)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})
//route cap nhap blog 
app.put('/api/blogs/:id', async (req, res)=> {
    const {title, author, body, comments, date, hidden, meta} = req.body;
     try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            {title, author, body, comments, date, hidden, meta},
            {new : true}
            );
            if(!updatedBlog) {
                res.status(404).json({error: "Blog khong ton tai"})
            }
            res.json(updatedBlog)
     } catch (error) {
        res.status(500).json({error: error.message})
     }
})
// Route để xóa Blog theo id
app.delete('/api/blogs/:id', async (req, res) => {
    try {
      const deleteBlog = await Blog.findByIdAndDelete(req.params.id);
      if (!deleteBlog) {
          return res.status(404).json({ error: 'Blog not found' });
       
      }
  
      res.json(deleteBlog);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });



//bat dau server
app.listen(port, () => {
    console.log(`start server on http://localhost:${port}`);
})
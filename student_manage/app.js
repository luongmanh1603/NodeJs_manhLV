const express = require("express")
const exphbs = require('express-handlebars').engine
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Student = require('./models/student')

const app = express()
const port = process.env.PORT || 3000

//connection mongoDb
mongoose.connect('mongodb://localhost:27017/student_manage')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('public'))

app.engine('handlebars', exphbs({ defaultLayout: 'main', runtimeOptions: { allowProtoPropertiesByDefault: true } }));
app.set('view engine', 'handlebars')
//route chinh
app.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.render('home', {students} );
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

//hien thi den form add sinh vien
app.get('/add', (req, res)=> {
    res.render('add');
})
//xu ly du lieu them sinh vien
app.post('/add', async (req, res)=> {
    try {
        const {name, email, phone, gpa, status} = req.body;
        //tao doi tuong sinh vien moi
        const newStudent = new Student({
            name,
            email,
            phone,
            gpa,
            status
        });
        await newStudent.save();
        res.redirect('/')
    } catch (error) {
        
    }
})
//start port
app.listen(port, () => {
    console.log(`start server on http://localhost:${port}`);
})
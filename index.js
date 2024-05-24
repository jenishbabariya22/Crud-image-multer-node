const express = require('express')

const port = 8000;

const app = express();

const path = require('path')

const fs = require('fs')

app.set('view engine', 'ejs')

const db = require('./config/db')

const User = require('./models/UserModel')

const multer = require('multer')

app.use(express.urlencoded())

app.use('/uploads', express.static(path.join(__dirname, "uploads")))


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({ storage: storage }).single('image')

app.get('/', (req, res) => {
    User.find({})
        .then((record) => {
            return res.render('viewrecord', {
                record
            })
        }).catch((err) => {
            console.log("not fetch");
            return false;
        })

})

app.get('/add', (req, res) => {
    return res.render('add')
})

app.post('/addRecord', upload, (req, res) => {
    const name = req.body.name;
    const phone = req.body.phone;
    User.create({
        name: name,
        phone: phone,
        image: req.file.path
    }).then((data) => {
        console.log("Record add");
        return res.redirect('/')
    }).catch((err) => {
        console.log(err);
        return false;
    })
})

app.get('/deleteRecord', (req, res) => {
    let id = req.query.id
    User.findById(id)
        .then((re) => {
            fs.unlinkSync(re.image)
            User.findByIdAndDelete(id)
                .then((data) => {
                    return res.redirect('/')
                }).catch((err) => {
                    console.log(err);
                    return false;
                })
        }).catch((err) => {
            console.log(err);
            return false
        })
    //    
})

app.get('/editRecord', (req, res) => {
    let id = req.query.id;
    User.findById(id)
        .then((single) => {
            return res.render('edit', {
                single
            })
        }).catch((err) => {
            console.log(err);
            return false;
        })
})

app.post('/updateRecord', upload,(req, res) => {
    try {
        let id = req.body.editid
        if(req.file){
            User.findById(id)
            .then((single)=>{
                fs.unlinkSync(single.image)
            }).catch((err)=>{
                console.log(err);
                return false;
            })

            User.findByIdAndUpdate(id,{
                name : req.body.name,
                phone : req.body.phone,
                image : req.file.path
            }).then((record)=>{
                return res.redirect('/')
            }).catch((err)=>{
                console.log(err);
                return false;
            })

        }else{
            User.findById(id)
            .then((single)=>{
                User.findByIdAndUpdate(id,{
                    name : req.body.name,
                    phone : req.body.phone,
                    image : single.image
                }).then((data)=>{
                    return res.redirect('/')
                }).catch((err)=>{
                    console.log(err);
                    return false
                })
            }).catch((err)=>{
                console.log(err);
                return false;
            })
        }
        // let id = req.body.editid;
        // let name = req.body.name;
        // let phone = req.body.phone
        // User.findByIdAndUpdate(id, {
        //     name: name,
        //     phone: phone,
        // }).then((data) => {
        //     return res.redirect('/')
        // }).catch((err) => {
        //     console.log(err);
        //     return false
        // })

    } catch (err) {
        console.log(err);
        return false;
    }
})

app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return false
    }
    console.log(`server is start on port :- ${port}`);
})
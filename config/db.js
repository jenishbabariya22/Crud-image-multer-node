const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1/jenish');

const db = mongoose.connection;


db.on("connected",(err)=>{
    if(err){
        console.log("mongodb is not connected");
        return false
    }
    console.log(`DB is connected`);
})

module.exports = db
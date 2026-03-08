const mongoose = require('mongoose')


async  function connectToDB(){

    try{

        await mongoose.connect(process.env.MONGO_DB_URI)

        console.log("mongo db connected successfully")
        
    }catch(err){
        console.log("mongo db not connected")
    }

}

module.exports = connectToDB;
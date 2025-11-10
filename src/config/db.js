const mongoose = require('mongoose');

module.exports = async function(){
  try{
    await mongoose.connect('mongodb://localhost:27017/newsroom');
    console.log(`MongoDB connected ${mongoose.connection.host} : ${mongoose.connection.port}`);
  } catch(err){
    console.error(err);
    process.exit(1);
  }
}

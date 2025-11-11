const mongoose = require('mongoose');

module.exports = async function(){
  try{
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB connected ${mongoose.connection.host} : ${mongoose.connection.port}`);
  } catch(err){
    console.error(err);
    process.exit(1);
  }
}

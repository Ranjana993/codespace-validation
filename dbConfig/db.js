const mongoose = require("mongoose");
require("dotenv").config();
// Xl0dGJoOXp85rJmY <= password  name=>  ranjana
const {MONGOOSE_URL} = process.env;

exports.connect = () => {
  mongoose.connect(MONGOOSE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(()=>console.log("Successfully connected"))
  .catch((err) =>{
    console.log(`Db  connection failed `);
    console.log(err);
    process.exit(1);
  })
};

const express = require("express")
require("dotenv").config();



const app = express();
app.get("/" , (req , res)=>{
    res.send("working...")
})

app.listen(4000 , () => console.log("App is running "))






import "dotenv/config";
import app from "./src/app.js";
app.get('/',(req,res)=>{
    res.send("Hello World");
});
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})
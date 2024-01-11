const express = require("express");
const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended :  false}));
app.use(bodyParser.json());

const mongoose = require("mongoose");
require("dotenv").config();
const noteSchema = require("./models/note");

const moment = require("moment-timezone");

function metaMessage(statusCode) {
    switch(statusCode){
        case 200 : return "Success";
        case 400 : return "Bad Request";
        case 401 : return "Unauthorized";
        case 404 : return " Not Found";
        case 429 : return "Too Many Requests";
        case 500 : return "Internal Server Error";
        case 502 : return "Bad Gateway";
        case 503 : return "Service Unavailable";
    };
}
mongoose.connect(process.env.MONGO_URL).then(
() => {console.log("connected to mongoDb")}
).catch(() => {console.log("Not connected to mongoDb")});

app.get("/",function getFunc(req,res) {
    res.send("Helloo worlddd");
});

app.get("/api/notes/list", async function getFunc(req,res) {
    const userId = req.query.userId;
    const date = req.query.date;
    try {
        const query = {};

        if (userId != null) {
            query.userId = userId;
             console.log(`userId ::${userId}`);
        }
        if (date != null) {
            const formattedDate = moment(date).utc("tz").format('YYYY-MM-DD');
            query.date = { $gte: formattedDate, $lt: moment(formattedDate).add(1, 'days').format('YYYY-MM-DD') };
            console.log(`date ::${formattedDate}`);
        }


        const notes = await noteSchema.find(query);

        const response = {meta:{
            status:"true",
            statusCode:res.statusCode,
            message: metaMessage(res.statusCode)
        },values:notes
    }
        res.json(response);

    } catch (error) {
        console.log(`getNote ::${error}`);
    }
});

app.post("/api/notes/add", async function postFunc(req,res) {

    const userInput = req.body;
  await noteSchema.deleteOne({userId: req.body.userId});
    const newNote = new noteSchema({
        userId: userInput.userId,
        title: userInput.title,
        content: userInput.content,
    });
  await newNote.save();

  const response = {meta:{
    status:"true",
    statusCode:res.statusCode,
    message:metaMessage(res.statusCode)
},values:newNote
}
res.json(response);

});

app.delete("/api/notes/delete",async function deleteFunc(req,res){
    const userId = req.query.userId;
   await noteSchema.deleteOne({ userId });
   const response = {meta:{
    status:"true",
    statusCode:res.statusCode,
    message:metaMessage(res.statusCode)
},values:"Note Deleted"
}
res.json(response);
})

app.listen(5000,()=> console.log("Server started"));

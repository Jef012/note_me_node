const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const noteSchema = require("./models/note");
const moment = require("moment-timezone");
const { restrictToLoggedinUserOnly } = require("./middlewares/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function metaMessage(statusCode) {
    switch (statusCode) {
        case 200: return "Success";
        case 400: return "Bad Request";
        case 401: return "Unauthorized";
        case 404: return "Not Found";
        case 429: return "Too Many Requests";
        case 500: return "Internal Server Error";
        case 502: return "Bad Gateway";
        case 503: return "Service Unavailable";
        default: return "Unknown Status";
    }
}

module.exports = { metaMessage };

mongoose.connect(process.env.MONGO_URL).then(
() => {console.log("connected to mongoDb")}
).catch(() => {console.log("Not connected to mongoDb")});
const router = require("./router/user");


app.use("/api",router);

app.use("/api/user", router);

app.get("/",function getFunc(req,res) {
    res.send("Helloo worlddd");
});

app.get("/api/notes/list", restrictToLoggedinUserOnly, async function getFunc(req, res) {
    const userId = req.query.userId;
    try {

        const notes = await noteSchema.find({ userId:userId });

        const response = {
            meta: {
                status: "true",
                statusCode: res.statusCode,
                message: metaMessage(res.statusCode)
            },
            values: notes
        };
        res.json(response);

    } catch (error) {
        console.log(`getNote :: ${error}`);
        // Handle errors appropriately
        const response = {
            meta: {
                status: "false",
                statusCode: 500,
                message: "Internal Server Error"
            },
            values: "An error occurred while fetching notes"
        };
        res.status(500).json(response);
    }
});


app.post("/api/notes/add", restrictToLoggedinUserOnly, async function postFunc(req, res) {
    const userInput = req.body;

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
console.log(response,"<<<<<<<response")
res.json(response);
});


app.put("/api/notes/edit/:noteId", restrictToLoggedinUserOnly, async function(req, res) {
    const noteId = req.params.noteId;
    const { userId, title, content } = req.body;

    try {

        const existingNote = await noteSchema.findOne({ _id: noteId, userId: userId });

        if (!existingNote) {

            const response = {
                meta: {
                    status: "false",
                    statusCode: 404,
                    message: "Note not found"
                },
                values: "Note not found"
            };
            return res.status(404).json(response);
        }

        existingNote.title = title;
        existingNote.content = content;
        await existingNote.save();

        const response = {
            meta: {
                status: "true",
                statusCode: res.statusCode,
                message: metaMessage(res.statusCode)
            },
            values: existingNote
        };
        res.json(response);

    } catch (error) {
        console.log(`editNote :: ${error}`);
        // Handle errors appropriately
        const response = {
            meta: {
                status: "false",
                statusCode: 500,
                message: "Internal Server Error"
            },
            values: "An error occurred while editing the note"
        };
        res.status(500).json(response);
    }
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

// app.listen(5000,()=> console.log("Server started"));
app.listen(5000,"192.168.5.108",()=> console.log("Server started"));

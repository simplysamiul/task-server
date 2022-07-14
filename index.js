const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const objectId = require("mongodb").ObjectId;
require('dotenv').config();
const port = process.env.PORT || 5000;


// Middle Ware
app.use(cors());
app.use(express.json());


// Database Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bx9iq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{

        await client.connect();
        const database = client.db("store");
        const studentsCollection = database.collection("student");
        // Get all students
        app.get("/allstudents", async(req,res)=>{
            const cursor = studentsCollection.find({});
            const students = await cursor.toArray();
            res.json(students);
        });
        // Get Specific Student Info
        app.get("/allstudents/:id", async(req,res)=>{
            const id = req.params.id;
            const query={ _id : objectId(id) };
            const result = await studentsCollection.findOne(query);
            res.send(result);
        });
        // Post student information
        app.post("/addstudents", async(req,res)=>{
            const student = req.body;
            const result = await studentsCollection.insertOne(student);
            res.json(result);
            
        });
        // Update Student Info
        app.put("/updatestudent/:id", async(req,res)=>{
            const id = req.params.id;
            const updateInfo = req.body;
            console.log(updateInfo);
            const filter = { _id: objectId(id)};
            const options = { upsert: true };
            const updateDoc  = {$set: {
                name: updateInfo.name,
                school: updateInfo.school,
                className: updateInfo.className,
                division: updateInfo.division,
                birth_date: updateInfo.birth_date,
                status: updateInfo.status
            }};
            const result = await studentsCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });
        // Delete Api
        app.delete("/removestudent/:id", async(req,res)=>{
            const id = req.params.id;
            const query = { _id : objectId(id) };
            const result = await studentsCollection.deleteOne(query);
            res.json(result);
        });
    } finally{
        // await client.close();
    }
};

run().catch(console.dir);

// Root Route
app.get("/", (req,res) =>{
    res.send("Server running Successfully")
});
app.listen(port, (req,res)=>{
    console.log(`Port listing at ${port}`);
})







// name: updateInfo.name,
//                 school: updateInfo.school,
//                 class: updateInfo.class,
//                 division: updateInfo.division,
//                 birth_date: updateInfo.birth_date,
//                 status: updateInfo.status
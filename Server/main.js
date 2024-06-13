const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var cors = require('cors')
const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/yu_db', {useNewUrlParser: true});

//This is the database schema currently in use
var dataSchema = new mongoose.Schema({
    DeviceID: String,
    Location: String,
    EntryDate: Date,
    SensorValue: {
        co2: String,
        co: String,
        ch4: String,
        aqi: String
    }
});

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(cors())


function updateClock(){
    let currentDate = new Date();
    currentDate.setSeconds(0);
    currentDate.setMinutes(0);
    currentDate.setHours(0);
    currentDate.setMilliseconds(0);
    return currentDate;
}

//Model generated based on the schema defiend above
sensordata = mongoose.model('gasesdata',dataSchema);

//Mobile app hits to this url for fetching data with location as query parameter
app.get('/get-data', (req, res) => {
    var location = req.query.location;
    var currentDate = updateClock();
    sensordata.findOne({Location: location,EntryDate: currentDate},function(err,result){
        if(err){
            console.log(err);
        }
        if(!result){
            res.status(404)
            res.send('Not Found !')
        }
        else{
            res.json({
                co2: result.SensorValue.co2,
                co: result.SensorValue.co,
                ch4: result.SensorValue.ch4,
                aqi_val: result.SensorValue.aqi
            });
        }
    })
});

//Handles data submitted by field sensor modules
app.post('/post-data',(req , res) => {
    var ID = req.body.DeviceID;
    var locationData = req.body.location;
    var co_data = req.body.CO;
    var co2_data = req.body.CO2;
    var ch4_data = req.body.CH4;
    var airq_data = req.body.AIRQ;
    var date = updateClock()

    //Finds the document which matches the conditions specified
    sensordata.findOne({ DeviceID: ID,EntryDate: date},function(err,result){
        if(err){
            console.log(err);
        }
        //If no such document present then create one
        if(!result){
            console.log('Creating new entry for date -')
            console.log(date)
            dataEntry = new sensordata();
            
            dataEntry.DeviceID = ID;
            dataEntry.Location = locationData;
            dataEntry.EntryDate = date;
            dataEntry.SensorValue.co2 = co2_data;
            dataEntry.SensorValue.co = co_data;
            dataEntry.SensorValue.ch4 = ch4_data;
            dataEntry.SensorValue.aqi = airq_data; 
            dataEntry.save();
        }
        else{
            console.log('Updating today\'s Entry')
            result.SensorValue.co2 = co2_data;
            result.SensorValue.co = co_data;
            result.SensorValue.aqi = airq_data;
            result.SensorValue.ch4 = ch4_data;
            result.save();
        }
        
    })
    console.log("\n"+ID +" " +co2_data); //For Debugging purpose only !
    
    res.end('Data Recieved')
})

app.listen(port,() => console.log('Listening...'))
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https")
const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}))
//Send client to sign up home page

app.get("/", function(req,res) {
    res.sendFile( __dirname + "/signup.html")
});

//Capture client name/email and redirect to success/failure page

app.post("/", function(req,res) {
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const email = req.body.email;    
    const data = {
       members: [
        {
            email_address : email,
            status: "subscribed",
            merge_fields: {
                FNAME : fName,
                LNAME: lName
            }
        }
       ]
    }
    const jsonData = JSON.stringify(data);
    const url = "https://us10.api.mailchimp.com/3.0/lists/721131e9cb"   
    const options = {
        method: "POST",
        auth: "anthony1:6586c389d742725e4e1be7a54cb8b6d1-us10"
    }

        const reques = https.request(url, options,function(response) {
       
           if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
           } else { res.sendFile(__dirname + "/failure.html")}
            
           response.on("data", function(data) {
            console.log(JSON.parse(data));
    })
    })

    reques.write(jsonData);
    reques.end();

 })

 //button link back to homepage
 
 app.post("/failure", function(req,res) {
    res.redirect("/")
 })





app.listen(process.env.PORT || 3000, function() {
    console.log("Server 3000 is now active");
})


// API KEY : 6586c389d742725e4e1be7a54cb8b6d1-us10
// LIST ID : 721131e9cb
// API URL : https://us10.api.mailchimp.com/3.0/lists/721131e9cb
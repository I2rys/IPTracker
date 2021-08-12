//Dependencies
const Request = require("request")
const Is_IP = require("is-ip")
const Chalk = require("chalk")
const Fs = require("fs")

//Variables
const Self_Args = process.argv.slice(2)

const Max_Request = parseInt(Fs.readFileSync("./max_request.txt", "utf8"))

var IPTracker_Data = {}
IPTracker_Data.requests = 0

//Main
if(Self_Args.length == 0){
    console.log(`${Chalk.grey("[") + Chalk.redBright("ERROR") + Chalk.grey("]")} Invalid IP.`)
    process.exit()
}

if(!Is_IP(Self_Args[0])){
    console.log(`${Chalk.grey("[") + Chalk.redBright("ERROR") + Chalk.grey("]")} Invalid IP.`)
    process.exit()
}

console.log(`${Chalk.grey("[") + Chalk.blueBright("INFO") + Chalk.grey("]")} Please wait, While I'm tracking the IP.`)

if(Max_Request > 1500){
    console.log(`${Chalk.grey("[") + Chalk.redBright("ERROR") + Chalk.grey("]")} Invalid IP/The API limit has exceeded please wait 1 hour to use this again.`)
    process.exit()
}

Request(`https://freegeoip.app/json/${Self_Args[0]}`, function(err, res, body){
    if(err){
        console.log(`${Chalk.grey("[") + Chalk.redBright("ERROR") + Chalk.grey("]")} Invalid IP.`)
        process.exit()
    }

    IPTracker_Data.requests += 1
    body = JSON.parse(body)

    if(res.statusCode != 200){
        console.log(`${Chalk.grey("[") + Chalk.redBright("ERROR") + Chalk.grey("]")} Invalid IP/The API limit has exceeded please wait 1 hour to use this again.`)
        process.exit()
    }

    console.log(Chalk.greenBright(`IP: ${body.ip}
Country Name: ${(body.country_name != "" ? body.country_name : "Unable to find the IP country name.")}
Country Code: ${(body.country_code != "" ? body.country_code : "Unable to find the IP country code.")}
Region Name: ${(body.region_name != "" ? body.region_name : "Unable to find the IP region name.")}
Region Code: ${(body.region_code != "" ? body.region_code : "Unable to find the IP region code.")}
City: ${(body.city != "" ? body.city : "Unable to find the IP city.")}
Timezone: ${(body.time_zone != "" ? body.time_zone : "Unable to find the IP timezone.")}
ZipCode: ${(body.zip_code != "" ? body.zip_code : "Unable to find the IP zipcode.")}
Metro Code: ${(body.metro_code != "" ? body.metro_code : "Unable to find the IP metro code.")}
Latitude: ${(body.latitude != "" ? body.latitude : "Unable to find the IP latitude.")}
Longitude: ${(body.longitude != "" ? body.longitude : "Unable to find the IP longitude.")}`))
})
process.on("SIGINT", function(req, res){
    if(Max_Request == 0){
        Fs.writeFileSync("./max_request.txt", IPTracker_Data.requests.toString(), "utf8")
    }else{
        Fs.writeFileSync("./max_request.txt", (IPTracker_Data.requests += Max_Request).toString(), "utf8")
    }
    
    process.exit()
})


process.on("beforeExit", function(req, res){
    if(Max_Request == 0){
        Fs.writeFileSync("./max_request.txt", IPTracker_Data.requests.toString(), "utf8")
    }else{
        Fs.writeFileSync("./max_request.txt", (IPTracker_Data.requests += Max_Request).toString(), "utf8")
    }
    
    process.exit()
})

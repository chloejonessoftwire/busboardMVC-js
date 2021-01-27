var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;



function getStopPointFromPostcode(postcode, res) {
    // You should check the postcode is valid somewhere around here
    let url = `https://api.postcodes.io/postcodes/${postcode}`;
    var request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let postcodeData = JSON.parse(request.responseText)
            getStopPointFromLongLat({longitude: postcodeData.result.longitude, latitude: postcodeData.result.latitude})
        }
    }
    request.send()
}

function getStopPointFromLongLat(longLat) {
    let url = `https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&lat=${longLat.latitude}&lon=${longLat.longitude}`
    var request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let stopPointData = JSON.parse(request.responseText)
            // If there is at least one stop point get the arrivals for that stop point
            if(stopPointData.stopPoints.length > 0) {
                getArrivalsForStopPoint(stopPointData.stopPoints[0].id)
            }
            // If there are at least two stop points get the arrivals for the second stop point
            if(stopPointData.stopPoints.length > 1) {
                getArrivalsForStopPoint(stopPointData.stopPoints[1].id)
            }
        }
    }
    request.send()
}

function getArrivalsForStopPoint(stopPoint) {
    let url = `https://api.tfl.gov.uk/StopPoint/${stopPoint}/Arrivals`;
    var request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let array = JSON.parse(request.responseText)
            sortData(array)
        }
    }
    request.send()
}

function sortData(buses) {
    // Map the array of objects to a new array of objects with only the information we want
    let reducedBuses = buses.map(bus =>  { return { time: bus.timeToStation, line: bus.lineName, route: bus.towards }})

    // Sort the array of objects in order of their time value
    let sortedReducedBuses = reducedBuses.sort(function(a,b) {
        if (a.time < b.time) return -1
        else return 1
    })

    // Get the first 5 objects from the array
    let next5Buses = sortedReducedBuses.slice(0,5)

    // Print some information to the user to the console about each bus
    next5Buses.forEach(element => {   
        console.log(`Bus arriving in ${element.time} seconds, ${element.line} on route towards ${element.route}`) 
    });
}


/*chloe stuff
function regexPostcodeCheck(userPostcode, res)
{
    //console.log('Please input your postcode with no spaces and lowercase. (e.g. DE45 1BB would be inputted as de451bb)');
    // userPostcode=''
    const regex= /^([a-z]{1,2}\d[a-z\d]?\d[a-z]{2}|GIR ?0A{2})$/g
    while (userPostcode.match(regex)==null)

    { userPostcode=readline.prompt();
      try
      { 
        if (userPostcode.match(regex)==null)
        {
          throw 'invalid postcode'
        }
      }
      catch(e)
      {
        console.log('Invalid postcode: Please input your postcode with no spaces and lowercase (e.g. DE45 1BB would be inputted as de451bb)')
      }
    }
    console.log(`Your inputted postcode is: ${userPostcode}`) 
    postcodeValidation(userPostcode, res)
    
}

function postcodeValidation(userPostcode, res)
{
    const postcodeValidationRequest = new XMLHttpRequest();
    const postcodeValidationURL = `http://api.postcodes.io/postcodes/${userPostcode}/validate`
    postcodeValidationRequest.responseType = 'json';
    postcodeValidationRequest.open('GET', postcodeValidationURL);
    postcodeValidationRequest.onreadystatechange = () => {
        //console.log(postcodeValidationRequest.readyState);
        if (postcodeValidationRequest.readyState === 4) {
            let postcodeValidation = JSON.parse(postcodeValidationRequest.responseText);
            //console.log(postcodeValidation)

            if (!postcodeValidation.result) {
                console.log('The postcode you entered doesn\'t exsist')
            }
            else {
                postcodeGeoLoc(userPostcode, res)
            }
        }
    }
    postcodeValidationRequest.send();
}


function postcodeGeoLoc(userPostcode, res)
{
    const postcodeGeoLocRequest = new XMLHttpRequest();
    const postcodeGeoLocURL = `http://api.postcodes.io/postcodes/${userPostcode}`
    postcodeGeoLocRequest.responseType = 'json';
    postcodeGeoLocRequest.open('GET', postcodeGeoLocURL);
    postcodeGeoLocRequest.onreadystatechange = () => {

        if (postcodeGeoLocRequest.readyState === 4) {
            let postcodeGeoLoc = JSON.parse(postcodeGeoLocRequest.responseText);

            //console.log(postcodeGeoLoc);

            let postcodeLong = postcodeGeoLoc.result.longitude;
            let postcodeLat = postcodeGeoLoc.result.latitude;

            console.log('The latitude coordinates are:',postcodeLat + ' and the longitude coordinates are: ' + postcodeLong, '.');
            twoClosestBusStop(postcodeLat, postcodeLong, res, userPostcode);
        }
    }

    postcodeGeoLocRequest.send();
}




function twoClosestBusStop(postcodeLat, postcodeLong, res, userPostcode)
{
    const nearStopRequest = new XMLHttpRequest();
    const nearStopsURL = `http://transportapi.com/v3/uk/places.json?app_id=429d2986&app_key=31d8fbe68ead7b9abe6ea4720cbc9441&lat=${postcodeLat}&lon=${postcodeLong}&type=bus_stop`

    console.log(nearStopsURL);
    nearStopRequest.responseType = 'json';
    nearStopRequest.open('GET', nearStopsURL);
    nearStopRequest.onreadystatechange = () => {

        if (nearStopRequest.readyState === 4) {

            let nearStops = JSON.parse(nearStopRequest.responseText);
            console.log(nearStops);

            let firstStop = ''

            let firstStopName = ''


            if (nearStops.member.length === 0) {
                console.log('There are not bus stops close by.')
            }

            for (let i = 0; i < nearStops.member.length && i < 2; i++) {
                StopCode = nearStops.member[i].atcocode
                StopName = nearStops.member[i].name

                BusStopTimes(StopCode, StopName, res, userPostcode); 
                

            }

        }
    }
    nearStopRequest.send();
}

function BusStopTimes(StopCode, StopName, res, userPostcode)
{   console.log('busStopTimes funtion')
    let busStopCode = StopCode
    let busStopName= StopName
    const busTimeRequest = new XMLHttpRequest();
    const busTimeUrl = `https://transportapi.com/v3/uk/bus/stop/${busStopCode}/live.json?app_id=429d2986&app_key=31d8fbe68ead7b9abe6ea4720cbc9441&group=route&nextbuses=yes`

    busTimeRequest.responseType = 'json';
    busTimeRequest.open('GET', busTimeUrl);
    busTimeRequest.onreadystatechange = () => 
    {
        if (busTimeRequest.readyState === 4) {
            let busTimeResponse = JSON.parse(busTimeRequest.responseText);
            console.log(busTimeResponse)
            let presentBusLines = Object.getOwnPropertyNames(busTimeResponse.departures); //this is an array of string
            console.log(`The active bus lines at ${busStopName} are:`, presentBusLines);
            
            console.log(presentBusLines)

            const BusStopCode = require('./models/Test');
            exports.BusStopCode= (req, res) => {
                let trial=[
                    new BusStopCode(StopCode, StopName)
                ]
                res.render('postcodeView',{
                    postcode: userPostcode,
                    busStopCode: StopCode,
                    busStopName: StopName, 
                    presentBusLines})}
            
            }

        }
    busTimeRequest.send();
    }    



module.exports = regexPostcodeCheck;



function BusTimesForStop(busStopCode, busStopName, res, userPostcode){
    const busTimeRequest = new XMLHttpRequest();
    const busTimeUrl = `https://transportapi.com/v3/uk/bus/stop/${busStopCode}/live.json?app_id=429d2986&app_key=31d8fbe68ead7b9abe6ea4720cbc9441&group=route&nextbuses=yes`

    busTimeRequest.responseType = 'json';
    busTimeRequest.open('GET', busTimeUrl);
    busTimeRequest.onreadystatechange = () => {

        if (busTimeRequest.readyState === 4) {
            let busTimeResponse = JSON.parse(busTimeRequest.responseText);

            let presentBusLines = Object.getOwnPropertyNames(busTimeResponse.departures); //this is an array of string
            console.log(`The active bus lines at ${busStopName} are:`, presentBusLines);
            

            if (presentBusLines.length == 0) {
                console.log(`There are no available bus lines at ${busStopName}.`)
            }

            for (let i = 0; i < presentBusLines.length; i++) {
                let lineDepartures = []
                let nextDepartures = []
                lineDepartures.push(busTimeResponse.departures[presentBusLines[i]])
                //console.log('Line Depatures:', lineDepartures)
                //console.log('TEST 1====',lineDepartures[0][0].expected_departure_time)
                //console.log('TEST 2====',lineDepartures[0][1].expected_departure_time)
                //console.log('TEST 3====',lineDepartures[0][2].expected_departure_time)
                //console.log('test', lineDepartures[0])
                //console.log('BEEP',lineDepartures.length)
                
                for (let j = 0; j < lineDepartures[0].length; j++) {
                    nextDepartures.push(lineDepartures[0][j].expected_departure_time)
                    //console.log('NEXT DEP:', nextDepartures)
                }

                if (nextDepartures.length == 0 || nextDepartures[0]==null) {
                    console.log(`There is no expected departures for the ${presentBusLines[i]} line at ${busStopName}.`)
                }

                else {
                    console.log(`The next departure times for the ${presentBusLines[i]} line at ${busStopName} are ${nextDepartures}.`)
                    
                }

            }

        }
    }


    busTimeRequest.send();

}

*/
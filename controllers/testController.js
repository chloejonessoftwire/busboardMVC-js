const BusClass = require('../models/Test');
const BusStopCode = require("../models/Test")
const regexPostcodeCheck = require('../busBoard_chloe');
const { response } = require('express');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

exports.getTestData = (req, res) => {
	let data=[
		new Test('other name', 15)
	]
		
		res.render('testView', {
			data : data,
})};


exports.getPostcodeData = (req, res) => {
	let userPostcode=  req.params.postcode

	//res.render("postcodeView", {
	//postcode : postcode}) //left is egs file, right is let postcode

	
	getStopPointFromPostcode(userPostcode)


    function getStopPointFromPostcode(postcode) {
        console.log('get stop points from postcode is runnning...')

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
        console.log('get stop points from long,lat is runnning...')
        let url = `https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&lat=${longLat.latitude}&lon=${longLat.longitude}`
        var request = new XMLHttpRequest()
        request.open('GET', url, true)
        console.log(request.readyState)
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                console.log(request.readyState)
                console.log(request.responseText)
                let stopPointData = JSON.parse(request.responseText)
                console.log('HELLOOOOO', stopPointData)
                // If there is at least one stop point get the arrivals for that stop point
                console.log(stopPointData.stopPoints)
                if(stopPointData.stopPoints.length > 0) {
                    getArrivalsForStopPoint(stopPointData.stopPoints[0].id)
                }
                
            }
        }
        request.send()
    }

function getArrivalsForStopPoint(stopPoint) {
	console.log('get arrivals  from stop points is runnning...')
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
	console.log('sort data is running')
    // Map the array of objects to a new array of objects with only the information we want
    let reducedBuses = buses.map(bus =>  { return { time: bus.timeToStation, line: bus.lineName, route: bus.towards }})

    // Sort the array of objects in order of their time value
    let sortedReducedBuses = reducedBuses.sort(function(a,b) {
        if (a.time < b.time) return -1
        else return 1
    })

    // Get the first 5 objects from the array
    let next5Buses = sortedReducedBuses.slice(0,5)
    console.log(next5Buses)
    // Print some information to the user to the console about each bus
    let busArray= next5Buses.map(bus=>{
		return new BusClass (bus.time, bus.line, bus.route)
    });
    console.log(busArray)
	res.render("postcodeView", {
		postcode:userPostcode,
		busArray: busArray
	})
}

}
	
 /*
exports.getTestData = (req, res) => {
	let data=[
		new Test('other name', 15)
	]
		
		res.render('testView', {
			data : data,
})};
*/

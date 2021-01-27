class BusClass{
	constructor(timeToStation, lineName, towards){
		this.timeToStation=timeToStation
		this.lineName=lineName;
		this.towards=towards; 
	}
	showBuses(){
		return 'The ' + this.lineName + ' line is ' +this.timeToStation +' seconds away and is heading towards '+ this.towards +'.'; 
	}; 
}
module.exports=BusClass;  
/*
class Test{
	constructor(name, id) {
		this.name = name;
		this.id = id;
	}

	showTestData() {
		return this.name + ", id: " + this.id; 
	};

	editName(newName) {
		this.name = newName
	}
};

module.exports = Test;
/*
class BusStopCode{
	constructor(busStopCode, busStopName){
		this.busStopCode= stopCode;
		this.busStopName= stopName;
	}
	showBusStopCodeandName(){
		return 'The nearest stop is:' + this.stopName + '(ATCO code:' +this.stopCode +')'; 
	}; 
}
module.exports=BusStopCode; 
*/

	// class PostcodeClass{

	// 	constructor(input){
	// 		this.input=input
	// 	}
	// 	showPostCode(){
	// 		return this.input +"working"
	// 	}

	// };
	// module.exports=PostcodeClass
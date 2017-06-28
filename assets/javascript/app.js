//Let's pseudocode this bitch
  var name = "";
  var destination = "";
  var firstTrain = "";
  var frequency = "";
//create variable to link database
var database = firebase.database();

//on click of submit button, run function to grab input from HTML and push it to the cloud 
$('#submit').on('click', function (event){
	//prevent default functions of button
	event.preventDefault();
	//create variables to store the input pulled from the HTML
	name = $('#name').val();
	destination = $('#destination').val();
	firstTrain = $('#first-train-time').val();
	frequency = $('#frequency').val();
	//push the new variables to the cloud 
	database.ref('trains').push({
		name: name,
		destination: destination, 
		firstTrain: firstTrain,
		frequency: frequency
	});
});

//pull that information from the cloud and show it on HTML train schedule "train-entries" table
//every time a child is added, run the function snapshot
database.ref('trains').on("child_added", function (snapshot){
	//create an HTML row to put all the new user entry components in 
	var userEntry = $('<tr>');
	//create new variable to pull the value of the key/value from the Firebase snapshot
	//so why is .name after the val function and which "name" are they referring to? key or value?
	var userEntryName = snapshot.val().name;
	var userEntryDestination = snapshot.val().destination;
	var userEntryFrequency = Number(snapshot.val().frequency);
	//append the information pulled from the cloud to the new HTML row created above
	userEntry.append("<td>" + userEntryName + "</td>");
	userEntry.append("<td>" + userEntryDestination + "</td>");
	userEntry.append("<td>" + userEntryFrequency + "</td>");
	//append all of the user entries to the "train-entries" div
	$('#train-entries').append(userEntry);
	
	//split the hours and minutes in the first train arrival
	var timeValues = snapshot.val().firstTrain.split(':');
	//create variables for hours and minutes
	var firstHours = timeValues[0];
	var firstMinutes = timeValues[1];
	//convert the hours to minutes 
	var firstDeparture = (firstHours * 60) + firstMinutes;
	//need variables for current hour 
	var currentHour = moment().format('H');
	//need variable for current minute
	var currentMinute = moment().format('mm');
	//convert hours to minutes
	var current = (currentHour * 60) + currentMinute;
	//find the difference between time now and time of first departure
	var difference = current - firstDeparture;
	//how many trains have left since first departure?
	var numberOfTrains = difference % userEntryFrequency;
	//
	var minutesAway = userEntryFrequency - numberOfTrains;
	//convert minutes back to hours and minutes
	var arrivalTime = moment().add(minutesAway,'minutes').format('HH:mm');

	userEntry.append('<td>' + arrivalTime + '<td>');
	userEntry.append('<td>' + minutesAway + '<td>');
});
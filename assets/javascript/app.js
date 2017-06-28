//Let's pseudocode this bitch

//link to firebase to store our information in the cloud
var config = {
    apiKey: "AIzaSyCAAfKUXwlHvahVD_aofhSMY039Gfih5SM",
    authDomain: "ride-my-train.firebaseapp.com",
    databaseURL: "https://ride-my-train.firebaseio.com",
    projectId: "ride-my-train",
    storageBucket: "ride-my-train.appspot.com",
    messagingSenderId: "996533521208"
  };
  firebase.initializeApp(config);
//create variable to link database
var database = firebase.database();

//on click of submit button, run function to grab input from HTML and push it to the cloud 
$('#submit').on('click', function (event){
	//prevent default functions of button
	event.preventDefault();
	//create variables to store the input pulled from the HTML
	var name = $('#name').val();
	var destination = $('#destination').val();
	var firstTrain = $('#first-train-time').val();
	var frequency = $('#frequency').val();
	//push the new variables to the cloud 
	database.ref().push({
		name: name,
		destination: destination, 
		firstTrain: firstTrain,
		frequency: frequency
	});
});

//pull that information from the cloud and show it on HTML train schedule "train-entries" table
//every time a child is added, run the function snapshot
database.ref().on("child_added", function (snapshot){
	//create an HTML row to put all the new user entry components in 
	var userEntry = $('<tr>');
	//create new variable to pull the value of the key/value from the Firebase snapshot
	//so why is .name after the val function and which "name" are they referring to? key or value?
	var userEntryName = snapshot.val().name;
	var userEntryDestination = snapshot.val().destination;
	var userEntryFrequency = snapshot.val().frequency;
	//append the information pulled from the cloud to the new HTML row created above
	userEntry.append("<td>" + userEntryName + "</td>");
	userEntry.append("<td>" + userEntryDestination + "</td>");
	userEntry.append("<td>" + userEntryFrequency + "</td>");
	//append all of the user entries to the "train-entries" div
	$('#train-entries').append(userEntry);
});

//need a variable for current time 
// var currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
// console.log(currentTime);

	var currentTime = moment().format();
    var format = "MM/DD/YYYY";
    var convertedDate = moment(currentTime, format);
    console.log(convertedDate)

//next arrival is first arrival + frequency until it reaches current time
//minutes away is next arrival - current time 
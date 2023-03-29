/*Evelyn 7.0 
A nonesensical bot that spews out random quotes. The quotes are created from a combination of quotes (sourced from IMDb) spoken by film characters portrayed by Michelle Yeoh.

Adapted from "Markov Bot Learns From User DATABASE" example and the "Markov Bot with Multiple Models & Speech (Neo + Dorothy + Hybrid)" sketch by Carrie Wang
*/

let rm;
let response = "";
let inputField, generateBttn;
let bgPhoto

let database, ref; //for firebase stuff

let myVoice = new p5.Speech();
myVoice.interrupt = true;

function preload(){
  bgPhoto = loadImage("michelle_bg.jpeg");
}

function setup() {
    print(myVoice.listVoices());
  createCanvas(windowWidth, windowHeight);

  //input field
  inputField = createInput("");
  inputField.size(width / 2, 40);
  inputField.position(width / 2 - inputField.width / 2, height / 2);

  //button to generate text
  generateBttn = createButton("SEND");
  generateBttn.size(100, 50);
  generateBttn.position(
    width / 2 - generateBttn.width / 2,
    height / 1.25 - generateBttn.height / 2
  );
  configureFirebase(); //the function that contains all the config code for firebase
  database = firebase.database(); //create an instance of the firebase database
  ref = database.ref("userLines"); //reference path
  generateBttn.mousePressed(sendAndGen); //send the line to database and generate a line
  ref.on("value", gotData);

  textAlign(CENTER);
  rectMode(CENTER);
  fill(255);
  rm = RiTa.markov(3);
}
function keyPressed() {
  if (keyCode === ENTER) {
    sendAndGen(); //make the enter key work as an alternative to execute the "sendAndGen" function
  }
}
function draw() {
  background(bgPhoto);
  textSize(25);
  text(
    "I'm Evelyn 7.0. Talk to me.",
    width / 2,
    height / 8,
    width - 20
  );
 
  textSize(30);
  text(response, width / 2, height - height / 1.45, width - 20);
}

//send data and generate one line
function sendAndGen() {
  if (inputField.value()) {
    let msg = inputField.value();
    //ref.push(msg);
    response = rm.generate(1, { temperature: 30 });
    
      myVoice.setVoice("Fiona");
  myVoice.speak(response);
    
    inputField.value(""); //clear the input field after submitting
  }
}
//get data from firebase
function gotData(data) {
  let incomingData = data.val(); // val() returns an object with all the data
  let keys = Object.keys(incomingData); // Object.keys return an array of unique keys
  rm = RiTa.markov(3); //clear/restart the model before adding all incoming lines again to avoid duplicates
  for (let i = 0; i < keys.length; i++) {
    let incomingLine = incomingData[keys[i]];
    rm.addText(incomingLine);
    print("-------\n" + incomingLine);
  }
  print(rm.size()); //check the size of the markov model
}

function configureFirebase() {

  const firebaseConfig = {
    apiKey: "AIzaSyDeCOK7EdteMQgVPZeSUwNR6YCobeSzMfA",
    authDomain: "markovchatbot-fddc4.firebaseapp.com",
    databaseURL: "https://markovchatbot-fddc4-default-rtdb.firebaseio.com",
    projectId: "markovchatbot-fddc4",
    storageBucket: "markovchatbot-fddc4.appspot.com",
    messagingSenderId: "972991650993",
    appId: "1:972991650993:web:2e1b30c62321e2f3669690",
  };
  
  firebase.initializeApp(firebaseConfig);
}

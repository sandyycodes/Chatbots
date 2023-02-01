//json - javascript object notation
//used to store data and transfer it

let data; // var for json data
let inputField; // user input field
let sendBtn; //btn to send input to the bot

let ans = ""; //chatbot's output 

function preload(){
  data = loadJSON("bot.json"); // load json
}

function setup() {
  createCanvas(400, 400);
  console.log(data);
  
  inputField = createInput("");
  inputField.size(width/2, 40);
  inputField.position(width/4, height/4);
  sendBtn = createButton("SEND")
  sendBtn.size(100, 30);
  sendBtn.position(width/4, height/4 + 50)
  
  sendBtn.mousePressed(answerMe); //when btn is pressed, callback function will be triggered
}

function answerMe(){
  //get input from user -- in the input field once btn is clicked 
  
  let inputStr = inputField.value();
  inputStr = inputStr.toLowerCase();
  console.log(inputStr);
  
  //loop through brain array and through each triggers array
    //if there is a match, select randomly from corresponding responses array
  //break out of the loop 
  loop1: for(let i = 0; i < data.brain.length; i++){
    loop2: for(let j = 0; j < data.brain[i].triggers.length; j++){
     if(inputStr.indexOf(data.brain[i].triggers[j]) !== -1){
       ans = random(data.brain[i].responses);
       break loop1;
     }
      else{
        ans = random(data.catchall);
      }
    }
  }

}

function draw() {
  background(220);
  textAlign(CENTER);
  text(ans, width/2, height/2);
  
}
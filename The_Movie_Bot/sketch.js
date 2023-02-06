/* Chatbots for Art's Sake - Sandy Tan - Creative Assignment #1
 
 A iMessage stylized chatbot that mimics the way I text with friends. 
 The topic matter of this chatbot is my favorite movies and TV shows. 

Adapted from "JSON chatbot optimized" by Carrie Wang - https://editor.p5js.org/re7l/sketches/Q0QjWZ_yz

*/

let bgImg;
let data; //variable for json data
let inp; //variable for input field
let sendBttn; //variable for send button
let answer = ""; //variable for the answer from the chatbot

//load the JSON file
function preload() {
  data = loadJSON("chatbots.json");
}
function setup() {
  createCanvas(500, 570);
  
  bgImg = loadImage('sandyBot.png');
  //input field
  inp = createInput("");
  inp.size(width / 2, 40);
  inp.position(width / 3, height/1.1);
  //button to send input
  sendBttn = createButton("⬆");
  sendBttn.style('background-color', '#0076FF');
  sendBttn.size(50, 46);
  sendBttn.position(width/1.12, height/1.1);
  sendBttn.mousePressed(answerMe); //callback to let the chatbot respond
  textAlign(CENTER);
  rectMode(CENTER);
  console.log(data);
}
function keyPressed(){
  if(keyCode===ENTER){
    answerMe(); //let the chatbot respond when enter key pressed
  }
}

function draw() {
  background(bgImg);
  fill("black");
  textSize(20);
  //text("Ask me about the class Chatbots for Art's Sake", width / 2, 50);

  //display the answer from the chatbot
  fill("black");
  text(answer, width/2, height/2);
}

function answerMe() {
  //prepare the input string for analysis
  let inputStr = inp.value();
  inputStr = inputStr.toLowerCase();

  //loop through the answers array and match responses to triggers
  loop1: for (let i = 0; i < data.brain.length; i++) {
    loop2: for (let j = 0; j < data.brain[i].triggers.length; j++) {
      if (inputStr.indexOf(data.brain[i].triggers[j]) !== -1) {
        answer = random(data.brain[i].responses);
        break loop1; //break out of the loop once a match is found to prevent the program to keep looping to the last group
      } else {
        answer = random(data.catchall);
      }
    }
  }
  inp.value("");//clears the input field once an answer occurs
}

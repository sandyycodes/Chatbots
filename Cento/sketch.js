let caesarText, sirGtext, whitmanText;
let rm;
let response = "";
let generateBttn;
let generateVal;
let countSpace;
let txtWidth, xPos, yPos;
let r, g, b, opacity;
let tempYpos;
let caveat;
let courier;
let chatbotOn;
let instruct;
let showInstruct;
let count4;
let poem = [];
let runCount;
let cTime; //current time
let generateCounter;
let botRecOn;
let listenText;
let poemDiv;
let poemContent;
let talkBtnCount;
let showPoem;
let viewBtnCount;
let textHeight;
// let resetBttn;

let botVoice = new p5.Speech();
let myRec = new p5.SpeechRec();

let bot = new RiveScript(); //new bot
let submitBttn;
// let inputField;
let responses = [];

// variable to hold an instance of the p5.webserial library:
const serial = new p5.WebSerial();

// port chooser button:
let portButton;

// CUSTOMIZE: change/add variable for incoming serial data:
var btn0 = 0; //button not turned on
var btn1 = 0; //button not turned on
var btn2 = 0; //button not turned on
var btn3 = 0; //button not turned on
var btn4 = 0;

function preload() {
  caveat = loadFont("Caveat-SemiBold.ttf");
  courier = loadFont("cour.ttf");
  caesarText = loadStrings("Caesar.txt");
  sirGtext = loadStrings("SirGawayne.txt");
  whitmanText = loadStrings("Whitman.txt");

  bot.loadFile("bot.txt").then(loaded).catch(error);
}

function serialSetup() {
  // check to see if serial is available:
  // if (!navigator.serial) {
  //   alert("WebSerial is not supported in this browser. Try Chrome or MS Edge.");
  // } else {
  //   alert("WebSerial is supported. Enjoy!");
  // }
  // // check to see if serial is available:
  // if (!navigator.serial) {
  //   alert("WebSerial is not supported in this browser. Try Chrome or MS Edge.");
  // }
  // check for any ports that are available:
  serial.getPorts();
  // if there's no port chosen, choose one:
  serial.on("noport", makePortButton);
  // open whatever port is available:
  serial.on("portavailable", openPort);
  // handle serial errors:
  serial.on("requesterror", portError);
  // handle any incoming serial data:
  serial.on("data", serialEvent);
  serial.on("close", makePortButton);

  // add serial connect/disconnect listeners from WebSerial API:
  navigator.serial.addEventListener("connect", portConnect);
  navigator.serial.addEventListener("disconnect", portDisconnect);
}

function setup() {
  serialSetup();

  chatbotOn = true;

  showInstruct = false;

  count4 = 0;

  runCount = 0;

  generateCounter = 0;

  botRecOn = false;

  poemContent = "";

  showPoem = false;

  listenText = "LISTENING...";

  talkBtnCount = 0;

  viewBtnCount = 0;

  createCanvas(windowWidth, windowHeight);

  botVoice.setVoice("Samantha");
  botVoice.interrupt = true;

  txtWidth = width - 20;
  xPos = width / 2;
  yPos = height - height / 1.5;

  r = 255;
  g = 255;
  b = 255;

  countSpace = 0;
  generateVal = 1;

  //markov model
  rm = RiTa.markov(2);
  rm.addText("You too as a lone bark cleaving the ether,");
  rm.addText("purpos’d I know not whither, yet ever full of faith");
  //rm.addText(whitmanText);
  //rm.addText(caesarText);
  //rm.addText(sirGtext);

  textAlign(CENTER);
  fill(0);
  rectMode(CENTER);

  responses.push("Click the TALK button once and say 'hello' to start.");
}

// if there's no port selected,
// make a port select button appear:
function makePortButton() {
  // create and position a port chooser button:
  portButton = createButton("choose port");
  portButton.position(10, 10);
  // give the port button a mousepressed handler:
  portButton.mousePressed(choosePort);
}

// make the port selector window appear:
function choosePort() {
  if (portButton) portButton.show();
  serial.requestPort();
}

// open the selected port, and make the port
// button invisible:
function openPort() {
  // wait for the serial.open promise to return,
  // then call the initiateSerial function
  let options = { baudrate: 9600 };
  serial.open().then(initiateSerial);

  // once the port opens, let the user know:
  function initiateSerial() {
    console.log("port open");
  }
  // hide the port button once a port is chosen:
  if (portButton) portButton.hide();
}

// pop up an alert if there's a port error:
function portError(err) {
  alert("Serial port error: " + err);
}

function startRec() {
  myRec.start();
  listening = true;
  botRecOn = true;
  console.log("listening...");
  myRec.onEnd = function ended() {
    listening = false;
    botRecOn = false;
    console.log("not listening");
  };
  myRec.onResult = chat;
}

// read any incoming data as a string
// (assumes a newline at the end of it):
function serialEvent() {
  var stringFromSerial = serial.readLine(); // reads everything till the new line charecter
  if (stringFromSerial != null) {
    //console.log(stringFromSerial);
    if (stringFromSerial.length > 0) {
      var trimmedString = trim(stringFromSerial); // get rid of all white space
      var myArray = split(trimmedString, ","); // splits the string into an array on commas
      //console.log(myArray);

      btn0 = Number(myArray[0]);

      //TALK
      if (btn0 == 1) {
        startRec();
        talkBtnCount++;
        responses.push("");
        showPoem = false;
      }

      //COLORS
      btn1 = Number(myArray[1]);

      if (btn1 == 1) {
        console.log("btn 3 pressed");
        r = random(255);
        g = random(255);
        b = random(255);
        opacity = random(100, 255);
        fill(r, g, b, opacity);

        //showPoem = false;
      }

      //GENERATE - create individual lines
      btn2 = Number(myArray[2]);

      if (btn2 == 1) {
        countSpace++;
        chatbotOn = false;
        listenText = ""; // get rid of listening status on screen
        if (countSpace == 1) {
          responses.push("");
          rm.addText(whitmanText);
          console.log("added Whitman");
        } else if (countSpace == 2) {
          rm.addText(sirGtext);
          console.log("added SirG");
        } else if (countSpace == 3) {
          rm.addText(caesarText);
          console.log("added Caesar");
        }

        talkToMe();
        botVoice.speak(response);

        showInstruct = false;

        poem.push(response); //collect the generated lines into poem array

        //don't show poem if generate is pressed
        showPoem = false;
      }

      //POSITION
      btn3 = Number(myArray[3]);
      if (btn3 == 1) {
        console.log("btn 4 clicked");
        txtWidth = width - 20;
        xPos = random(width);
        yPos = random(50, height / 1.2);
        //showPoem = false;
      }

      //VIEW POEM
      btn4 = Number(myArray[4]);
      if (btn4 == 1) {
        //console.log(poem);
        //console.log(generateCounter);
        viewBtnCount++;

        showInstruct = false;
        responses.push("");

        showPoem = true;

        createPoemFile();
      }
    }
  }
}
// try to connect if a new serial port
// gets added (i.e. plugged in via USB):
function portConnect() {
  console.log("port connected");
  serial.getPorts();
}

// if a port is disconnected:
function portDisconnect() {
  serial.close();
  console.log("port disconnected");
}

function closePort() {
  serial.close();
}

function talkToMe() {
  response = rm.generate(generateVal, { temperature: 60 });
}

function keyPressed() {
  if (keyCode === ENTER) {
    chat();
    //inputField.value("");
  }

  //4 key to hide chatbot elements
  if (keyCode == 52) {
    count4++; //counts amount of times key 4 is clicked
    chatbotOn = false;
    showInstruct = true;
  }

  //1 key
  if (keyCode == 49) {
    //add random text highlight color with click
    r = random(255);
    g = random(255);
    b = random(255);
    opacity = random(100, 255);
    fill(r, g, b, opacity);
  }

  //2 key
  //add the text to markov in beginning 3 clicks
  if (keyCode == 50) {
    //clear responses array to get rid of instructions

    countSpace++;
    if (countSpace == 1) {
      rm.addText(whitmanText);
      console.log("added Whitman");
    } else if (countSpace == 2) {
      rm.addText(sirGtext);
      console.log("added SirG");
    } else if (countSpace == 3) {
      rm.addText(caesarText);
      console.log("added Caesar");
    }

    talkToMe();
    botVoice.speak(response);

    showInstruct = false;

    poem.push(response); //collect the generated lines into poem array
  }

  //3 key
  //randomize the position of the words with each click
  if (keyCode == 51) {
    txtWidth = width - 20;
    xPos = random(width);
    yPos = random(height);
  }
}

function chatbot() {
  textSize(25);

  for (let i = 0; i < responses.length; i++) {
    //fill(0);
    textFont(courier);
    text(responses[i], width / 2, height / 2.5, width / 1.5);
    if (height / 3 + i * 60 + 50 > height / 3 + 100) {
      responses.splice(0, 1);
    }
  }
}

function draw() {
  //console.log(runCount);
  //console.log("talk: " + talkBtnCount);
  //console.log(responses);

  background(255);
  textSize(80);
  textFont(caveat);
  text("Cento", width / 2, height / 6, width - width / 4);

  //showChatbot();
  textSize(24);
  textFont(courier);

  //if talk is on or view poem btn is on, don't display the lines
  if (btn0 == 1 || btn4 == 1) {
    response = "";
  }
  text(response, xPos, yPos, txtWidth);

  if (countSpace % 5 == 0) {
    for (i = 0; i < 5; i++) {
      tempYpos = yPos + 15 * i;
      tempXpos = xPos + random(5 * i);
      text(response, tempXpos, tempYpos, txtWidth);
    }
  }
  if (countSpace % 9 == 0) {
    textSize(100);
    text(response, xPos, yPos, txtWidth);
  }

  if (countSpace % 13 == 0) {
    for (i = 0; i < 10; i++) {
      textSize(50);
      tempYpos = yPos + 5 * i;
      tempXpos = xPos + random(10 * i);
      text(response, tempXpos, tempYpos, txtWidth);
    }
  }

  if (countSpace % 17 == 0) {
    for (i = 0; i < 50; i++) {
      textSize(random(80));
      tempYpos = random(0, height);
      tempXpos = random(0, width);
      text(response, tempXpos, tempYpos, txtWidth);
    }
  }

  chatbot();

  if (botRecOn == false) {
    listenText = "Listening Status: NOT LISTENING";
  } else {
    listenText = "Listening Status: LISTENING...";
  }

  text(listenText, width / 6, 35);

  //If view poem btn is clicked, show the whole poem

  if (showPoem) {
    text(
      "**********The full version of your awesome poem has been dowloaded**********",
      width / 2,
      height / 4,
      width
    );
    for (i = 0; i < poem.length; i++) {
      textHeight = height / 3 + 35 * i;
      if (textHeight >= height / 1.08) {
        break;
      }

      text(poem[i], width / 2, height / 3 + 35 * i, width);
    }
  }
}

function createPoemFile() {
  // creates a file called 'yourAwesomePoem.txt'
  let writer = createWriter("yourAwesomePoem.txt");
  // write the full poem to the file
  for (i = 0; i < poem.length; i++) {
    writer.write(poem[i] + "\n");
  }
  // close the PrintWriter and save the file
  writer.close();
}

function chat() {
  let input = myRec.resultString;
  console.log(input);
  bot.reply("local-user", input).then(respond);
}
function respond(reply) {
  responses.push(reply);
  botVoice.speak(reply);
  //responses[0] = reply;
}
function loaded() {
  console.log("Chatbot ready!");
  bot.sortReplies(); //You must sort the replies before trying to fetch any!
}
function error(error) {
  console.log("There is an error.");
  console.log(error);
}

$(document).ready( function() {
  var images = [];
  var openedPics = [];
  var compPics = []
  var states = [1,1,1,1,1,1,1,1,1,1];
  var pairs = 0;
  var lives = 4;
  var strikes = 0;
  var seconds = 0;
  var loadstate = 0;
  var activeEventlisteners = [1,1,1,1,1,1,1,1,1,1];
  var timer;
  var modal = document.getElementById('myModal');
  var msg =  {
    messageType: "SETTING",
    options: {
      "width": 800, //Integer
      "height": 650 //Integer
      }
  };
  window.parent.postMessage(msg, "*");


  $("#newGame").click( function () {
    loadstate = 0;
    clearInterval(timer);
    startGame();
  });

  $("#save").click( function () {
    var msg = {
      "messageType": "SAVE",
      "gameState": {
        "images": images,
        "openedPics": openedPics,
        "states": states,
        "pairs": pairs,
        "lives": lives,
        "strikes": strikes,
        "seconds": seconds,
        "activeEventlisteners": activeEventlisteners
      }
    };
	obj = JSON.parse(JSON.stringify(msg));
    window.parent.postMessage(obj, "*");

  });

  $("#submitScore").click( function () {
    var msg = {
      "messageType": "SCORE",
      "score": seconds
    };
    window.parent.postMessage(msg, "*");

  });

  $("#load").click( function () {
    var msg = {
      "messageType": "LOAD_REQUEST",
    };
    window.parent.postMessage(msg, "*");
  });

  window.addEventListener("message", function(evt) {
    if(evt.data.messageType === "LOAD") {
      images = evt.data.gameState.images;
      openedPics = evt.data.gameState.openedPics;
      states = evt.data.gameState.states;
      pairs = evt.data.gameState.pairs;
      lives = evt.data.gameState.lives;
      strikes = evt.data.gameState.strikes;
      seconds = evt.data.gameState.seconds;
      activeEventlisteners = evt.data.gameState.activeEventlisteners;
      document.getElementById("lives").innerHTML = lives;
      document.getElementById("strikes").innerHTML = strikes;
      document.getElementById('timer').innerHTML = seconds;
      loadstate = 1;
      startGame();

    } else if (evt.data.messageType === "ERROR") {
      alert(evt.data.info);
    }
  });


  function startGame(){
    document.getElementById("0").src = "img11.png"
    document.getElementById("1").src = "img11.png"
    document.getElementById("2").src = "img11.png"
    document.getElementById("3").src = "img11.png"
    document.getElementById("4").src = "img11.png"
    document.getElementById("5").src = "img11.png"
    document.getElementById("6").src = "img11.png"
    document.getElementById("7").src = "img11.png"
    document.getElementById("8").src = "img11.png"
    document.getElementById("9").src = "img11.png"
    modal.style.display = "none";
    timer = setInterval(function() {
        document.getElementById('timer').innerHTML = ++seconds;
    }, 1000);
    if (loadstate == 0){
      for(var i = 0; i < 10; i++){
        images[i] = new Image();
      }
      images[0].src = 'img.png';
      images[1].src = 'img2.jpg';
      images[2].src = 'img3.jpg';
      images[3].src = 'img4.jpg';
      images[4].src = 'img5.jpg';
      images[5].src = 'img.png';
      images[6].src = 'img2.jpg';
      images[7].src = 'img3.jpg';
      images[8].src = 'img4.jpg';
      images[9].src = 'img5.jpg';
      shuffled = shuffle(images);
      openedPics = [];
      compPics = []
      states = [1,1,1,1,1,1,1,1,1,1];
      pairs = 0;
      lives = 4;
      strikes = 0;
      seconds = 0;
      loadstate = 0;
      activeEventlisteners = [1,1,1,1,1,1,1,1,1,1];
      document.getElementById("lives").innerHTML = 4;
      document.getElementById("strikes").innerHTML = 0;
    }
    var childrens = document.getElementById("grid-container").children;
    for(var j = 0; j < childrens.length; j++){
      if (activeEventlisteners[j] != 0){
        childrens[j].addEventListener("click", open);
      }
    }
  }
  // Fisher-Yates (aka Knuth) Shuffle.
  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  function open(){
    openedPics.push(this);
    compPics.push(images[this.id].src);
    if(openedPics.length <= 2){
      if(compPics[0] == compPics[1] && openedPics[0].id != openedPics[1].id){
        match();
      }
      if(states[this.id] == 1){
        this.src = images[this.id].src;
        states[this.id] = 0;
      }
      else{
        this.src = 'img11.png';
        states[this.id] = 1;
      }
    }
    else{
      nomatch();
    }
  }

  function nomatch(){
    lives = lives -1;
    strikes = 0;
    if(lives == 0){
      document.getElementById("popupText").innerHTML = "You lost the game!";
      document.getElementById("notice").innerHTML = "Next time is your chance!"
      document.getElementById("time").innerHTML = ".";
      endGame();
    }
    document.getElementById("lives").innerHTML = lives;
    document.getElementById("strikes").innerHTML = 0;
    openedPics[0].src = "img11.png";
    openedPics[1].src = "img11.png";
    states[openedPics[0].id] = 1;
    states[openedPics[1].id] = 1;
    openedPics = [];
    compPics = [];
  }

  function match(){
    strikes = strikes + 1;
    ++pairs;
    if (strikes%2 == 0){
      lives = lives + 1;
    }
    if (pairs == 5){
      document.getElementById("popupText").innerHTML = "You won the game!";
      if (seconds >= 20){
        document.getElementById("notice").innerHTML = "You can do better!"
      }
      else{
        document.getElementById("notice").innerHTML = "You did well!"
      }
      document.getElementById("time").innerHTML = "You did it in " + seconds +" seconds";
      endGame();
    }
    document.getElementById("strikes").innerHTML = strikes;
    document.getElementById("lives").innerHTML = lives;
    openedPics[0].removeEventListener("click", open);
    openedPics[1].removeEventListener("click", open);
    activeEventlisteners[openedPics[0].id] = 0;
    activeEventlisteners[openedPics[1].id] = 0;
    openedPics = [];
    compPics = [];
  }

  function endGame(){
    myModal.style.display = "block";
    clearInterval(timer);
  }
});
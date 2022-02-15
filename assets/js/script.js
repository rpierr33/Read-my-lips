//Get Elements by ID here (!!!DO NOT USE ANYTHING BUT GET BY UNIQUE ID NO CLASS SELECTOR NO ELEMENT SELECTORS NO QUERY SELECTORS!!!)
var timerEl = document.getElementById('timerEl');

//Global vars here
var score = 0;
var timeleft = 90;
var RMLGameScoresArr = [];
var RMLGameScoreObj = {};
var gameMode = null;

//function on start game clicked
var startGame = function() {
    // console.log('shit');
    //reset score to zero
    score = 0 ;
    // console.log(score);
    //reset time left
    timeleft = 90;
    //changes page to show choose elements for choose path and hide all others
    $('.cardContainer').removeClass('hide')
    $('#instructions').addClass('hide')
    //two event listeners for choosing facebook or twitter path as well as stating the associated funtions below and starting timer
    $('#getJoke').on('click',JokePath)
    $('#giphy').on('click',giphyPath)
};
    
//timer function coundown to call end game once timer reaches zero and send user to score save
var timerCountdown = function() {
     
        //use the 'setInterval()' to call a function to be executed every 1000 milliseconds
        var timeInterval = setInterval(function() {
     
        //  console.log(timeleft)
            //As long as the 'timeleft' is greater than 1
            if (timeleft > 1) {
                //Set the 'textContent' of the 'timerEl' to show the remaining seconds
                timerEl.textContent = timeleft + ' seconds remaining';
                //Decrement 'timeleft' by 1
                timeleft--;
     
            }else if (timeleft ===1) {
                //When ttimeleftime left is equal to 1, rename to 'second' instead of seconds
                timerEl.textContent = timeleft + ' second remaining';
                timeleft--;
            } else {
                //Once 'timeLeft' gets to 0, set 'timerEl' to an empty string
                timerEl.textContent = '';
                //Use 'clearInterval()' to stop the timer
                clearInterval(timeInterval);
                //Call the 'displayMessage() function
                displayScore();
            }
     
        }, 1000);
};

//function to start Jokepath that changes page to show joke posts to be read
var JokePath = function() {
    gameMode = 'jokes';
    //game elements show/other elements hide
    $('#jokeParentEl').addClass('hide')
    $('#gamePageParEl').removeClass('hide')
    timerEl.classList.remove("hide")
    //event listener to grab click from correct button, and increase final score by one,and re-run the GetJokeApi
    //calls the GetJokeApi function
    getJokeApi();
    //calls the timerCountDown function
    timerCountdown();
};

//fetch joke post loop parse and display per each question
async function getJokeApi() {
    const jokeData = await fetch("https://icanhazdadjoke.com/", {
        headers: {
          Accept: "application/json"
        }
      });
    const jokeObj = await jokeData.json();
    const { joke } = jokeObj;
    console.log(joke, '<<< ');
  
//  Takes the value of 'set up' and add that response to the question ID
      document.getElementById('question').innerHTML = joke;
//   Takes the value of 'punchline' and add that response to the answer ID
        // document.getElementById('answer').innerHTML =  JSON.stringify(jokeObj);
}

//function to start giphyPath that changes page to new giphy 
function giphyPath() {
    gameMode = 'giphy';

    console.log('test')
    //game elements show/other elements hide
    $('#jokeParentEl').addClass('hide')
    $('#gamePageParEl').removeClass('hide')
    $('#answer').addClass('hide')
    $('#giphyPic').removeClass('hide')
    timerEl.classList.remove("hide")
    //event listener to grab click from correct button, and increase final score by one, and re-run the GetGiphyApi
    //calls the GetGiphyApi function
    getGiphyApi();
    //calls the timerCountDown function
    timerCountdown();
};

document.getElementById('correctbutton').addEventListener('click', function(){
    score++;
    switch (gameMode) {
        case 'jokes':
            getJokeApi();
            break;
        case 'giphy':
            getGiphyApi();
            break;
        default:
            return;
    }
});
//event listener to grab click from wrong button, and re-run the getGiphyApi
document.getElementById('wrongbutton').addEventListener('click', function(){
            getGiphyApi();
}); 
//fetch giphy loop parse and display per each question
let fig = document.getElementById("gamePageParEl");
let img = document.createElement("img");
let fc = document.createElement("h1");
fc.style.color = 'black';

let APIKEY = "HvaacROi9w5oQCDYHSIk42eiDSIXH3FN";
let animals = ["cat", "dog", "tiger", "monkey", "lyon", "hyena", "lizard", "cow", "pig", "fox", "snake", "frog"];

var getGiphyApi = function() {

    var randomName = Math.floor(Math.random() * animals.length);

    var rand_val = animals[randomName];

    let url = `https://api.giphy.com/v1/gifs/search?api_key=${APIKEY}&limit=1&q=`;
    
    // let str = "rand";
    url = url.concat(rand_val);
    fetch(url)
    .then(response => response.json())
    .then(content => {
      //  data, pagination, meta
      console.log(content.data);
      console.log("META", content.meta);
      img.src = content.data[0].images.downsized.url;
      img.alt = content.data[0].title;
      fc.textContent = content.data[0].title;
      console.log(fc, '<< FC');
      fig.appendChild(fc);
      fig.appendChild(img);
    })
    .catch(err => console.log(err))
}

// Function to display score
var displayScore = function() {
     //game elements show/other elements hide
    $('#gamePageParEl').addClass('hide')
    $('#timesUpEls').removeClass('hide')
    timerEl.classList.add("hide")
    //variable to hold the ID 'highScoreSubmit'
    var inputSubmit =document.getElementById('highScoreSubmit');
    //grab the finalScoreDisplay ID and set its content
    document.getElementById('finalScoreDisplay').textContent =  "Your Final Score is: " + score ;
    // event handler to grab click, before displaying final score
    $('#submitScoreBtn').on('click',function(event) {
    // prevents the browser from refreshing after each click
        event.preventDefault();
        var name = inputSubmit.value;
        console.log(name);
        console.log(score);
        RMLGameScoreObj = {
            name: name,
            value: score
        }
        // call the saveScore function
        saveScores();
        // call the DisplayHighScore function
        displayHighScore();    
    })
};
    
// Function to save score
var saveScores = function() {
        //variable to hold score from local storage
    var currentSavedScores = localStorage.getItem("RMLScores");
        //if statement checks if currentSavedScores has a null value
    if (!currentSavedScores) {
        console.log(RMLGameScoreObj);
        // Adds "RMLGameScoreObj"
        RMLGameScoresArr.push(RMLGameScoreObj); 
        //converts a object or value to JSON string
        localStorage.setItem("RMLScores", JSON.stringify(RMLGameScoresArr)); 
        
        //parses JSON string
    } else {
        currentSavedScores = JSON.parse(currentSavedScores);
        // Adds "RMLGameScoreObj"
        currentSavedScores.push(RMLGameScoreObj);
        //converts a object or value to JSON string
        localStorage.setItem("RMLScores", JSON.stringify(currentSavedScores));
    };
};

// Function to display high score
var displayHighScore = function() {
    //game elements show/other elements hide
    $('#timesUpEls').addClass('hide');
    $('#mainElGroup').addClass('hide');
    $('#highScoreElGroup').removeClass('hide');
    //variable to grab highscore ID
    var scoreList = document.getElementById('highScores');

    //button to go back to start screen
    $('#backToStart').on('click',reset);
    //create score list from local storage
    var createScoreEl = function(savedScoresObj){
        //create li element and set it to ScoreLi variable
        var scoreLi = document.createElement('li');
        console.log(scoreLi)
        //attach ScoreLi variable to list
        scoreList.appendChild(scoreLi);
        //set the Li element attribute
        scoreLi.setAttribute("id", "li");
        scoreLi.setAttribute("value", savedScoresObj.value)
        scoreLi.classList.add("bText");
        scoreLi.innerHTML= savedScoresObj.value + " --- " + savedScoresObj.name + ".";
    };
    //get saved scores from local storage
    var savedScores = localStorage.getItem("RMLScores");
    //if no saved scores in local storage skip
    if (!savedScores) {
        console.log("click1");
        return false;
    }
    console.log("Saved tasks found!");
    savedScores = JSON.parse(savedScores);
    console.log(savedScores);

    for (var i = 0; i < savedScores.length; i++) {
        createScoreEl(savedScores[i]);
    }
    //sort list of high scores from highest to lowest
    var sortList = function() {
        var list, i, switching, b, shouldSwitch;
        list = document.getElementById("highScores");
        switching = true;
        /* Make a loop that will continue until
        no switching has been done: */
        while (switching) {
          // start by saying: no switching is done:
          switching = false;
          b = list.getElementsByTagName("li");
          // Loop through all list-items:
          for (i = 0; i < (b.length - 1); i++) {
            // start by saying there should be no switching:
            shouldSwitch = false;
            /* check if the next item should
            switch place with the current item: */
            if (b[i].value < b[i + 1].value) {
              /* if next item is alphabetically
              lower than current item, mark as a switch
              and break the loop: */
              shouldSwitch = true;
              break;
            }
          }
          if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark the switch as done: */
            b[i].parentNode.insertBefore(b[i + 1], b[i]);
            switching = true;
          }
        }
    };
    sortList();
};

var reset = function() {
    location.reload();
    return false;
}

//StartGame button event listener
$('#begin-btn').on('click',startGame)
//View highscore event listener
$('#viewHighbtn').on('click',displayHighScore)

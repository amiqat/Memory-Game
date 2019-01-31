/*
 * Create a list that holds all of your cards
 */
let cards = ["fa-diamond","fa-diamond",
            "fa-paper-plane-o","fa-paper-plane-o",
            "fa-anchor","fa-anchor",
            "fa-bolt","fa-bolt",
            "fa-cube","fa-cube",
            "fa-leaf","fa-leaf",
            "fa-bicycle","fa-bicycle",
            "fa-bomb","fa-bomb"];

let moves = 0;

function genrateCard(card){
return `<li class="card" data-card=${card}><i class="fa ${card}"></i></li>`;
}
const deck = document.querySelector('.deck');
const moveCounter = document.querySelector('.moves');

const rest = document.querySelector('.restart');
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function initGame(){
    moveCounter.innerText = moves;
    const cardHtml = shuffle(cards).map(function(card){
        return genrateCard(card);
    });
    deck.innerHTML = cardHtml.join('');

}
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

initGame();

attachListener();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
let openedCards = [];
let matchedCards = [];

let isFirstClick = true;

function attachListener(){
    // Card Click Event 
    deck.addEventListener('click',function(ev){
        if(ev.target.matches('.card')){
            if(isFirstClick) {
                // Start timer
                startTimer();
                // Change First Click flag
                isFirstClick = false;
            }
          openCard(ev.target);
        }
    });

    rest.addEventListener('click',function(){
        restart();
    });
}

// Open card function
function openCard(card){
    card.classList.add('show','open','disable');
    openedCards.push(card);

    if(openedCards.length == 2){
        compare();
        addMove();
    }
}

function compare(){
    if(openedCards[0].dataset.card == openedCards[1].dataset.card){
        matchedCards.push(...openedCards);
        openedCards[0].classList.add('match','animated','rubberBand');
        openedCards[1].classList.add('match','animated','rubberBand');
        openedCards = [];
        isGameEnd();
    } else {
        openedCards[0].classList.add('animated','wobble');
        openedCards[1].classList.add('animated','wobble');
        setTimeout(function(){
            openedCards.forEach(function(card){
                card.classList.remove("open", "show", "disable",'animated','wobble');
                
            });
          

            openedCards = [];
        },500);
    }
    
}

function addMove(){
   
    moveCounter.innerHTML = ++moves;

    // Set the rating
    rating();
}


/*
 * Timer
 */
const timer = document.getElementById("timer");

let TimerInterval , Timestamp;


function startTimer(){
    
    let Timestamp = moment().startOf("day");
    TimerInterval =  setInterval(function() {
        Timestamp.add(1, 'second');
        timer.innerHTML = Timestamp.format('mm:ss');
    }, 1000);
  
}

const stars = document.querySelector('.stars').children;
let starCount = 3;
function rating(){
    
    if(moves > 26){
        stars[0].style.display="none";
        starCount--;
    }else if(moves > 18){
        stars[1].style.display="none";
        starCount--;
    }
}

function isGameEnd(){
    if(matchedCards.length === cards.length){
        clearInterval(TimerInterval);
     
        Swal.fire({
            type: 'success',
            title: 'Congratulations! You Won!',
            html: `With ${moves} Moves and ${starCount} Stars and  ${timer.innerHTML} Time <br> Woooooo!`,
            confirmButtonText: 'Play Again',
            confirmButtonColor: '#47deb5'
          }).then(function() {
            restart();
        });
    }
}

function restart(){
    clearInterval(TimerInterval);
    timer.innerHTML = '00:00';
    stars[0].style.display = "inline-block";
    stars[1].style.display = "inline-block";
    isFirstClick = true;
    moves = 0;
    starCount = 3;
    initGame();
}


/*
 * Create a list that holds all of your cards
 */
const myCards=[
  "fa fa-diamond",
  "fa fa-paper-plane-o",
  "fa fa-anchor",
  "fa fa-bolt",
  "fa fa-cube",
  "fa fa-leaf",
  "fa fa-bomb",
  "fa fa-bicycle",
  "fa fa-diamond",
  "fa fa-paper-plane-o",
  "fa fa-anchor",
  "fa fa-bolt",
  "fa fa-cube",
  "fa fa-leaf",
  "fa fa-bomb",
  "fa fa-bicycle"
];

let countTime = 0,
		countMatch = [],
		countMoves = 0,
    countStars = 3;
    timer = new Timer();

// Not very intuitive but works
[...document.querySelectorAll('.restart')].forEach(function (r) {
  r.addEventListener('click', function() {
    event.preventDefault();
    restartGame();
  });
});

document.getElementById('cancel').addEventListener('click', function() {
  event.preventDefault();
  document.getElementById('modal-congrats').style.display = 'none';
});

timer.addEventListener('secondsUpdated', function (e) {
  document.getElementById('timer').innerText = 'Time: ' + timer.getTimeValues().toString();
});

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

function listenCardClick(event) {
  if (countTime === 0) {
    timer.start();
    countTime = 1;
  }

  // Do nothing when the card is flipped or there are already two cards
  // being compared (address the click-when-delay-in-process problem)
  if (event.target.classList.contains('open', 'show') ||
      document.querySelectorAll('.flipped').length === 2) {
    return;
  } else {
    event.target = event.target.classList.add('open', 'show', 'flipped');
    // Pass the id of a card for future match
    countMatch.push(event.target.getAttribute('ident'));
    // Got two cards, compare
    if (countMatch.length === 2) {
      compareMatch(countMatch);
    }
  }

  if (countMoves > 16 && countMoves <= 24 && countStars === 3) {
    countStars--;
    manageStars();
  } else if (countMoves > 24 && countStars != 1) {
    countStars--;
    manageStars();
  }


  // Finish when all cards succesfully flipped (hence, matched)
  if (document.querySelectorAll('.match').length === 16) {
    modal();
  }
}

function setBoard(cards) {
  // Shuffle and hand out the cards
  const cardsShuffled = shuffle(cards);
  const deck = document.getElementById('deck');

  for (let c = 0; c < cardsShuffled.length; c++) {
      let cardsShuffledFaces = cardsShuffled[c].split(" ");
      let cardLi = document.createElement('li');
      cardLi.classList.add('card');
      cardLi.setAttribute('ident', c);
      let face = document.createElement('i');
      face.classList.add(cardsShuffledFaces[0], cardsShuffledFaces[1]);

      cardLi.addEventListener('click', listenCardClick);
      cardLi.appendChild(face);
      deck.appendChild(cardLi);
  }
  // Populate stars
  manageStars();
}

function compareMatch(cards) {
  // Access li's i children with specific li's ident for comparison;
  // also for simplicity sake make the comparison string
  let cardOneLi = document.querySelector('li[ident="' + cards[0] + '"]');
  let cardTwoLi = document.querySelector('li[ident="' + cards[1] + '"]');
  let cardOneLiI = cardOneLi.children[0].classList.toString();
  let cardTwoLiI = cardTwoLi.children[0].classList.toString();

  if (cardOneLiI === cardTwoLiI) {
    cardOneLi.classList.add('match');
    cardOneLi.classList.remove('flipped');
    cardTwoLi.classList.add('match');
    cardTwoLi.classList.remove('flipped');
  } else {
    setTimeout(function () {
      cardOneLi.classList.remove('open', 'show', 'flipped');
      cardTwoLi.classList.remove('open', 'show', 'flipped');
    }, 800);
  }

  countMoves++;
  document.querySelector('.moves').innerText = countMoves;
  countMatch = [];
}

function manageStars() {
  let starsUl = document.querySelector('.stars');
  // Clean ul from potential li (to not append incrementally)
  while (starsUl.hasChildNodes()) {
    starsUl.removeChild(starsUl.firstChild);
  }

  // The minimum stars is 1!
  for (i = 1; i <= countStars; i++) {
    let starLi = document.createElement('li');
    let starLiI = document.createElement('i');
    starLiI.classList.add('fa', 'fa-star');
    starLi.appendChild(starLiI);
    starsUl.appendChild(starLi);
  }
}

function clearDeck() {
 let board = document.getElementById('deck');
 while (board.hasChildNodes()) {
   board.removeChild(board.firstChild);
 }
}

function restartGame () {
  countTime = 0;
  countMatch = [];
  countMoves = 0;
  countStars = 3;
  document.querySelector('.moves').innerText = 0;

  timer.reset();
  document.getElementById('modal-congrats').style.display = 'none';
  clearDeck();
  setBoard(myCards);
}

function modal () {
  let modal = document.getElementById('modal-congrats');
  modal.style.display = 'block';
  document.querySelector('.totalTime').innerText = 'Time: ' + timer.getTimeValues().toString();
  document.querySelector('.totalMoves').innerText = 'Moves: ' + countMoves;
  document.querySelector('.totalStars').innerText = 'Stars: ' + countStars;
  timer.stop();
}

setBoard(myCards);

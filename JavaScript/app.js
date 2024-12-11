let currentPlayer = 0; //0 === human 1=== AI
let firstThrow = true;
let playerSelectionCount =0;
let numberOfDices = 6;
let selectionOfDice = {};
let roundScore = 0;
let tempScore = 0;
let isFarkle = false;
let totalScorePlayer1 = 0;
let totalScorePlayer1DOM = document.getElementById("playerOneScore");
let totalScoreAI = 0;
let totalScoreAIDOM = document.getElementById("aiPlayerScore");
let roundScoreDOM = document.getElementById("roundScore");
const scoringRules = {
    single: { 1: 100, 5: 50 }, // Single 1 and 5 have specific scores
    doubles: {1:200, 5:100},
    triple: { 1: 1000, 2: 200, 3: 300, 4: 400, 5: 500, 6: 600 }, // Triples for any number
    straight: 1500, // Example of a straight (1-2-3-4-5-6)
    threePairs: 1500, // Example of three pairs
    fourOfAKind: 1000, // Adjust as needed
    fiveOfAKind: 2000,
    sixOfAKind: 3000,
};
// document.getElementById("rollDice").addEventListener("click", rollDice);
function rollDice() {
    // console.log("Clicked");
    if (numberOfDices===0){
        numberOfDices = 6;
        alert("Hot Dice!");//A hot dice happens when you have selected all your active dice and are not farkled
        //After a hot dice you get back all your dice back and roll again
        tempScore =0;
        rollDice();
    }
    else{
        let throwCount = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0};
        resetTiles(0);
        let diceTiles = shuflleTiles(numberOfDices);//these are the tiles randomly chosen to have a die
        // console.log(diceTile);
        for (let i = 0; i < numberOfDices; i++) {
            let tileNo = diceTiles[i]//
            // console.log("dice tile "+tile);
            const tile = document.getElementById(`tile${tileNo}`);//gets the i th tile from randomly chosen 6 tiles
            const roll = Math.floor(Math.random() * 6) + 1;
            tile.dataset.value = roll;
            throwCount[roll]++;
            // console.log(dice.dataset.value);
            // console.log("dice face "+roll);
            tile.style.backgroundImage = `url('Dice/dice ${roll}.webp')`;
            tile.style.transform = `rotate(${Math.random() * 360}deg)`;

        }
        // console.log(throwCount);
        if (findMelds(throwCount).length === 0) {
            // console.log("farkle")
            isFarkle = true;
            alert("Farkle!");
            bankScore();
        }
        return throwCount;
    }
}
//shuffled dice tile return an array of shuffled array of int corresponding dies tile

function shuflleTiles(numberOfDices){
    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15,16];
    let r = 0;
    let temp = 0;
    for (let i = 15; i > 0; i--) {
        r = Math.floor(Math.random() * (i + 1));
        temp = nums[i];
        nums[i] = nums[r];
        nums[r] = temp;
    }
    return nums.slice(0,numberOfDices);
}
// this function deletes the images of dice from tiles
// otherwise the images will stay in the tiles forever
// o === all tiles , otherwise specified tile
function resetTiles(tileNumber){
    if(tileNumber === 0){//reset all tiles
        const alltiles = document.getElementsByClassName("tile");
        for (let i = 0; i < 16; i++) { //reset all tiles
            alltiles[i].style.backgroundImage = null;
            alltiles[i].setAttribute("data-value","");
            alltiles[i].classList.remove("tileHighlighted");
        }
        selectionOfDice = {};
    }
    else{//reset the specific tile
        const tile = document.getElementById('tile{tileNumber}');
        tile.style.backgroundImage = null;
        tile.setAttribute("data-value","");
    }

}
document.getElementById("bankScore").addEventListener("click",bankScore );
function bankScore() {
    if(tempScore >0){
        totalScorePlayer1 += tempScore+roundScore;
        roundScore = 0;
        tempScore = 0;
        totalScorePlayer1DOM.innerHTML = totalScorePlayer1;
        roundScoreDOM.innerHTML = 0;
        numberOfDices =6;
        alert("Next Player!");
        resetTiles(0);
        firstThrow = true;
        switchPlayer();
    }
    if (isFarkle){
        isFarkle = false;
        roundScore = 0;
        tempScore = 0;
        roundScoreDOM.innerHTML = 0;
        numberOfDices =6;
        alert("Next Player!");
        resetTiles(0);
        firstThrow = true;
        switchPlayer();
    }
}

document.getElementById("rollDice").addEventListener("click", () => {
    if (firstThrow) {
        rollDice();
        firstThrow = false;
    }
    if (tempScore > 0) {
        roundScore += tempScore;
        tempScore = 0;
        roundScoreDOM.innerHTML = roundScore;
        numberOfDices -= playerSelectionCount;
        rollDice();
    }
});





document.querySelectorAll('.tile').forEach(tile => {//Node value
    tile.addEventListener('click', () => {
        if(currentPlayer === 0){//only if human player
            const dieSelectedValue = tile.dataset.value; // The value of the dice
            const dieSelectedId = tile.id; // The ID of the dice (e.g., "dice1")
            if (dieSelectedValue) {
                if (!(dieSelectedId in selectionOfDice)) {
                    // Add the dice to the selection
                    selectionOfDice[dieSelectedId] = dieSelectedValue;
                    tile.classList.add("tileHighlighted");
                } else {
                    // Remove the dice from the selection
                    delete selectionOfDice[dieSelectedId];
                    tile.classList.remove("tileHighlighted");
                }
            }


            // console.log(selectionOfDice); // Debugging
            // console.log(findMelds(diceSelection())); // Debugging
            const occurrenceOfValue = diceSelection();
            tempScore = 0;
            tempScore = isValidMeld(findMelds(occurrenceOfValue), occurrenceOfValue);
            console.log(tempScore);
            roundScoreDOM.innerHTML = roundScore + tempScore;
        }
    });
});
function switchPlayer() {
    currentPlayer = (currentPlayer === 0) ? 1 : 0;
    if (currentPlayer === 1) {
        setTimeout(aiMove, 1000); // Add delay to simulate AI thinking
    }
}

function aiMove() {
    console.log("AI's Move");
// Your AI logic here
    const throwCount =rollDice();
    // console.log(throwCount);

// At the end of AI move, switch back to human player
    switchPlayer();
}


// Step 2: Analyze the Player's Selection
// dice Selection returns the frequency of each dice in player's selection
function diceSelection(){
    // step 1 : formatting
    const values = Object.values(selectionOfDice).map(Number); //return an array of number. These are values of dice
    // occurrence of value store a dictionary with the frequency of dice value used to calculate score
    const occurrenceOfValue = {1:0,2:0,3:0,4:0,5:0,6:0};
    values.forEach(value => {
        occurrenceOfValue[value] = (occurrenceOfValue[value] || 0) + 1;//check if already there is an occurrence
        // this step is necessary because it prevents error like undefined + 1 = NaN
    });
    return occurrenceOfValue;// return an object of dice frequency like {1:3,5:2} etc.
}

//Step 3: Determine Valid Melds
function findMelds(occurrenceOfValue){
    const melds = [];
    let pairCount = 0;
    let isSixer = false;

    //check for Run (1,2,3,4,5,6)
    const isRun = [1,2,3,4,5,6].every((num)=>occurrenceOfValue[num]>0 );//return false on encountering least one false value



    // check for triple pairs and straight six in a single pass
    Object.keys(occurrenceOfValue).forEach((valueStr) => {
        const count = occurrenceOfValue[valueStr];
        if(count === 2){
            pairCount++;
        }
        if(count === 6){
            isSixer = true;
        }
    });
    if(isRun){
        melds.push({ type: 'Run',diceCount:6,  score: 3000 });
    }
    else if(pairCount === 3){
        melds.push({ type: 'Triple Pairs',diceCount:6, score: 2000 });
    }
    else if(isSixer){
        melds.push({ type: 'Six Of A Kind',diceCount:6, score: 2500 });
    }
    else{
        Object.keys(occurrenceOfValue).forEach((valueStr) => {
            const count = occurrenceOfValue[valueStr];
            if(count === 5){
                melds.push({ type: 'Five of a kind',diceCount:5, score: 2000 });
                // occurrenceOfValue[valueStr] -=5;
            }
            if(count === 4){
                melds.push({ type: 'Four of a kind',diceCount:4, score: 1500 });
                // occurrenceOfValue[valueStr] -=4;
            }
            if (count === 3){
                melds.push({ type: `Triple ${valueStr}`,diceCount:3, score: scoringRules.triple[valueStr] });
                // occurrenceOfValue[valueStr] -=3;
            }
            if (count === 2 && scoringRules.doubles[valueStr]) {
                melds.push({ type: `Double ${valueStr}`,diceCount:2, score: scoringRules.doubles[valueStr] });
                // occurrenceOfValue[valueStr] -=2;
            }
            if (count === 1 && scoringRules.single[valueStr]){
                melds.push({ type: `Single ${valueStr}`,diceCount:1, score: scoringRules.single[valueStr] });
                // occurrenceOfValue[valueStr] -=1;
            }
        });
    }
    return melds;
}
function isValidMeld(meld,occurrenceOfValue){
    playerSelectionCount = Object.values(occurrenceOfValue).reduce((sum, count) => sum + count, 0);

    // Using reduce to sum diceCount and score
    const meldCount = meld.reduce((acc, obj) => {
        acc.diceCount += obj.diceCount;
        acc.score += obj.score;
        return acc;
    }, { diceCount: 0, score: 0 });

    if (meldCount.diceCount === playerSelectionCount) {
        return meldCount.score;
    }
    else {
        return 0;
    }

}

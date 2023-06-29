const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

let currentlyPlaying = true;

// class Field includes all the object's properties
class Field {
  constructor(field){
    this._field = field;
    this.y = 0;
    this.x = 0;
  }

  get field() {
    return this._field;
  }

  // Print the field to the terminal in a two-dimensional plane
  print() {
    return this._field.map(row =>
            row.join(' ')
    ).join('\n');
  }  

  // Gain the user's input & move the player's cursor
  ask() {
    let user = prompt(`Which way? Press \'u'\ to move up, \'d'\ to move down, \'l'\ to move left and \'r'\ to move right.`);
    switch(user.toLowerCase()){
      case 'u':
        console.log('Up');
        this.y -= 1;
        break;
      case 'd':
        console.log('Down');
        this.y += 1;
        break;
      case 'l':
        console.log('Left');
        this.x -= 1;
        break;
      case 'r':
        console.log('Right');
        this.x += 1;
        break;
      default:
        break;
    };  
  }
  playGame() {
    switch (this.field[this.y][this.x]) {
        case undefined: 
            console.log('Out of bounds - you lose!');
            currentlyPlaying = false;
            break;
        case hat:
            console.log('Congrats! You found your hat <3');
            currentlyPlaying = false;
            break;
        case hole:
            console.log('Sorry, you fell down a hole');
            currentlyPlaying = false;
            break;
        case fieldCharacter:
            this.field[this.y][this.x] = pathCharacter;
            currentlyPlaying = true;
            break;
        default:
            break;
    };
   }

  // Static function generates new field 
   static generateField(height, width, percentage) {
     
     // The percentage expression of holes in the field.
     const percentChar = (arr) => {
       const charHole = arr.filter(char => char === hole);
       const charField = arr.filter(char => char === fieldCharacter); 
       let percentChar = (charHole / (charHole+charField)) * 100;
       return percentChar; 
     };

     // Function creating new field. It includes 3 parameters: height, width, percentage 
     const newField = () => {
        let chars = ['O', '░'];
        let field = [];        

        for(let i = 0; i < height; i++){
          let row = [];  
          for(let j = 0; j < width; j++){
            let randomN = Math.floor(Math.random() * 2);
            let newSquare = chars[randomN];
            row.unshift(newSquare);
            if(row.length >= 3 || ( percentChar(row) >= percentage )){
                newSquare = fieldCharacter;
                row.pop();
                row.unshift(newSquare);
            };
          };
           field.push(row);  
        };
        field[0][0] = pathCharacter; // Path begins with the '*' path character 
        
        // Adds hat at the random point of the new field
        const randomHat = () => {
            let randomHeight = Math.floor(Math.random() * height);
            let randomWidth = Math.floor(Math.random() * width);
            if( randomHeight !== 0 || randomWidth !== 0 || randomHeight !== 1 || randomWidth !== 1  ){
                field[randomHeight][randomWidth] = '^';  
                return field;
            };
        };

        // Ban of the holes from both sides of the first path
        if(field[0][1] == hole && field[1][0] == hole){
            Math.floor(Math.random() * 2) == 1 ? (field[0][1] == pathCharacter) : (field[1][0] == pathCharacter);
         };

        randomHat(); 
        return field;
      };
    return newField();
   }
};

// Create a new field. It includes 3 parameters in generateField: height, width, percentage 
const myField = new Field(Field.generateField(10, 10, 25)); // <-- <--- WRITE YOUR FIELD REQUIREMENT IN THE PARENTHESES <-- //

// Game is on:
 function onPlay() {
    while(currentlyPlaying) {
      console.log(myField.print());
      myField.ask();
      myField.playGame();
    }
    console.log('Game Over...');
  };

onPlay();

let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');

let width = canvas.width;
let height = canvas.height;

let score = 0;

let blockSize = 10;
let widthSize = width / blockSize;
let heightSize = height / blockSize;

let audioLose = new Audio('./sound/lose.mp3');
let audioEating = new Audio('./sound/eating.mp3');

let foodForSnake = (centerX, centerY) => {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(centerX, centerY, blockSize / 2, 0, Math.PI * 2, false);
    ctx.fill();
}

let gameOver = () => {
    audioLose.play();
    clearInterval(intervalId);
    ctx.font = '35px Lucida Console';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText(`Game Over`, width / 2, height / 2);
    ctx.fillText(`Your score: ${score}`, width / 2, height / 1.5);

}

let drawScore = () => {
    ctx.font = '30px serif';
    ctx.fillStyle = '#f89916';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, blockSize, blockSize + 15);
}

class Block {
    constructor(col, row) {
        this.col = col;
        this.row = row;
    }

    drawSquare(color) {
        ctx.fillStyle = color;
        ctx.rect(this.col * blockSize, this.row * blockSize, blockSize, blockSize);
        ctx.fill();
    }

    drawCircle() {
        foodForSnake(this.col * blockSize + blockSize / 2, this.row * blockSize + blockSize / 2);
    }

    equal(otherBlock) {
        return this.col === otherBlock.col && this.row === otherBlock.row;
    }

}

class Snake {
    constructor() {
        this.snakeBody = [
            new Block(8, 7),
            new Block(7, 7),
            new Block(6, 7)
        ]
        this.direction = 'right';
        this.nextDirection = 'right';
    }

    drawSnake() {
        for (let i = 0; i < this.snakeBody.length; i++) {
            this.snakeBody[i].drawSquare('#fa0155');
        }
    }

    snakeMove() {

        let head = this.snakeBody[0];
        let newHead;

        this.direction = this.nextDirection;

        if (this.direction === 'right') {
            newHead = new Block(head.col + 1, head.row)
        } else if (this.direction === 'left') {
            newHead = new Block(head.col - 1, head.row)
        } else if (this.direction === 'up') {
            newHead = new Block(head.col, head.row - 1)
        } else if (this.direction === 'down') {
            newHead = new Block(head.col, head.row + 1)
        }
        //snake.setDirection();
        snake.selfCollision(this.snakeBody, newHead);
        snake.wallCollision(newHead);

        this.snakeBody.unshift(newHead);

        if (newHead.equal(apple.position)) {
            audioEating.play();

            score += randomInteger(1, 3);
            apple.moveApple();
        } else {
            this.snakeBody.pop();
        }
    }

    setDirection(newDirection) {
        if (this.direction === 'right' && newDirection === 'left') {
            return;
        } else if (this.direction === 'up' && newDirection === 'down') {
            return;
        } else if (this.direction === 'left' && newDirection === 'right') {
            return;
        } else if (this.direction === 'down' && newDirection === 'up') {
            return;
        }
        this.nextDirection = newDirection;
    }

    selfCollision(checkSnakeBody, checkNewHead) {
        for (let i = 0; i < this.snakeBody.length; i++) {
            if (checkNewHead.equal(checkSnakeBody[i])) {
                gameOver();
            }
        }
    }

    wallCollision(checkNewHead) {
        if (checkNewHead.col < 0) {
            gameOver();
        } else if (checkNewHead.row < 0) {
            gameOver()
        } else if (checkNewHead.col + 1 > widthSize) {
            gameOver()
        } else if (checkNewHead.row + 1 > heightSize) {
            gameOver()
        }
    }
}

class Apple {
    constructor() {
        this.position = new Block(randomInteger(1, 20), randomInteger(1, 20))
    }

    drawApple() {
        this.position.drawCircle();
    }

    moveApple() {
        let rndX = Math.floor(Math.random() * widthSize);
        let rndY = Math.floor(Math.random() * heightSize);

        this.position = new Block(rndX, rndY);
        this.position.drawCircle();

    }
}

let snake = new Snake();
let apple = new Apple();

let intervalId = setInterval(() => {
    ctx.clearRect(0, 0, width, height);
    drawScore();
    snake.snakeMove();
    snake.drawSnake();
    apple.drawApple();
}, 70)

let direction = {
    13: 'enter',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
};

function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

window.addEventListener('keydown', (event) => {
    let newDirection = direction[event.keyCode]
    if (newDirection !== undefined) {
        this.direction = snake.setDirection(newDirection);
    }
})
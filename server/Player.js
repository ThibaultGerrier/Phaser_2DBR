const { getRandomInt } = require('./helper');

class Player {
    constructor(id, username, startX, startY, startAngle) {
        this.id = id;
        this.username = username;
        this.x = startX;
        this.y = startY;
        this.angle = startAngle;
        this.speed = 500;
        this.sendData = true;
        this.size = getRandomInt(40, 100);
        this.dead = false;
    }
}

module.exports = Player;

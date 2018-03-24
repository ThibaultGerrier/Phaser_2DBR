const { getRandomInt } = require('./helper');

class FoodPickup {
    constructor(maxX, maxY, type, id) {
        this.x = getRandomInt(10, maxX - 10);
        this.y = getRandomInt(10, maxY - 10);
        this.type = type;
        this.id = id;
        // this.powerup;
    }
}

module.exports = FoodPickup;

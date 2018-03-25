import { game } from './main';

class FoodObject {
    constructor(id, type, startX, startY) {
        // unique id for the food.
        // generated in the server with node-uuid
        this.id = id;

        // positinon of the food
        this.posX = startX;
        this.posY = startY;
        // this.powerup = value;

        // create a circulr phaser object for food
        this.item = game.add.graphics(this.posX, this.posY);
        this.item.beginFill(0xFF0000);
        this.item.lineStyle(2, 0xFF0000, 1);
        this.item.drawCircle(0, 0, 20);

        this.item.type = 'food_body';
        this.item.id = id;

        game.physics.p2.enableBody(this.item, true);
        this.item.body.clearShapes();
        this.item.body_size = 10;
        this.item.body.addCircle(this.item.body_size, 0, 0);
        this.item.body.data.gravityScale = 0;
        this.item.body.data.shapes[0].sensor = true;
    }
}

export default FoodObject;

import Global from './Globals';

class FoodObject {
    constructor(id, type, startX, startY) {
        this.id = id;
        this.posX = startX;
        this.posY = startY;

        this.item = Global.game.add.sprite(this.posX, this.posY, '2ammo');

        this.item.type = 'food_body';
        this.item.id = id;
        this.item.scale.setTo(0.25, 0.25);

        Global.game.physics.p2.enableBody(this.item, true);

        this.item.body.clearShapes();
        this.item.body_size = 10;
        this.item.body.addCircle(this.item.body_size, 0, 0);
        this.item.body.data.gravityScale = 0;
        this.item.body.data.shapes[0].sensor = true;
    }
}

export default FoodObject;

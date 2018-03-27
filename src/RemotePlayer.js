import Global from './Globals';

export default class RemotePlayer {
    constructor(id, startX, startY, startSize, startAngle) {
        this.x = startX;
        this.y = startY;
        // this is the unique socket id. We use it as a unique name for enemy
        this.id = id;
        this.angle = startAngle;

        // this.player = Global.game.add.graphics(this.x, this.y);
        this.player = Global.game.add.sprite(this.x, this.y, 'dude');

        // initialize the size with the server value
        this.player.radius = startSize;

        // set a fill and line style
        // this.player.beginFill(0xffd900);
        // this.player.lineStyle(2, 0xffd900, 1);
        // this.player.drawCircle(0, 0, this.player.radius * 2);
        // this.player.endFill();
        this.player.anchor.setTo(0.5, 0.5);
        // we set the initial size;
        this.initial_size = startSize;
        this.player.body_size = this.player.radius;
        this.player.type = 'player_body';
        this.player.id = this.id;

        // draw a shape
        Global.game.physics.p2.enableBody(this.player, true);
        this.player.body.clearShapes();
        this.player.body.addCircle(this.player.body_size, 0, 0);
        this.player.body.data.shapes[0].sensor = true;
    }
}

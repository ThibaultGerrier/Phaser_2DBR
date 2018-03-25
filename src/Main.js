import Global from './Globals';
import {
    onSocketConnected,
    onCreatePlayer,
    onNewPlayer,
    onEnemyMove,
    onRemovePlayer,
    onInputReceived,
    onKilled,
    onGained,
    onLeaderBoardUpdate,
} from './socketActions';
import Item from './item';

const item = new Item(Global.game);

function createLeaderBoard() {
    const leaderBox = Global.game.add.graphics(Global.game.width * 0.81, Global.game.height * 0.05);
    leaderBox.fixedToCamera = true;
    // draw a rectangle
    leaderBox.beginFill(0xD3D3D3, 0.3);
    leaderBox.lineStyle(2, 0x202226, 1);
    leaderBox.drawRect(0, 0, 300, 400);

    const style = {
        font: '13px Press Start 2P', fill: 'black', align: 'left', fontSize: '22px',
    };

    Global.leaderText = Global.game.add.text(10, 10, '', style);
    Global.leaderText.anchor.set(0);

    leaderBox.addChild(Global.leaderText);
}

export default class Main {
    init(username) {
        console.log('init');
        // when the socket connects, call the onsocketconnected and send its information to the server
        Global.socket.emit('logged_in', { username });

        // when the player enters the game
        Global.socket.on('enter_game', onSocketConnected);
    }

    preload() {
        Global.game.stage.disableVisibilityChange = true;
        Global.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        Global.game.world.setBounds(0, 0, Global.gameProperties.gameWidth, Global.gameProperties.gameHeight, false, false, false, false);
        Global.game.physics.startSystem(Phaser.Physics.P2JS);
        Global.game.physics.p2.setBoundsToWorld(false, false, false, false, false);
        Global.game.physics.p2.gravity.y = 0;
        Global.game.physics.p2.applyGravity = false;
        Global.game.physics.p2.enableBody(Global.game.physics.p2.walls, false);
        // physics start system
        // game.physics.p2.setImpactEvents(true);
    }

    create() {
        Global.game.stage.backgroundColor = 0xE1A193;

        console.log('src started');

        // listen for main player creation
        Global.socket.on('create_player', onCreatePlayer);
        // listen to new enemy connections
        Global.socket.on('new_enemyPlayer', onNewPlayer);
        // listen to enemy movement
        Global.socket.on('enemy_move', onEnemyMove);
        // when received remove_player, remove the player passed;
        Global.socket.on('remove_player', onRemovePlayer);
        // when the player receives the new input
        Global.socket.on('input_recieved', onInputReceived);
        // when the player gets killed
        Global.socket.on('killed', onKilled);
        // when the player gains in size
        Global.socket.on('gained', onGained);
        // check for item removal
        Global.socket.on('itemremove', data => item.onItemRemove(data));
        // check for item update
        Global.socket.on('item_update', data => item.onItemUpdate(data));
        // check for leaderboard
        Global.socket.on('leader_board', onLeaderBoardUpdate);

        createLeaderBoard();
    }

    update() {
        // emit the player input

        // move the player when the player is made
        if (Global.gameProperties.inGame) {
            // we're making a new mouse pointer and sending this input to
            // the server.
            const pointer = Global.game.input.mousePointer;

            // Send a new position data to the server
            Global.socket.emit('input_fired', {
                pointerX: pointer.x,
                pointerY: pointer.y,
                pointerWorldX: pointer.worldX,
                pointerWorldY: pointer.worldY,
            });
        }
    }
}

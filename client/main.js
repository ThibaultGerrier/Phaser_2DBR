/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* global window */
/* global Phaser */

// import Phaser from './lib/phaser';
import playerCollide from './colide';
import { moveToPointer, distanceToPointer } from './player';
import Item from './item';
import { socket, login } from './login';

let player;
let speed;
let leaderText;
const canvasWidth = window.innerWidth * window.devicePixelRatio;
const canvasHeight = window.innerHeight * window.devicePixelRatio;

const game = new Phaser.Game(canvasWidth, canvasHeight, Phaser.CANVAS, 'gameDiv');

// the enemy player list
const enemies = [];

const gameProperties = {
    gameWidth: 4000,
    gameHeight: 4000,
    gameElement: 'gameDiv',
    inGame: false,
};

const main = function () {};

function onsocketConnected(data) {
    console.log('connected to server');
    gameProperties.inGame = true;
    socket.emit('new_player', {
        username: data.username, x: 0, y: 0, angle: 0,
    });
}

// When the server notifies us of client disconnection, we find the disconnected
// enemy and remove from our game
function onRemovePlayer(data) {
    const removePlayer = findplayerbyid(data.id);
    // Player not found
    if (!removePlayer) {
        console.log('Player not found: ', data.id);
        return;
    }

    removePlayer.player.destroy();
    enemies.splice(enemies.indexOf(removePlayer), 1);
}

function createPlayer(data) {
    player = game.add.graphics(0, 0);
    player.radius = data.size;

    // set a fill and line style
    player.beginFill(0xffd900);
    player.lineStyle(2, 0xffd900, 1);
    player.drawCircle(0, 0, player.radius * 2);
    player.endFill();
    player.anchor.setTo(0.5, 0.5);
    player.body_size = player.radius;
    // set the initial size;
    player.initial_size = player.radius;
    const style = { fill: 'black', align: 'center' };
    player.type = 'player_body';

    // draw a shape
    game.physics.p2.enableBody(player, true);
    player.body.clearShapes();
    player.body.addCircle(player.body_size, 0, 0);
    player.body.data.shapes[0].sensor = true;
    // enable collision and when it makes a contact with another body, call player_coll
    player.body.onBeginContact.add(playerCollide, this);
    // player follow text
    player.playertext = game.add.text(0, 0, data.username, style);
    player.addChild(player.playertext);

    // camera follow
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.5, 0.5);
}

// this is the enemy class.
const RemotePlayer = function (id, startX, startY, startSize, startAngle) {
    this.x = startX;
    this.y = startY;
    // this is the unique socket id. We use it as a unique name for enemy
    this.id = id;
    this.angle = startAngle;

    this.player = game.add.graphics(this.x, this.y);
    // intialize the size with the server value
    this.player.radius = startSize;

    // set a fill and line style
    this.player.beginFill(0xffd900);
    this.player.lineStyle(2, 0xffd900, 1);
    this.player.drawCircle(0, 0, this.player.radius * 2);
    this.player.endFill();
    this.player.anchor.setTo(0.5, 0.5);
    // we set the initial size;
    this.initial_size = startSize;
    this.player.body_size = this.player.radius;
    this.player.type = 'player_body';
    this.player.id = this.id;

    // draw a shape
    game.physics.p2.enableBody(this.player, true);
    this.player.body.clearShapes();
    this.player.body.addCircle(this.player.body_size, 0, 0);
    this.player.body.data.shapes[0].sensor = true;
};

// Server will tell us when a new enemy player connects to the server.
// We create a new enemy in our game.
function onNewPlayer(data) {
    // enemy object
    console.log(data);
    const newEnemy = new RemotePlayer(data.id, data.x, data.y, data.size, data.angle);
    enemies.push(newEnemy);
}

// Server tells us there is a new enemy movement. We find the moved enemy
// and sync the enemy movement with the server
function onEnemyMove(data) {
    const movePlayer = findplayerbyid(data.id);

    if (!movePlayer) {
        return;
    }

    const newPointer = {
        x: data.x,
        y: data.y,
        worldX: data.x,
        worldY: data.y,
    };


    // check if the server enemy size is not equivalent to the client
    if (data.size !== movePlayer.player.body_size) {
        movePlayer.player.body_size = data.size;
        const newScale = movePlayer.player.body_size / movePlayer.initial_size;
        movePlayer.player.scale.set(newScale);
        movePlayer.player.body.clearShapes();
        movePlayer.player.body.addCircle(movePlayer.player.body_size, 0, 0);
        movePlayer.player.body.data.shapes[0].sensor = true;
    }

    const distance = distanceToPointer(movePlayer.player, newPointer);
    speed = distance / 0.05;
    movePlayer.rotation = moveToPointer(movePlayer.player, speed, newPointer);
}

// we're receiving the calculated position from the server and changing the player position
function onInputRecieved(data) {
    // we're forming a new pointer with the new position
    const newPointer = {
        x: data.x,
        y: data.y,
        worldX: data.x,
        worldY: data.y,
    };

    const distance = distanceToPointer(player, newPointer);
    // we're receiving player position every 50ms. We're interpolating
    // between the current position and the new position so that player
    // does jerk.
    speed = distance / 0.05;

    player.rotation = moveToPointer(player, speed, newPointer);
}

function onGained(data) {
    player.body_size = data.new_size;
    const newScale = data.new_size / player.initial_size;
    player.scale.set(newScale);
    // create new body
    player.body.clearShapes();
    player.body.addCircle(player.body_size, 0, 0);
    player.body.data.shapes[0].sensor = true;
}

function onKilled() {
    player.destroy();
}


// This is where we use the socket id.
// Search through enemies list to find the right enemy of the id.
const findplayerbyid = id => enemies.find(e => e.id === id) || false;

// create leader board in here.
function createLeaderBoard() {
    const leaderBox = game.add.graphics(game.width * 0.81, game.height * 0.05);
    leaderBox.fixedToCamera = true;
    // draw a rectangle
    leaderBox.beginFill(0xD3D3D3, 0.3);
    leaderBox.lineStyle(2, 0x202226, 1);
    leaderBox.drawRect(0, 0, 300, 400);

    const style = {
        font: '13px Press Start 2P', fill: 'black', align: 'left', fontSize: '22px',
    };

    leaderText = game.add.text(10, 10, '', style);
    leaderText.anchor.set(0);

    leaderBox.addChild(leaderText);
}

// leader board
function lbupdate(data) {
    // this is the final board string.
    let boardString = '';
    const maxlen = 10;
    const maxPlayerDisplay = 10;
    let mainPlayerShown = false;

    for (let i = 0; i < data.length; i += 1) {
        // if the mainplayer is shown along the iteration, set it to true

        if (mainPlayerShown && i >= maxPlayerDisplay) {
            break;
        }

        // if the player's rank is very low, we display maxPlayerDisplay - 1 names in the leaderboard
        // and then add three dots at the end, and show player's rank.
        if (!mainPlayerShown && i >= maxPlayerDisplay - 1 && socket.id === data[i].id) {
            boardString = boardString.concat('.\n');
            boardString = boardString.concat('.\n');
            boardString = boardString.concat('.\n');
            mainPlayerShown = true;
        }

        // here we are checking if user id is greater than 10 characters, if it is
        // it is too long, so we're going to trim it.
        if (data[i].username.length >= 10) {
            let { username } = data[i];
            let temp = '';
            for (let j = 0; j < maxlen; j += 1) {
                temp += username[j];
            }

            temp += '...';
            username = temp;

            boardString = boardString.concat(i + 1, ': ');
            boardString = boardString.concat(username, ' ', `${(data[i].size).toString()}\n`);
        } else {
            boardString = boardString.concat(i + 1, ': ');
            boardString = boardString.concat(data[i].username, ' ', `${(data[i].size).toString()}\n`);
        }
    }

    console.log(boardString);
    leaderText.setText(boardString);
}

const item = new Item(game);

main.prototype = {
    init(username) {
        // when the socket connects, call the onsocketconnected and send its information to the server
        socket.emit('logged_in', { username });

        // when the player enters the game
        socket.on('enter_game', onsocketConnected);
    },

    preload() {
        game.stage.disableVisibilityChange = true;
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        game.world.setBounds(0, 0, gameProperties.gameWidth, gameProperties.gameHeight, false, false, false, false);
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setBoundsToWorld(false, false, false, false, false);
        game.physics.p2.gravity.y = 0;
        game.physics.p2.applyGravity = false;
        game.physics.p2.enableBody(game.physics.p2.walls, false);
        // physics start system
        // game.physics.p2.setImpactEvents(true);
    },

    create() {
        game.stage.backgroundColor = 0xE1A193;

        console.log('client started');

        // listen for main player creation
        socket.on('create_player', createPlayer);
        // listen to new enemy connections
        socket.on('new_enemyPlayer', onNewPlayer);
        // listen to enemy movement
        socket.on('enemy_move', onEnemyMove);
        // when received remove_player, remove the player passed;
        socket.on('remove_player', onRemovePlayer);
        // when the player receives the new input
        socket.on('input_recieved', onInputRecieved);
        // when the player gets killed
        socket.on('killed', onKilled);
        // when the player gains in size
        socket.on('gained', onGained);
        // check for item removal
        socket.on('itemremove', data => item.onItemRemove(data));
        // check for item update
        socket.on('item_update', data => item.onItemUpdate(data));
        // check for leaderboard
        socket.on('leader_board', lbupdate);

        createLeaderBoard();
    },

    update() {
        // emit the player input

        // move the player when the player is made
        if (gameProperties.inGame) {
            // we're making a new mouse pointer and sending this input to
            // the server.
            const pointer = game.input.mousePointer;

            // Send a new position data to the server
            socket.emit('input_fired', {
                pointerX: pointer.x,
                pointerY: pointer.y,
                pointerWorldX: pointer.worldX,
                pointerWorldY: pointer.worldY,
            });
        }
    },
};

const gameBootstrapper = {
    init() {
        game.state.add('main', main);
        game.state.add('login', login);
        game.state.start('login');
    },
};

gameBootstrapper.init();

export {
    game,
    gameProperties,
};

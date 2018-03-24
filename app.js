/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */

const http = require('http');
const express = require('express');
const p2 = require('p2');
const uuidv1 = require('uuid/v1');
const socketIo = require('socket.io');

const physicsPlayer = require('./server/physics/playermovement.js');

const app = express();
const server = http.Server(app);

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/client/index.html`);
});
app.use('/client', express.static(`${__dirname}/client`));

server.listen(3000);
console.log('Server started.');

const playerList = [];

// needed for physics update
// const startTime = (new Date()).getTime();
// let lastTime;
const timeStep = 1 / 70;

// the physics world in the server. This is where all the physics happens.
// we set gravity to 0 since we are just following mouse pointers.
const world = new p2.World({
    gravity: [0, 0],
});

// create a game class to store basic game data
const GameSetup = function () {
    // The constant number of foods in the game
    this.food_num = 100;
    // food object list
    this.food_pickup = [];
    // game size height
    this.canvas_height = 4000;
    // game size width
    this.canvas_width = 4000;
};

// createa a new game instance
const gameInstance = new GameSetup();


// a player class in the server
const Player = function (startX, startY, startAngle) {
    // this.id;
    this.x = startX;
    this.y = startY;
    this.angle = startAngle;
    this.speed = 500;
    // We need to intilaize with true.
    this.sendData = true;
    this.size = getRndInteger(40, 100);
    this.dead = false;
};

const FoodPickup = function (maxX, maxY, type, id) {
    this.x = getRndInteger(10, maxX - 10);
    this.y = getRndInteger(10, maxY - 10);
    this.type = type;
    this.id = id;
    // this.powerup;
};

// We call physics handler 60fps. The physics is calculated here.
setInterval(heartbeat, 1000 / 60);


// Steps the physics world.
function physicsHanlder() {
    // const currentTime = (new Date()).getTime();
    // const timeElapsed = currentTime - startTime;
    // let dt = lastTime ? (timeElapsed - lastTime) / 1000 : 0;
    // dt = Math.min(1 / 10, dt);
    world.step(timeStep);
}

function heartbeat() {
    // the number of food that needs to be generated
    // in this demo, we keep the food always at 100
    const foodGenerateNum = gameInstance.food_num - gameInstance.food_pickup.length;

    // add the food
    addFood(foodGenerateNum);
    // physics stepping. We moved this into heartbeat
    physicsHanlder();
}

function addFood(n) {
    // return if it is not required to create food
    if (n <= 0) {
        return;
    }
    // create n number of foods to the game
    for (let i = 0; i < n; i += 1) {
        // create the unique id using node-uuid
        const uniqueId = uuidv1();
        const foodEntity = new FoodPickup(gameInstance.canvas_width, gameInstance.canvas_height, 'food', uniqueId);
        gameInstance.food_pickup.push(foodEntity);
        // set the food data back to client
        io.emit('item_update', foodEntity);
    }
}

// when the player enters their name, trigger this function
function onEntername(data) {
    this.emit('join_game', { username: data.username, id: this.id });
}


// when a new player connects, we make a new instance of the player object,
// and send a new player message to the client.
function onNewPlayer(data) {
    // new player instance
    const newPlayer = new Player(data.x, data.y, data.angle);
    newPlayer.id = this.id;
    newPlayer.username = data.username;

    // add the playerbody into the player object
    newPlayer.playerBody = new p2.Body({
        mass: 0,
        position: [0, 0],
        fixedRotation: true,
    });
    world.addBody(newPlayer.playerBody);

    console.log(`created new player with id ${this.id}`);
    newPlayer.id = this.id;

    this.emit('create_player', { username: newPlayer.username, size: newPlayer.size });

    // information to be sent to all clients except sender
    const currentInfo = {
        id: newPlayer.id,
        x: newPlayer.x,
        y: newPlayer.y,
        angle: newPlayer.angle,
        size: newPlayer.size,
    };

    // send to the new player about everyone who is already connected.
    playerList.forEach((player) => {
        const playerInfo = {
            id: player.id,
            username: player.username,
            x: player.x,
            y: player.y,
            angle: player.angle,
            size: player.size,
        };
        console.log('pushing player');
        // send message to the sender-client only
        this.emit('new_enemyPlayer', playerInfo);
    });

    // Tell the client to make foods that are existing
    gameInstance.food_pickup.forEach((food) => {
        this.emit('item_update', food);
    });

    // send message to every connected client except the sender
    this.broadcast.emit('new_enemyPlayer', currentInfo);

    playerList.push(newPlayer);
    sortPlayerListByScore();
}

// instead of listening to player positions, we listen to user inputs
function onInputFired(data) {
    const movePlayer = findPlayerById(this.id, this.room);
    if (!movePlayer || movePlayer.dead) {
        console.log('no player');
        return;
    }

    // when sendData is true, we send the data back to client.
    if (!movePlayer.sendData) {
        return;
    }

    // every 50ms, we send the data.
    setTimeout(() => { movePlayer.sendData = true; }, 50);
    // we set sendData to false when we send the data.
    movePlayer.sendData = false;

    // Make a new pointer with the new inputs from the client.
    // contains player positions in server
    const serverPointer = {
        x: data.pointer_x,
        y: data.pointer_y,
        worldX: data.pointer_worldx,
        worldY: data.pointer_worldy,
    };

    // moving the player to the new inputs from the player
    if (physicsPlayer.distanceToPointer(movePlayer, serverPointer) <= 30) {
        movePlayer.playerBody.angle = physicsPlayer.moveToPointer(movePlayer, 0, serverPointer, 1000);
    } else {
        movePlayer.playerBody.angle = physicsPlayer.moveToPointer(movePlayer, movePlayer.speed, serverPointer);
    }

    [movePlayer.x, movePlayer.y] = movePlayer.playerBody.position;

    // new player position to be sent back to client.
    const info = {
        x: movePlayer.playerBody.position[0],
        y: movePlayer.playerBody.position[1],
        angle: movePlayer.playerBody.angle,
    };

    // send to sender (not to every clients).
    this.emit('input_recieved', info);

    // data to be sent back to everyone except sender
    const moveplayerData = {
        id: movePlayer.id,
        x: movePlayer.playerBody.position[0],
        y: movePlayer.playerBody.position[1],
        angle: movePlayer.playerBody.angle,
        size: movePlayer.size,
    };

    // send to everyone except sender
    this.broadcast.emit('enemy_move', moveplayerData);
}

function onPlayerCollision(data) {
    const movePlayer = findPlayerById(this.id);
    const enemyPlayer = findPlayerById(data.id);
    if (movePlayer.dead || enemyPlayer.dead) {
        return;
    }
    if (!movePlayer || !enemyPlayer) {
        return;
    }
    if (movePlayer.size === enemyPlayer) {
        return;
    } else if (movePlayer.size < enemyPlayer.size) { // the main player size is less than the enemy size
        enemyPlayer.size += movePlayer.size / 2;
        this.emit('killed');
        // provide the new size the enemy will become
        this.broadcast.emit('remove_player', { id: this.id });
        this.broadcast.to(data.id).emit('gained', { new_size: enemyPlayer.size });
        playerKilled(movePlayer);
    } else {
        movePlayer.size += enemyPlayer.size / 2;
        this.emit('remove_player', { id: enemyPlayer.id });
        this.emit('gained', { new_size: movePlayer.size });
        this.broadcast.to(data.id).emit('killed');
        // send to everyone except sender.
        this.broadcast.emit('remove_player', { id: enemyPlayer.id });
        playerKilled(enemyPlayer);
    }

    sortPlayerListByScore();
    console.log('someone ate someone!!!');
}

const findFood = id => gameInstance.food_pickup.find(f => f.id === id) || false;

function sortPlayerListByScore() {
    playerList.sort((a, b) => b.size - a.size);

    const playerListSorted = [];

    playerList.forEach((player) => {
        playerListSorted.push({ id: player.id, username: player.username, size: player.size });
    });

    io.emit('leader_board', playerListSorted);
}

function onItemPicked(data) {
    const movePlayer = findPlayerById(this.id);
    const object = findFood(data.id);
    if (!object) {
        console.log(data);
        console.log('could not find object');
        return;
    }
    // increase player size
    movePlayer.size += 3;
    // broadcast the new size
    this.emit('gained', { new_size: movePlayer.size });
    gameInstance.food_pickup.splice(gameInstance.food_pickup.indexOf(object), 1);
    sortPlayerListByScore();
    console.log('item picked');
    io.emit('itemremove', object);
    this.emit('item_picked');
}

function playerKilled(player) {
    // find the player and remove it.
    const removePlayer = findPlayerById(player.id);
    if (removePlayer) {
        playerList.splice(playerList.indexOf(removePlayer), 1);
    }
    player.dead = true;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * ((max - min) + 1)) + min;
}

// call when a client disconnects and tell the clients except sender to remove the disconnected player
function onClientDisconnect() {
    console.log('disconnect');
    const removePlayer = findPlayerById(this.id);
    if (removePlayer) {
        playerList.splice(playerList.indexOf(removePlayer), 1);
    }
    console.log(`removing player ${this.id}`);
    sortPlayerListByScore();
    // send message to every connected client except the sender
    this.broadcast.emit('remove_player', { id: this.id });
}

// find player by the the unique socket id
const findPlayerById = id => playerList.find(p => p.id === id) || false;

// io connection
const io = socketIo(server, {});

io.sockets.on('connection', (socket) => {
    console.log('socket connected');
    // when the player enters their name
    socket.on('enter_name', onEntername);
    // whent he player logs in
    socket.on('logged_in', function (data) {
        this.emit('enter_game', { username: data.username });
    });
    // listen for disconnection;
    socket.on('disconnect', onClientDisconnect);
    // listen for new player
    socket.on('new_player', onNewPlayer);
    // listen for new player inputs.
    socket.on('input_fired', onInputFired);
    socket.on('player_collision', onPlayerCollision);
    // listen if player got items
    socket.on('item_picked', onItemPicked);
});

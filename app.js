/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */

const http = require('http');
const express = require('express');
const p2 = require('p2');
const uuidv1 = require('uuid/v1');
const socketIo = require('socket.io');

const physicsPlayer = require('./server/physics/playermovement.js');
const Player = require('./server/Player');
const GameSetup = require('./server/GameSetup');
const FoodPickup = require('./server/FoodPickup');

const app = express();
const server = http.Server(app);

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/dist/index.html`);
});
app.use('/dist', express.static(`${__dirname}/dist`));

server.listen(3000);
console.log('Server started.');

const io = socketIo(server, {});

io.sockets.on('connection', (socket) => {
    console.log('socket connected');
    socket.on('enter_name', onEnterName);
    socket.on('logged_in', loggedIn);
    socket.on('disconnect', onClientDisconnect);
    socket.on('new_player', onNewPlayer);
    socket.on('input_fired', onInputFired);
    socket.on('player_collision', onPlayerCollision);
    socket.on('item_picked', onItemPicked);
});

const gameInstance = new GameSetup();
const world = new p2.World({ gravity: [0, 0] });

const findPlayerById = id => gameInstance.playerList.find(p => p.id === id) || false;
const findFood = id => gameInstance.foodPickup.find(f => f.id === id) || false;

setInterval(heartbeat, 1000 / 60);

function physicsHandler() {
    world.step(1 / 70);
}

function addFood(n) {
    if (n <= 0) {
        return;
    }
    for (let i = 0; i < n; i += 1) {
        const uniqueId = uuidv1();
        const foodEntity = new FoodPickup(gameInstance.canvasWidth, gameInstance.canvasHeight, 'food', uniqueId);
        gameInstance.foodPickup.push(foodEntity);
        io.emit('item_update', foodEntity);
    }
}

function heartbeat() {
    const foodGenerateNum = gameInstance.foodNum - gameInstance.foodPickup.length;
    addFood(foodGenerateNum);
    physicsHandler();
}

function loggedIn(data) {
    this.emit('enter_game', { username: data.username });
}

function onEnterName(data) {
    this.emit('join_game', { username: data.username, id: this.id });
}

function onNewPlayer(data) {
    console.log('on new player');
    const newPlayer = new Player(this.id, data.username, data.x, data.y, data.angle);
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
    gameInstance.playerList.forEach((player) => {
        const playerInfo = {
            id: player.id,
            username: player.username,
            x: player.x,
            y: player.y,
            angle: player.angle,
            size: player.size,
        };
        console.log('pushing player');
        // send message to the sender-src only
        this.emit('new_enemyPlayer', playerInfo);
    });

    // Tell the src to make foods that are existing
    gameInstance.foodPickup.forEach((food) => {
        this.emit('item_update', food);
    });

    // send message to every connected src except the sender
    this.broadcast.emit('new_enemyPlayer', currentInfo);

    gameInstance.playerList.push(newPlayer);
    sortPlayerListByScore();
}

function onInputFired(data) {
    const movePlayer = findPlayerById(this.id);
    if (!movePlayer || movePlayer.dead) {
        console.log('no player');
        return;
    }

    // when sendData is true, we send the data back to src.
    if (!movePlayer.sendData) {
        return;
    }

    // every 50ms, we send the data.
    setTimeout(() => { movePlayer.sendData = true; }, 50);
    // we set sendData to false when we send the data.
    movePlayer.sendData = false;

    // Make a new pointer with the new inputs from the src.
    // contains player positions in server
    const serverPointer = {
        x: data.pointerX,
        y: data.pointerY,
        worldX: data.pointerWorldX,
        worldY: data.pointerWorldY,
    };

    // moving the player to the new inputs from the player
    if (physicsPlayer.distanceToPointer(movePlayer, serverPointer) <= 30) {
        movePlayer.playerBody.angle = physicsPlayer.moveToPointer(movePlayer, 0, serverPointer, 1000);
    } else {
        movePlayer.playerBody.angle = physicsPlayer.moveToPointer(movePlayer, movePlayer.speed, serverPointer);
    }

    [movePlayer.x, movePlayer.y] = movePlayer.playerBody.position;

    // new player position to be sent back to src.
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

function sortPlayerListByScore() {
    gameInstance.playerList.sort((a, b) => b.size - a.size);
    const playerListSorted = [];
    gameInstance.playerList.forEach((player) => {
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
    gameInstance.foodPickup.splice(gameInstance.foodPickup.indexOf(object), 1);
    sortPlayerListByScore();
    console.log('item picked');
    io.emit('itemremove', object);
    this.emit('item_picked');
}

function playerKilled(player) {
    // find the player and remove it.
    const removePlayer = findPlayerById(player.id);
    if (removePlayer) {
        gameInstance.playerList.splice(gameInstance.playerList.indexOf(removePlayer), 1);
    }
    player.dead = true;
}

function onClientDisconnect() {
    console.log('disconnect');
    const removePlayer = findPlayerById(this.id);
    if (removePlayer) {
        gameInstance.playerList.splice(gameInstance.playerList.indexOf(removePlayer), 1);
    }
    console.log(`removing player ${this.id}`);
    sortPlayerListByScore();
    // send message to every connected src except the sender
    this.broadcast.emit('remove_player', { id: this.id });
}

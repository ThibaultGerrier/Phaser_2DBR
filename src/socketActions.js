import { distanceToPointer, moveToPointer } from './player';
import Global from './Globals';
import RemotePlayer from './RemotePlayer';
import playerCollide from './colide';

const findPlayerById = id => Global.enemies.find(e => e.id === id) || false;

function onNewPlayer(data) {
    // enemy object
    console.log(data);
    const newEnemy = new RemotePlayer(data.id, data.x, data.y, data.size, data.angle);
    Global.enemies.push(newEnemy);
}

function onEnemyMove(data) {
    const movePlayer = findPlayerById(data.id);

    if (!movePlayer) {
        return;
    }

    const newPointer = {
        x: data.x,
        y: data.y,
        worldX: data.x,
        worldY: data.y,
    };


    // check if the server enemy size is not equivalent to the src
    if (data.size !== movePlayer.player.body_size) {
        movePlayer.player.body_size = data.size;
        const newScale = movePlayer.player.body_size / movePlayer.initial_size;
        movePlayer.player.scale.set(newScale);
        movePlayer.player.body.clearShapes();
        movePlayer.player.body.addCircle(movePlayer.player.body_size, 0, 0);
        movePlayer.player.body.data.shapes[0].sensor = true;
    }

    const distance = distanceToPointer(movePlayer.player, newPointer);
    Global.speed = distance / 0.05;
    movePlayer.rotation = moveToPointer(movePlayer.player, Global.speed, newPointer);
}

function onInputReceived(data) {
    // we're forming a new pointer with the new position
    // console.log(Global.game);
    const newPointer = {
        x: data.x,
        y: data.y,
        worldX: data.x,
        worldY: data.y,
    };

    const distance = distanceToPointer(Global.player, newPointer);
    // we're receiving player position every 50ms. We're interpolating
    // between the current position and the new position so that player
    // does jerk.
    Global.speed = distance / 0.05;

    Global.player.rotation = moveToPointer(Global.player, Global.speed, newPointer);
}

function onGained(data) {
    Global.player.body_size = data.new_size;
    const newScale = data.new_size / Global.player.initial_size;
    Global.player.scale.set(newScale);
    // create new body
    Global.player.body.clearShapes();
    Global.player.body.addCircle(Global.player.body_size, 0, 0);
    Global.player.body.data.shapes[0].sensor = true;
}

function onKilled() {
    Global.player.destroy();
}

function onSocketConnected(data) {
    console.log('connected to server');
    Global.gameProperties.inGame = true;
    Global.socket.emit('new_player', {
        username: data.username, x: 0, y: 0, angle: 0,
    });
}

function onRemovePlayer(data) {
    const removePlayer = findPlayerById(data.id);
    // Player not found
    if (!removePlayer) {
        console.log('Player not found: ', data.id);
        return;
    }

    removePlayer.player.destroy();
    Global.enemies.splice(Global.enemies.indexOf(removePlayer), 1);
}

function onLeaderBoardUpdate(data) {
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
        if (!mainPlayerShown && i >= maxPlayerDisplay - 1 && Global.socket.id === data[i].id) {
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
    Global.leaderText.setText(boardString);
}

function onCreatePlayer(data) {
    console.log('onCreatePlayer');

    Global.player = Global.game.add.sprite(100, 100, 'dude');

    // Global.player = Global.game.add.graphics(0, 0);
    Global.player.radius = data.size;

    // set a fill and line style
    // Global.player.beginFill(0xffd900);
    // Global.player.lineStyle(2, 0xffd900, 1);
    // Global.player.drawCircle(0, 0, Global.player.radius * 2);
    // Global.player.endFill();
    Global.player.anchor.setTo(0.5, 0.5);
    Global.player.body_size = Global.player.radius;
    // set the initial size;
    Global.player.initial_size = Global.player.radius;
    const style = { fill: 'black', align: 'center' };
    Global.player.type = 'player_body';

    // draw a shape
    Global.game.physics.p2.enableBody(Global.player, true);
    Global.player.body.clearShapes();
    Global.player.body.addCircle(Global.player.body_size, 0, 0);
    Global.player.body.data.shapes[0].sensor = true;
    // enable collision and when it makes a contact with another body, call player_coll
    Global.player.body.onBeginContact.add(playerCollide, this);
    // player follow text
    Global.player.playertext = Global.game.add.text(0, 0, data.username, style);
    Global.player.addChild(Global.player.playertext);

    // camera follow
    Global.game.camera.follow(Global.player, Phaser.Camera.FOLLOW_LOCKON, 0.5, 0.5);

    Global.player.animations.add('left', [0, 1, 2, 3], 10, true);
    Global.player.animations.add('up', [9, 10, 11, 12], 10, true);
    Global.player.animations.add('right', [5, 6, 7, 8], 10, true);
    Global.player.animations.add('down', [13, 14, 15, 16], 10, true);
    Global.player.animations.add('stop', [4], 10, false);


    console.log(Global.player);
}

export {
    onNewPlayer,
    onEnemyMove,
    onInputReceived,
    onGained,
    onKilled,
    onSocketConnected,
    onRemovePlayer,
    onLeaderBoardUpdate,
    onCreatePlayer,
};

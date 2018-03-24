/* global io */
/* global signdivusername */
/* global signDiv */
/* global entername */
import { game, gameProperties } from './main';

let socket;

entername.onclick = function () {
    if (!gameProperties.in_game) {
        gameProperties.in_game = true;
        // player_properties.username = signdivusername.value;
        signDiv.style.display = 'none';
        socket.emit('enter_name', { username: signdivusername.value });
    }
};

function joinGame(data) {
    game.state.start('main', true, false, data.username);
}

const login = function () {
};

login.prototype = {
    create() {
        game.stage.backgroundColor = '#AFF7F0';
        socket = io({ transports: ['websocket'], upgrade: false });
        socket.on('join_game', joinGame);
    },
};

export {
    login,
    socket,
};

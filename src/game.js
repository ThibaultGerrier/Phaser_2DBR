import ReactDOM from 'react-dom';
import React from 'react';

import App from './App';
import Global from './Globals';
import Main from './Main';
import Login from './Login';

Global.gameProperties = {
    gameWidth: 4000,
    gameHeight: 4000,
    gameElement: 'gameDiv',
    inGame: false,
};

const canvasWidth = window.innerWidth * window.devicePixelRatio;
const canvasHeight = window.innerHeight * window.devicePixelRatio;
Global.game = new Phaser.Game(canvasWidth, canvasHeight, Phaser.CANVAS, 'game-root');

const gameBootstrapper = {
    init() {
        Global.game.state.add('main', Main);
        Global.game.state.add('login', Login);
        Global.game.state.start('login');
    },
};

gameBootstrapper.init();

const playClick = (username) => {
    console.log(username);
    if (!Global.gameProperties.in_game) {
        Global.gameProperties.in_game = true;
        Global.socket.emit('enter_name', { username });
    }
};

ReactDOM.render(<App playClick={playClick}/>, document.getElementById('react-root'));

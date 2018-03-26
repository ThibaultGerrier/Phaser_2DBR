import Global from './Globals';

function joinGame(data) {
    Global.game.state.start('main', true, false, data.username);
}

export default class login {
    preload() {
        Global.game.load.image('2ammo', 'dist/images/2ammo.png');
        Global.game.load.spritesheet(
            'dude',
            'dist/images/guy.png',
            32,
            48,
        );
    }

    create() {
        console.log('create login');
        // game.stage.backgroundColor = '#AFF7F0';
        Global.game.stage.backgroundColor = '#fff';
        Global.socket = io({ transports: ['websocket'], upgrade: false });
        Global.socket.on('join_game', joinGame);
        console.log('joingame');
    }
}

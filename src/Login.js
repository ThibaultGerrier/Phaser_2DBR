import Global from './Globals';

function joinGame(data) {
    Global.game.state.start('main', true, false, data.username);
}

export default class login {
    preload() {
        // images
        Global.game.load.image('2ammo', 'dist/images/2ammo.png');
        Global.game.load.image('grass', 'dist/images/grass_4000_4000.png');
        Global.game.load.image('gun', 'dist/images/gun.png');
        Global.game.load.image('bullet', 'dist/images/bullet.png');
        Global.game.load.spritesheet(
            'dude',
            'dist/images/guy.png',
            32,
            48,
        );

        // audio
        Global.game.load.audio('reload', ['dist/sound/reload.mp3', 'dist/sound/reload.ogg']);
        Global.game.load.audio('ak74', ['dist/sound/ak74.mp3', 'dist/sound/ak74.ogg']);
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

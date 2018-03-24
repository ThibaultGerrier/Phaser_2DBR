/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./client/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./client/FoodObject.js":
/*!******************************!*\
  !*** ./client/FoodObject.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./main */ \"./client/main.js\");\n\n\nclass FoodObject {\n    constructor(id, type, startX, startY) {\n        // unique id for the food.\n        // generated in the server with node-uuid\n        this.id = id;\n\n        // positinon of the food\n        this.posX = startX;\n        this.posY = startY;\n        // this.powerup = value;\n\n        // create a circulr phaser object for food\n        this.item = _main__WEBPACK_IMPORTED_MODULE_0__[\"game\"].add.graphics(this.posX, this.posY);\n        this.item.beginFill(0xFF0000);\n        this.item.lineStyle(2, 0xFF0000, 1);\n        this.item.drawCircle(0, 0, 20);\n\n        this.item.type = 'food_body';\n        this.item.id = id;\n\n        _main__WEBPACK_IMPORTED_MODULE_0__[\"game\"].physics.p2.enableBody(this.item, true);\n        this.item.body.clearShapes();\n        this.item.body_size = 10;\n        this.item.body.addCircle(this.item.body_size, 0, 0);\n        this.item.body.data.gravityScale = 0;\n        this.item.body.data.shapes[0].sensor = true;\n    }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (FoodObject);\n\n\n//# sourceURL=webpack:///./client/FoodObject.js?");

/***/ }),

/***/ "./client/colide.js":
/*!**************************!*\
  !*** ./client/colide.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _login__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./login */ \"./client/login.js\");\n\r\n\r\nfunction playerCollide(body) {\r\n    console.log('collision');\r\n    console.log(this.socket);\r\n    // the id of the collided body that player made contact with\r\n    const key = body.sprite.id;\r\n    // the type of the body the player made contact with\r\n    const { type } = body.sprite;\r\n    if (type === 'player_body') {\r\n        // send the player collision\r\n        _login__WEBPACK_IMPORTED_MODULE_0__[\"socket\"].emit('player_collision', { id: key });\r\n    } else if (type === 'food_body') {\r\n        console.log('items food');\r\n        _login__WEBPACK_IMPORTED_MODULE_0__[\"socket\"].emit('item_picked', { id: key });\r\n    }\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (playerCollide);\r\n\n\n//# sourceURL=webpack:///./client/colide.js?");

/***/ }),

/***/ "./client/item.js":
/*!************************!*\
  !*** ./client/item.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _FoodObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FoodObject */ \"./client/FoodObject.js\");\n\r\n\r\nclass Item {\r\n    constructor() {\r\n        this.foodPickup = [];\r\n    }\r\n\r\n    onItemUpdate(data) {\r\n        this.foodPickup.push(new _FoodObject__WEBPACK_IMPORTED_MODULE_0__[\"default\"](data.id, data.type, data.x, data.y));\r\n    }\r\n\r\n    findItemById(id) {\r\n        return this.foodPickup.find(f => f.id === id) || false;\r\n    }\r\n\r\n    onItemRemove(data) {\r\n        const removeItem = this.findItemById(data.id);\r\n        this.foodPickup.splice(this.foodPickup.indexOf(removeItem), 1);\r\n\r\n        // destroy the phaser object\r\n        removeItem.item.destroy(true, false);\r\n    }\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (Item);\r\n\n\n//# sourceURL=webpack:///./client/item.js?");

/***/ }),

/***/ "./client/login.js":
/*!*************************!*\
  !*** ./client/login.js ***!
  \*************************/
/*! exports provided: login, socket */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"login\", function() { return login; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"socket\", function() { return socket; });\n/* harmony import */ var _main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./main */ \"./client/main.js\");\n/* global io */\r\n/* global signdivusername */\r\n/* global signDiv */\r\n/* global entername */\r\n\r\n\r\nlet socket;\r\n\r\nentername.onclick = function () {\r\n    if (!_main__WEBPACK_IMPORTED_MODULE_0__[\"gameProperties\"].in_game) {\r\n        _main__WEBPACK_IMPORTED_MODULE_0__[\"gameProperties\"].in_game = true;\r\n        // player_properties.username = signdivusername.value;\r\n        signDiv.style.display = 'none';\r\n        socket.emit('enter_name', { username: signdivusername.value });\r\n    }\r\n};\r\n\r\nfunction joinGame(data) {\r\n    _main__WEBPACK_IMPORTED_MODULE_0__[\"game\"].state.start('main', true, false, data.username);\r\n}\r\n\r\nconst login = function () {\r\n};\r\n\r\nlogin.prototype = {\r\n    create() {\r\n        _main__WEBPACK_IMPORTED_MODULE_0__[\"game\"].stage.backgroundColor = '#AFF7F0';\r\n        socket = io({ transports: ['websocket'], upgrade: false });\r\n        socket.on('join_game', joinGame);\r\n    },\r\n};\r\n\r\n\r\n\n\n//# sourceURL=webpack:///./client/login.js?");

/***/ }),

/***/ "./client/main.js":
/*!************************!*\
  !*** ./client/main.js ***!
  \************************/
/*! exports provided: game, gameProperties */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"game\", function() { return game; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"gameProperties\", function() { return gameProperties; });\n/* harmony import */ var _colide__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./colide */ \"./client/colide.js\");\n/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player */ \"./client/player.js\");\n/* harmony import */ var _item__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./item */ \"./client/item.js\");\n/* harmony import */ var _login__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./login */ \"./client/login.js\");\n/* eslint-disable no-use-before-define */\r\n/* eslint-disable no-param-reassign */\r\n/* global window */\r\n/* global Phaser */\r\n\r\n// import Phaser from './lib/phaser';\r\n\r\n\r\n\r\n\r\n\r\nlet player;\r\nlet speed;\r\nlet leaderText;\r\nconst canvasWidth = window.innerWidth * window.devicePixelRatio;\r\nconst canvasHeight = window.innerHeight * window.devicePixelRatio;\r\n\r\nconst game = new Phaser.Game(canvasWidth, canvasHeight, Phaser.CANVAS, 'gameDiv');\r\n\r\n// the enemy player list\r\nconst enemies = [];\r\n\r\nconst gameProperties = {\r\n    gameWidth: 4000,\r\n    gameHeight: 4000,\r\n    gameElement: 'gameDiv',\r\n    inGame: false,\r\n};\r\n\r\nconst main = function () {};\r\n\r\nfunction onsocketConnected(data) {\r\n    console.log('connected to server');\r\n    gameProperties.inGame = true;\r\n    _login__WEBPACK_IMPORTED_MODULE_3__[\"socket\"].emit('new_player', {\r\n        username: data.username, x: 0, y: 0, angle: 0,\r\n    });\r\n}\r\n\r\n// When the server notifies us of client disconnection, we find the disconnected\r\n// enemy and remove from our game\r\nfunction onRemovePlayer(data) {\r\n    const removePlayer = findplayerbyid(data.id);\r\n    // Player not found\r\n    if (!removePlayer) {\r\n        console.log('Player not found: ', data.id);\r\n        return;\r\n    }\r\n\r\n    removePlayer.player.destroy();\r\n    enemies.splice(enemies.indexOf(removePlayer), 1);\r\n}\r\n\r\nfunction createPlayer(data) {\r\n    player = game.add.graphics(0, 0);\r\n    player.radius = data.size;\r\n\r\n    // set a fill and line style\r\n    player.beginFill(0xffd900);\r\n    player.lineStyle(2, 0xffd900, 1);\r\n    player.drawCircle(0, 0, player.radius * 2);\r\n    player.endFill();\r\n    player.anchor.setTo(0.5, 0.5);\r\n    player.body_size = player.radius;\r\n    // set the initial size;\r\n    player.initial_size = player.radius;\r\n    const style = { fill: 'black', align: 'center' };\r\n    player.type = 'player_body';\r\n\r\n    // draw a shape\r\n    game.physics.p2.enableBody(player, true);\r\n    player.body.clearShapes();\r\n    player.body.addCircle(player.body_size, 0, 0);\r\n    player.body.data.shapes[0].sensor = true;\r\n    // enable collision and when it makes a contact with another body, call player_coll\r\n    player.body.onBeginContact.add(_colide__WEBPACK_IMPORTED_MODULE_0__[\"default\"], this);\r\n    // player follow text\r\n    player.playertext = game.add.text(0, 0, data.username, style);\r\n    player.addChild(player.playertext);\r\n\r\n    // camera follow\r\n    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.5, 0.5);\r\n}\r\n\r\n// this is the enemy class.\r\nconst RemotePlayer = function (id, startX, startY, startSize, startAngle) {\r\n    this.x = startX;\r\n    this.y = startY;\r\n    // this is the unique socket id. We use it as a unique name for enemy\r\n    this.id = id;\r\n    this.angle = startAngle;\r\n\r\n    this.player = game.add.graphics(this.x, this.y);\r\n    // intialize the size with the server value\r\n    this.player.radius = startSize;\r\n\r\n    // set a fill and line style\r\n    this.player.beginFill(0xffd900);\r\n    this.player.lineStyle(2, 0xffd900, 1);\r\n    this.player.drawCircle(0, 0, this.player.radius * 2);\r\n    this.player.endFill();\r\n    this.player.anchor.setTo(0.5, 0.5);\r\n    // we set the initial size;\r\n    this.initial_size = startSize;\r\n    this.player.body_size = this.player.radius;\r\n    this.player.type = 'player_body';\r\n    this.player.id = this.id;\r\n\r\n    // draw a shape\r\n    game.physics.p2.enableBody(this.player, true);\r\n    this.player.body.clearShapes();\r\n    this.player.body.addCircle(this.player.body_size, 0, 0);\r\n    this.player.body.data.shapes[0].sensor = true;\r\n};\r\n\r\n// Server will tell us when a new enemy player connects to the server.\r\n// We create a new enemy in our game.\r\nfunction onNewPlayer(data) {\r\n    // enemy object\r\n    console.log(data);\r\n    const newEnemy = new RemotePlayer(data.id, data.x, data.y, data.size, data.angle);\r\n    enemies.push(newEnemy);\r\n}\r\n\r\n// Server tells us there is a new enemy movement. We find the moved enemy\r\n// and sync the enemy movement with the server\r\nfunction onEnemyMove(data) {\r\n    const movePlayer = findplayerbyid(data.id);\r\n\r\n    if (!movePlayer) {\r\n        return;\r\n    }\r\n\r\n    const newPointer = {\r\n        x: data.x,\r\n        y: data.y,\r\n        worldX: data.x,\r\n        worldY: data.y,\r\n    };\r\n\r\n\r\n    // check if the server enemy size is not equivalent to the client\r\n    if (data.size !== movePlayer.player.body_size) {\r\n        movePlayer.player.body_size = data.size;\r\n        const newScale = movePlayer.player.body_size / movePlayer.initial_size;\r\n        movePlayer.player.scale.set(newScale);\r\n        movePlayer.player.body.clearShapes();\r\n        movePlayer.player.body.addCircle(movePlayer.player.body_size, 0, 0);\r\n        movePlayer.player.body.data.shapes[0].sensor = true;\r\n    }\r\n\r\n    const distance = Object(_player__WEBPACK_IMPORTED_MODULE_1__[\"distanceToPointer\"])(movePlayer.player, newPointer);\r\n    speed = distance / 0.05;\r\n    movePlayer.rotation = Object(_player__WEBPACK_IMPORTED_MODULE_1__[\"moveToPointer\"])(movePlayer.player, speed, newPointer);\r\n}\r\n\r\n// we're receiving the calculated position from the server and changing the player position\r\nfunction onInputRecieved(data) {\r\n    // we're forming a new pointer with the new position\r\n    const newPointer = {\r\n        x: data.x,\r\n        y: data.y,\r\n        worldX: data.x,\r\n        worldY: data.y,\r\n    };\r\n\r\n    const distance = Object(_player__WEBPACK_IMPORTED_MODULE_1__[\"distanceToPointer\"])(player, newPointer);\r\n    // we're receiving player position every 50ms. We're interpolating\r\n    // between the current position and the new position so that player\r\n    // does jerk.\r\n    speed = distance / 0.05;\r\n\r\n    player.rotation = Object(_player__WEBPACK_IMPORTED_MODULE_1__[\"moveToPointer\"])(player, speed, newPointer);\r\n}\r\n\r\nfunction onGained(data) {\r\n    player.body_size = data.new_size;\r\n    const newScale = data.new_size / player.initial_size;\r\n    player.scale.set(newScale);\r\n    // create new body\r\n    player.body.clearShapes();\r\n    player.body.addCircle(player.body_size, 0, 0);\r\n    player.body.data.shapes[0].sensor = true;\r\n}\r\n\r\nfunction onKilled() {\r\n    player.destroy();\r\n}\r\n\r\n\r\n// This is where we use the socket id.\r\n// Search through enemies list to find the right enemy of the id.\r\nconst findplayerbyid = id => enemies.find(e => e.id === id) || false;\r\n\r\n// create leader board in here.\r\nfunction createLeaderBoard() {\r\n    const leaderBox = game.add.graphics(game.width * 0.81, game.height * 0.05);\r\n    leaderBox.fixedToCamera = true;\r\n    // draw a rectangle\r\n    leaderBox.beginFill(0xD3D3D3, 0.3);\r\n    leaderBox.lineStyle(2, 0x202226, 1);\r\n    leaderBox.drawRect(0, 0, 300, 400);\r\n\r\n    const style = {\r\n        font: '13px Press Start 2P', fill: 'black', align: 'left', fontSize: '22px',\r\n    };\r\n\r\n    leaderText = game.add.text(10, 10, '', style);\r\n    leaderText.anchor.set(0);\r\n\r\n    leaderBox.addChild(leaderText);\r\n}\r\n\r\n// leader board\r\nfunction lbupdate(data) {\r\n    // this is the final board string.\r\n    let boardString = '';\r\n    const maxlen = 10;\r\n    const maxPlayerDisplay = 10;\r\n    let mainPlayerShown = false;\r\n\r\n    for (let i = 0; i < data.length; i += 1) {\r\n        // if the mainplayer is shown along the iteration, set it to true\r\n\r\n        if (mainPlayerShown && i >= maxPlayerDisplay) {\r\n            break;\r\n        }\r\n\r\n        // if the player's rank is very low, we display maxPlayerDisplay - 1 names in the leaderboard\r\n        // and then add three dots at the end, and show player's rank.\r\n        if (!mainPlayerShown && i >= maxPlayerDisplay - 1 && _login__WEBPACK_IMPORTED_MODULE_3__[\"socket\"].id === data[i].id) {\r\n            boardString = boardString.concat('.\\n');\r\n            boardString = boardString.concat('.\\n');\r\n            boardString = boardString.concat('.\\n');\r\n            mainPlayerShown = true;\r\n        }\r\n\r\n        // here we are checking if user id is greater than 10 characters, if it is\r\n        // it is too long, so we're going to trim it.\r\n        if (data[i].username.length >= 10) {\r\n            let { username } = data[i];\r\n            let temp = '';\r\n            for (let j = 0; j < maxlen; j += 1) {\r\n                temp += username[j];\r\n            }\r\n\r\n            temp += '...';\r\n            username = temp;\r\n\r\n            boardString = boardString.concat(i + 1, ': ');\r\n            boardString = boardString.concat(username, ' ', `${(data[i].size).toString()}\\n`);\r\n        } else {\r\n            boardString = boardString.concat(i + 1, ': ');\r\n            boardString = boardString.concat(data[i].username, ' ', `${(data[i].size).toString()}\\n`);\r\n        }\r\n    }\r\n\r\n    console.log(boardString);\r\n    leaderText.setText(boardString);\r\n}\r\n\r\nconst item = new _item__WEBPACK_IMPORTED_MODULE_2__[\"default\"](game);\r\n\r\nmain.prototype = {\r\n    init(username) {\r\n        // when the socket connects, call the onsocketconnected and send its information to the server\r\n        _login__WEBPACK_IMPORTED_MODULE_3__[\"socket\"].emit('logged_in', { username });\r\n\r\n        // when the player enters the game\r\n        _login__WEBPACK_IMPORTED_MODULE_3__[\"socket\"].on('enter_game', onsocketConnected);\r\n    },\r\n\r\n    preload() {\r\n        game.stage.disableVisibilityChange = true;\r\n        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;\r\n        game.world.setBounds(0, 0, gameProperties.gameWidth, gameProperties.gameHeight, false, false, false, false);\r\n        game.physics.startSystem(Phaser.Physics.P2JS);\r\n        game.physics.p2.setBoundsToWorld(false, false, false, false, false);\r\n        game.physics.p2.gravity.y = 0;\r\n        game.physics.p2.applyGravity = false;\r\n        game.physics.p2.enableBody(game.physics.p2.walls, false);\r\n        // physics start system\r\n        // game.physics.p2.setImpactEvents(true);\r\n    },\r\n\r\n    create() {\r\n        game.stage.backgroundColor = 0xE1A193;\r\n\r\n        console.log('client started');\r\n\r\n        // listen for main player creation\r\n        _login__WEBPACK_IMPORTED_MODULE_3__[\"socket\"].on('create_player', createPlayer);\r\n        // listen to new enemy connections\r\n        _login__WEBPACK_IMPORTED_MODULE_3__[\"socket\"].on('new_enemyPlayer', onNewPlayer);\r\n        // listen to enemy movement\r\n        _login__WEBPACK_IMPORTED_MODULE_3__[\"socket\"].on('enemy_move', onEnemyMove);\r\n        // when received remove_player, remove the player passed;\r\n        _login__WEBPACK_IMPORTED_MODULE_3__[\"socket\"].on('remove_player', onRemovePlayer);\r\n        // when the player receives the new input\r\n        _login__WEBPACK_IMPORTED_MODULE_3__[\"socket\"].on('input_recieved', onInputRecieved);\r\n        // when the player gets killed\r\n        _login__WEBPACK_IMPORTED_MODULE_3__[\"socket\"].on('killed', onKilled);\r\n        // when the player gains in size\r\n        _login__WEBPACK_IMPORTED_MODULE_3__[\"socket\"].on('gained', onGained);\r\n        // check for item removal\r\n        _login__WEBPACK_IMPORTED_MODULE_3__[\"socket\"].on('itemremove', data => item.onItemRemove(data));\r\n        // check for item update\r\n        _login__WEBPACK_IMPORTED_MODULE_3__[\"socket\"].on('item_update', data => item.onItemUpdate(data));\r\n        // check for leaderboard\r\n        _login__WEBPACK_IMPORTED_MODULE_3__[\"socket\"].on('leader_board', lbupdate);\r\n\r\n        createLeaderBoard();\r\n    },\r\n\r\n    update() {\r\n        // emit the player input\r\n\r\n        // move the player when the player is made\r\n        if (gameProperties.inGame) {\r\n            // we're making a new mouse pointer and sending this input to\r\n            // the server.\r\n            const pointer = game.input.mousePointer;\r\n\r\n            // Send a new position data to the server\r\n            _login__WEBPACK_IMPORTED_MODULE_3__[\"socket\"].emit('input_fired', {\r\n                pointerX: pointer.x,\r\n                pointerY: pointer.y,\r\n                pointerWorldX: pointer.worldX,\r\n                pointerWorldY: pointer.worldY,\r\n            });\r\n        }\r\n    },\r\n};\r\n\r\nconst gameBootstrapper = {\r\n    init() {\r\n        game.state.add('main', main);\r\n        game.state.add('login', _login__WEBPACK_IMPORTED_MODULE_3__[\"login\"]);\r\n        game.state.start('login');\r\n    },\r\n};\r\n\r\ngameBootstrapper.init();\r\n\r\n\r\n\n\n//# sourceURL=webpack:///./client/main.js?");

/***/ }),

/***/ "./client/player.js":
/*!**************************!*\
  !*** ./client/player.js ***!
  \**************************/
/*! exports provided: moveToPointer, distanceToPointer, angleToPointer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"moveToPointer\", function() { return moveToPointer; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"distanceToPointer\", function() { return distanceToPointer; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"angleToPointer\", function() { return angleToPointer; });\n/* eslint-disable no-use-before-define */\r\n/* eslint-disable no-param-reassign */\r\n\r\nfunction moveToPointer(displayObject, speed, pointer, maxTime) {\r\n    const angle = angleToPointer(displayObject, pointer);\r\n    if (maxTime > 0) {\r\n        speed = distanceToPointer(displayObject, pointer) / (maxTime / 1000);\r\n    }\r\n\r\n    displayObject.body.velocity.x = Math.cos(angle) * speed;\r\n    displayObject.body.velocity.y = Math.sin(angle) * speed;\r\n\r\n    return angle;\r\n}\r\n\r\nfunction distanceToPointer(displayObject, pointer, world = false) {\r\n    const dx = (world) ? displayObject.world.x - pointer.worldX : displayObject.x - pointer.worldX;\r\n    const dy = (world) ? displayObject.world.y - pointer.worldY : displayObject.y - pointer.worldY;\r\n\r\n    return Math.sqrt((dx * dx) + (dy * dy));\r\n}\r\n\r\nfunction angleToPointer(displayObject, pointer, world = false) {\r\n    if (world) {\r\n        return Math.atan2(pointer.worldY - displayObject.world.y, pointer.worldX - displayObject.world.x);\r\n    }\r\n    return Math.atan2(pointer.worldY - displayObject.y, pointer.worldX - displayObject.x);\r\n}\r\n\r\n\r\n\n\n//# sourceURL=webpack:///./client/player.js?");

/***/ })

/******/ });
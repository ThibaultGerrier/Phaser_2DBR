import Global from './Globals';

function playerCollide(body) {
    console.log('collision');
    // the id of the collided body that player made contact with
    const key = body.sprite.id;
    // the type of the body the player made contact with
    const { type } = body.sprite;
    if (type === 'player_body') {
        // send the player collision
        Global.socket.emit('player_collision', { id: key });
    } else if (type === 'food_body') {
        console.log('items food');
        Global.socket.emit('item_picked', { id: key });
    }
}

export default playerCollide;

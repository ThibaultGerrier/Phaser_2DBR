import { socket } from './login';

function playerCollide(body) {
    console.log('collision');
    console.log(this.socket);
    // the id of the collided body that player made contact with
    const key = body.sprite.id;
    // the type of the body the player made contact with
    const { type } = body.sprite;
    if (type === 'player_body') {
        // send the player collision
        socket.emit('player_collision', { id: key });
    } else if (type === 'food_body') {
        console.log('items food');
        socket.emit('item_picked', { id: key });
    }
}

export default playerCollide;

/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */

function moveToPointer(displayObject, speed, pointer, maxTime = 0) {
    const angle = angleToPointer(displayObject, pointer);
    let newSpeed = speed;
    if (maxTime > 0) {
        //  We know how many pixels we need to move, but how fast?
        newSpeed = distanceToPointer(displayObject, pointer) / (maxTime / 1000);
    }
    displayObject.playerBody.velocity[0] = Math.cos(angle) * newSpeed;
    displayObject.playerBody.velocity[1] = Math.sin(angle) * newSpeed;
    return angle;
}

function distanceToPointer(displayObject, pointer, world = false) {
    const dx = (world) ? displayObject.world.x - pointer.worldX : displayObject.playerBody.position[0] - pointer.worldX;
    const dy = (world) ? displayObject.world.y - pointer.worldY : displayObject.playerBody.position[1] - pointer.worldY;
    return Math.sqrt((dx * dx) + (dy * dy));
}

function angleToPointer(displayObject, pointer, world = false) {
    if (world) {
        return Math.atan2(pointer.worldY - displayObject.world.y, pointer.worldX - displayObject.world.x);
    }
    return Math.atan2(
        pointer.worldY - displayObject.playerBody.position[1],
        pointer.worldX - displayObject.playerBody.position[0],
    );
}

// we export these three functions
module.exports = {
    moveToPointer,
    distanceToPointer,
    angleToPointer,
};

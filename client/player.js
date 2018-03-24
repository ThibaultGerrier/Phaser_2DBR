/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */

function moveToPointer(displayObject, speed, pointer, maxTime) {
    const angle = angleToPointer(displayObject, pointer);
    if (maxTime > 0) {
        speed = distanceToPointer(displayObject, pointer) / (maxTime / 1000);
    }

    displayObject.body.velocity.x = Math.cos(angle) * speed;
    displayObject.body.velocity.y = Math.sin(angle) * speed;

    return angle;
}

function distanceToPointer(displayObject, pointer, world = false) {
    const dx = (world) ? displayObject.world.x - pointer.worldX : displayObject.x - pointer.worldX;
    const dy = (world) ? displayObject.world.y - pointer.worldY : displayObject.y - pointer.worldY;

    return Math.sqrt((dx * dx) + (dy * dy));
}

function angleToPointer(displayObject, pointer, world = false) {
    if (world) {
        return Math.atan2(pointer.worldY - displayObject.world.y, pointer.worldX - displayObject.world.x);
    }
    return Math.atan2(pointer.worldY - displayObject.y, pointer.worldX - displayObject.x);
}

export {
    moveToPointer,
    distanceToPointer,
    angleToPointer,
};

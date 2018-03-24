import FoodObject from './FoodObject';

class Item {
    constructor() {
        this.foodPickup = [];
    }

    onItemUpdate(data) {
        this.foodPickup.push(new FoodObject(data.id, data.type, data.x, data.y));
    }

    findItemById(id) {
        return this.foodPickup.find(f => f.id === id) || false;
    }

    onItemRemove(data) {
        const removeItem = this.findItemById(data.id);
        this.foodPickup.splice(this.foodPickup.indexOf(removeItem), 1);

        // destroy the phaser object
        removeItem.item.destroy(true, false);
    }
}

export default Item;

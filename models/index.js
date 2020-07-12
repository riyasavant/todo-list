const mongoose = require('mongoose');

const itemsSchema = {
    name: String
};

const listSchema =  {
    name: String,
    items: [itemsSchema]
}

module.exports = {
    Item: mongoose.model("Item", itemsSchema),
    List: mongoose.model('List', listSchema)
}




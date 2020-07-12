//require all the external modules
const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname+"/date.js");
const mongoose = require('mongoose');
const app = express();


//to tell express to make use of the static files in the public directory.
app.use(express.static(__dirname+'/public'));

//to parse the request
app.use(bodyParser.urlencoded({extended: true}));

//view engine ejs used for templating.
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: 'Welcome to the to-do List'
});

const item2 = new Item({
    name: 'Press the Add button to add items'
});

const item3 = new Item({
    name: 'Press the Delete button to delete items'
});

const items = [item1, item2, item3];

app.get('/', function(req, res) {

    Item.find({}, function(err, result){
        if(err){
            console.log('Error finding the items.')
        }else {

            if(result.length === 0) {
                Item.insertMany(items, function(err) {
                    if (err) {
                        console.log('Error while adding items');
                    } else {
                        console.log('Inserted successfully!');
                    }
                });
                res.redirect('/');
            }
            else {
                res.render("todo", {title: 'To-do List', todoItems: result});
            }    
        }
    })

    
});


app.post('/', function(req, res) {
    
    //to manage the inputs on add or delete buttons.
    var itemName = req.body.item;
        
    const item = new Item({
        name: itemName
    });

    item.save();

    //riderection instead of render is used so that the same page is rendered again through the / route with dynamic changes.
    res.redirect('/');
})

app.post('/delete', function(req, res) {
    const deleteItemId = req.body.deleteItem;
    Item.findByIdAndRemove(deleteItemId, function(err){
        if(err){
            console.log('Error while deleting');
        }else{
            console.log('Successfully deleted!');
        }
        
    })
    res.redirect('/');
})


app.get('/:listName', function(req, res){
    const list = req.params.listName;
    console.log(list);
})

app.listen(3000, () => console.log('Server active on port 3000'));
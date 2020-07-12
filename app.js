//require all the external modules
const express = require('express');
const _ = require('lodash');
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

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model('List', listSchema);

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
                res.render("todo", {title: 'To-do', todoItems: result});
            }    
        }
    })

    
});

app.post('/', function(req, res) {
    
    //to manage the inputs on add or delete buttons.
    var itemName = req.body.item;
    var listName = req.body.button;  
    const item = new Item({
        name: itemName
    });

    if(listName === 'To-do') {
        item.save();

        //riderection instead of render is used so that the same page is rendered again through the / route with dynamic changes.
        res.redirect('/');
    } else {
        List.findOne({name: listName}, function(err, foundList){
            if(err){
                console.log('Error!');
            }else {
                foundList.items.push(item);
                foundList.save();
                res.redirect('/' + listName);
            }
        })
    }
    
})

app.post('/delete', function(req, res) {
    const deleteItemId = req.body.deleteItem;
    const listName = req.body.listName;

    if(listName === 'To-do'){
        Item.findByIdAndRemove(deleteItemId, function(err){
            if(err){
                console.log('Error while deleting');
            }else{
                console.log('Successfully deleted!');
            }
            res.redirect('/');
        })
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: deleteItemId}}}, function(err, foundList){
            if(!err){
                res.redirect('/' + listName);
            }
        })
    }
})

app.get('/:listName', function(req, res){
    const listName = _.capitalize(req.params.listName);
    
    List.findOne({name: listName}, function(err, foundList){
        if(err){
            console.log("Error!");
        }else {
            if(!foundList){
                const list = new List({
                    name: listName,
                    items: items
                });
                
                list.save();
                const pathUrl = '/' + listName;
                res.redirect(pathUrl);

            }else {
                res.render("todo", {title: listName, todoItems: foundList.items})
            }
        }
    })

})

app.listen(3000, () => console.log('Server active on port 3000'));
const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const model = require('../models/index');

const _ = require('lodash');
router.use(bodyParser.urlencoded({extended: true}));

const item1 = new model.Item({
    name: 'Welcome to the to-do List'
});

const item2 = new model.Item({
    name: 'Press the Add button to add items'
});

const item3 = new model.Item({
    name: 'Press the Delete button to delete items'
});

const items = [item1, item2, item3];

router.get('/', function(req, res) {

    model.Item.find({}, function(err, result){
        if(err){
            console.log('Error finding the items.')
        }else {

            if(result.length === 0) {
                model.Item.insertMany(items, function(err) {
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

router.get('/:listName', function(req, res){
    const listName = _.capitalize(req.params.listName);
    
    model.List.findOne({name: listName}, function(err, foundList){
        if(err){
            console.log("Error!");
        }else {
            if(!foundList){
                const list = new model.List({
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

router.post('/', function(req, res) {
    
    //to manage the inputs on add or delete buttons.
    var itemName = req.body.item;
    var listName = req.body.button;  
    const item = new model.Item({
        name: itemName
    });

    if(listName === 'To-do') {
        item.save();

        //riderection instead of render is used so that the same page is rendered again through the / route with dynamic changes.
        res.redirect('/');
    } else {
        model.List.findOne({name: listName}, function(err, foundList){
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

router.post('/delete', function(req, res) {
    const deleteItemId = req.body.deleteItem;
    const listName = req.body.listName;

    if(listName === 'To-do'){
        model.Item.findByIdAndRemove(deleteItemId, function(err){
            if(err){
                console.log('Error while deleting');
            }else{
                console.log('Successfully deleted!');
            }
            res.redirect('/');
        })
    } else {
        model.List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: deleteItemId}}}, function(err, foundList){
            if(!err){
                res.redirect('/' + listName);
            }
        })
    }
})

module.exports = router;
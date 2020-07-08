//require all the external modules
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

//create an array in the global scope to hold the items added or deleted.
const items = ["Coding"];

//to tell express to make use of the static files in the public directory.
app.use(express.static(__dirname+'/public'));

//to parse the request
app.use(bodyParser.urlencoded({extended: true}));

//view engine ejs used for templating.
app.set('view engine', 'ejs');

app.get('/', function(req, res) {

    //to get the weekday, month and day in either month or numeric format.
    const event = new Date();
    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }

    res.render("todo", {title: event.toLocaleDateString('en-GB', options), todoItems: items});
});


app.post('/', function(req, res) {
    
    //to manage the inputs on add or delete buttons.
    if(req.body.button === 'pressed') {
        var getItem = req.body.item;
        items.push(getItem);
    } else if(req.body.buttonDelete === 'pressed') {
        items.pop();
    }

    //riderection instead of render is used so that the same page is rendered again through the / route with dynamic changes.
    res.redirect('/');
})

app.listen(3000, () => console.log('Server active on port 3000'));
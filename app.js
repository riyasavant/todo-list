const express = require('express');
const bodyParser = require('body-parser');
const app = express();


const items = ["Coding"];
const titleName = "TO-DO LIST";

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render("todo", {title: titleName, todoItems: items});
});

app.post('/', function(req, res) {
    
    if(req.body.button === 'pressed') {
        var getItem = req.body.item;
        items.push(getItem);
    } else if(req.body.buttonDelete === 'pressed') {
        items.pop();
    }
    res.redirect('/');
})

app.listen(3000, () => console.log('Server active on port 3000'));
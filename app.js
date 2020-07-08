const express = require('express');
const bodyParser = require('body-parser');
const app = express();


const names = ["Goof"];
const dogList = "Dog List";

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');



app.get('/', function(req, res) {


    res.render("dog", {title: dogList, dogNames: names});


});

app.post('/', function(req, res) {
    
    if(req.body.button === 'pressed') {
        var name = req.body.item;
        names.push(name);
    } else if(req.body.buttonDelete === 'pressed') {
        names.pop();
    }
    res.redirect('/');
})

app.listen(3000, () => console.log('Server active on port 3000'));
const hb = require('express-handlebars');
const express = require('express');

module.exports = (app)=>{
    app.engine('handlebars',hb({defaultLayout:'main'}));
    app.set('view engine','handlebars');
    app.use(express.static('public'));
    app.use(express.urlencoded({extended:false}))
    app.use(express.json());
}
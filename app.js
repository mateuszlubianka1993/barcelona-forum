const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./utils/database').mongoConnect;
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const forumRoutes = require('./routes/forum');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('5fd4c424782070bc5ddf6c33')
    .then(user => {
        req.user = new User(user.name, user.email, user.favouriteNews, user._id);
        next();
    })
    .catch(err => {
        console.log(err);
    });
});

app.use('/admin', adminRoutes);
app.use(forumRoutes);

app.use(errorController.get404Page);

mongoConnect(() => {
    app.listen(3000);
});

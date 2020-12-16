const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://xiedzu1503:mpJaGC9kRel7oPTF@cluster0.oqfff.mongodb.net/forum?retryWrites=true&w=majority';

const app = express();
const store = new MongoDbStore({
	uri: MONGODB_URI,
	collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const forumRoutes = require('./routes/forum');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({extended: false}));
const dirname = path.resolve();
app.use(express.static(path.join(dirname, 'public')));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: store}));

app.use((req, res, next) => {
	User.findById('5fd8cf32f5f4be1100bf7ef9')
		.then(user => {
			req.user = user;
			next();
		})
		.catch(err => {
			console.log(err);
		});
});

app.use('/admin', adminRoutes);
app.use(forumRoutes);
app.use(authRoutes);

app.use(errorController.get404Page);

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		User.findOne()
			.then(user => {
				if(!user) {
					const user = new User({
						username: 'Xiedzu',
						email: 'xiedzu@test.pl',
						favouriteNews: {
							items: []
						}
					});
					user.save();
				}
			});
    
		app.listen(3000);
	})
	.catch(err => {
		console.log(err);
	});

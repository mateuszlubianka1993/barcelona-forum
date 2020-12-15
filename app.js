const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const forumRoutes = require('./routes/forum');

app.use(bodyParser.urlencoded({extended: false}));
const dirname = path.resolve();
app.use(express.static(path.join(dirname, 'public')));

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

app.use(errorController.get404Page);

mongoose.connect('mongodb+srv://xiedzu1503:mpJaGC9kRel7oPTF@cluster0.oqfff.mongodb.net/forum?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
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

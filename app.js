const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
const connectFlash = require('connect-flash');
const multer = require('multer');
const {v4} = require('uuid');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://xiedzu1503:mpJaGC9kRel7oPTF@cluster0.oqfff.mongodb.net/forum?retryWrites=true&w=majority';

const app = express();
const store = new MongoDbStore({
	uri: MONGODB_URI,
	collection: 'sessions'
});
const csurfProtect = csurf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const forumRoutes = require('./routes/forum');
const authRoutes = require('./routes/auth');

const fileStore = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, 'images');
	},
	filename: (req, file, callback) => {
		callback(null, v4() + '-' + file.originalname);
	}
});

const fileFilter = (req, file, callback) => {
	if(file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
		callback(null, true);
	} else {
		callback(null, false);
	}
};

app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({storage: fileStore, fileFilter: fileFilter}).single('image'));

const dirname = path.resolve();
app.use(express.static(path.join(dirname, 'public')));
app.use('/images', express.static(path.join(dirname, 'images')));

app.use(session({
	secret: 'my secret', 
	resave: false, 
	saveUninitialized: false, 
	store: store
}));
app.use(csurfProtect);
app.use(connectFlash());

app.use((req, res, next) => {
	if(!req.session.user) {
		return next();
	}
	User.findById(req.session.user._id)
		.then(user => {
			if(!user) {
				return next();
			}
			req.user = user;
			next();
		})
		.catch(err => {
			throw new Error(err);
		});
});

app.use((req, res, next) => {
	if(!req.session.user) {
		return next();
	}
	User.findById(req.session.user._id)
		.then(user => {
			req.user = user;
			next();
		})
		.catch(err => {
			console.log(err);
		});
});

app.use((req, res, next) => {
	res.locals.isAuth = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

app.use('/admin', adminRoutes);
app.use(forumRoutes);
app.use(authRoutes);

app.use(errorController.get404Page);

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		app.listen(3000);
	})
	.catch(err => {
		console.log(err);
	});

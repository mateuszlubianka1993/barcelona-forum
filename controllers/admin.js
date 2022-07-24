const News = require('../models/news');
const User = require('../models/user');
const { getStorage, ref, getDownloadURL,  deleteObject  } = require('firebase/storage');
const { initializeApp  } = require('firebase/app');

const firebaseConfig = {
	apiKey: process.env.FIREBASE_APP_API_KEY,
	authDomain: process.env.FIREBASE_APP_AUTH_DOMAIN,
	projectId:process.env.FIREBASE_APP_PROJECT_ID,
	storageBucket: process.env.FIREBASE_APP_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_APP_MESSAGE_SENDING_ID,
	appId: process.env.FIREBASE_APP_ID,
	measurementId: process.env.FIREBASE_APP_MEASURMENT_ID
};

initializeApp(firebaseConfig);

const saveNews = (singleNews, res) => {
	singleNews.save().then(() => {
		res.redirect('/admin/news-list');
	}).catch(err => {
		console.log(err);
	});
};

exports.getAddNews = (req, res) => {
	res.render('admin/edit-news', {
		pageTitle: 'Forum Add News Page',
		path: '/admin/add-news',
		editing: false
	});
};

exports.postAddNews = (req, res) => {
	const title = req.body.title;
	const image = req.file;
	const description = req.body.description;
	const content = req.body.content;
	
	if(!image) {
		return res.status(422).render('admin/edit-news', {
			pageTitle: 'Forum Add News Page',
			path: '/admin/add-news',
			editing: false
		});
	}

	const imageName = image.path;

	const storage = getStorage();
	const starsRef = ref(storage, imageName);

	getDownloadURL(starsRef).then((url) => {
		const singleNews = new News({
			title: title, 
			imageUrl: url, 
			description: description, 
			content: content,
			userId: req.user
		});
		
		saveNews(singleNews, res);
	})
		.catch((err) => {
			console.log(err);
			const singleNews = new News({
				title: title, 
				imageUrl: null,
				description: description, 
				content: content,
				userId: req.user
			});

			saveNews(singleNews, res);
		});
};

exports.getNewsList = (req, res) => {
	News.find()
		.then(news => {
			res.render('admin/news-list', {
				pageTitle: 'Admin News List',
				news: news,
				path: '/admin/news-list',
				hasNews: news.length > 0
			});
		}).catch(err => {
			console.log(err);
		});
};

exports.getEditNews = (req, res) => {
	const edit = req.query.edit;
	if(!edit) {
		return res.redirect('/');
	}
    
	const newsId = req.params.newsId;
	News.findById(newsId).then(newsItem => {
		if(!newsItem) {
			return res.redirect('/');
		}

		res.render('admin/edit-news', {
			pageTitle: 'Forum Edit News Page',
			path: '/admin/edit-news',
			editing: edit,
			newsItem: newsItem
		});
	});
};

exports.postEditNews = (req, res) => {
	const newsId = req.body.newsId;
	const updatedTitle = req.body.title;
	const image = req.file;
	const updatedDescription = req.body.description;
	const updatedContent = req.body.content;
    
	News.findById(newsId)
		.then(news => {
			if(news.userId.toString() !== req.user._id.toString()) {
				return res.redirect('/');
			}
			news.title = updatedTitle;
			if(image) {
				const storage = getStorage();
				const starsRef = ref(storage, news.imageUrl);

				deleteObject(starsRef).then(() => {
					news.description = updatedDescription;
					news.content = updatedContent;
					news.imageUrl = image.path;

					return news.save()
						.then(() => {
							res.redirect('/admin/news-list');
						});		
				});
			}
			news.description = updatedDescription;
			news.content = updatedContent;
			return news.save()
				.then(() => {
					res.redirect('/admin/news-list');
				});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postDeleteNews = (req, res) => {
	const newsId = req.body.newsId;
	News.findById(newsId).then(news => {
		if(!news) {
			console.log('Can not find news.');
			return;
		}

		const storage = getStorage();
		const starsRef = ref(storage, news.imageUrl);

		return deleteObject(starsRef).then(() => {
			return News.deleteOne({_id: newsId, userId: req.user._id});
		}).catch((error) => {
			console.log(error);
			return News.deleteOne({_id: newsId, userId: req.user._id});
		});
	})
		.then(() => {
			res.redirect('/admin/news-list');
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getUsersList = (req, res) => {
	User.find()
		.then(users => {
			res.render('admin/users-list', {
				pageTitle: 'Admin Users List',
				users: users,
				path: '/admin/users-list'
			});
		}).catch(err => {
			console.log(err);
		});
};

exports.postDeleteUser = (req, res) => {
	const userID = req.body.userId;
	User.findById(userID).then(user => {
		if(!user) {
			console.log('Can not find user.');
			return;
		}

		return User.deleteOne({_id: userID});
	})
		.then(() => {
			res.redirect('/admin/users-list');
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getEditUser = (req, res) => {
	const userId = req.params.userId;
	User.findById(userId).then(userItem => {
		if(!userItem) {
			return res.redirect('/');
		}

		res.render('admin/edit-user', {
			pageTitle: 'Forum Edit user Page',
			path: '/admin/edit-user',
			userItem: userItem
		});
	});
};

exports.postEditUser = (req, res) => {
	const userId = req.body.userId;
	const updatedRole = req.body.role;
    
	User.findById(userId)
		.then(user => {
			user.role = updatedRole;
			return user.save()
				.then(() => {
					res.redirect('/admin/users-list');
				});
		})
		.catch(err => {
			console.log(err);
		});
};

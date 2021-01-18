const News = require('../models/news');
const Comment = require('../models/comment');

exports.getHome = (req, res) => {   
	News.find()
		.then(news => {
			res.render('forum/home', {
				pageTitle: 'Forum Home Page',
				news: news,
				path: '/',
				hasNews: news.length > 0
			});
		}).catch(err => {
			console.log(err);
		});
};

exports.getNewsList = (req, res) => {
	News.find()
		.then(news => {
			res.render('forum/news-list', {
				pageTitle: 'Forum News List',
				news: news,
				path: '/news-list',
				hasNews: news.length > 0
			});
		}).catch(err => {
			console.log(err);
		});
};

exports.getNewsItem = (req, res) => {
	const newsId = req.params.newsId;
	News.findById(newsId)
		.populate('comments')
		.exec((err, newsItem) => {
			const comments = newsItem.comments;
			
			res.render('forum/news', {
				newsItem: newsItem,
				pageTitle: 'News Page',
				path: '/news-list',
				comments: comments
			});
		});
};

exports.postFavouriteNews = (req, res) => {
	const newsId = req.body.newsId;
	News.findById(newsId)
		.then(newsItem => {
			return req.user.addNewsToFavourites(newsItem);
		})
		.then(() => {
			res.redirect('/user/favourite-news-list');
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getFavouriteNewsList = (req, res) => {
	req.user.populate('favouriteNews.items.newsId')
		.execPopulate()
		.then(user => {
			const items = user.favouriteNews.items;
        
			res.render('forum/favouriteNewsList', {
				path: '/user/favourite-news-list',
				pageTitle: 'Favourite News List',
				newsItems: items
			});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postDeleteFavouriteItem = (req, res) => {
	const newsId = req.body.newsId;
	req.user.deleteFavouriteItem(newsId)
		.then(() => {
			res.redirect('/user/favourite-news-list');
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getHistory = (req, res) => {
	res.render('forum/history', {
		pageTitle: 'Club History',
		path: '/club'
	});
};

exports.getAnthem = (req, res) => {
	res.render('forum/anthem', {
		pageTitle: 'Club anthem',
		path: '/anthem'
	});
};

exports.getTrophies = (req, res) => {
	res.render('forum/trophies', {
		pageTitle: 'Club trophies',
		path: '/trophies'
	});
};

exports.postAddComment = (req, res) => {
	const commentBody = req.body.commentBody;
	const newsId = req.body.newsId;

	const singleComment = new Comment({
		commentBody: commentBody,
		newsId: newsId,
		userId: req.user,
		author: req.user.username
	});

	News.findById(newsId)
		.then(newsItem => {
			singleComment.save().then(() => {
				return newsItem.addToComments(singleComment);
			}).then(() => {
				res.redirect(`/news-list/${newsId}`);
			}).catch(err => {
				console.log(err);
			});
		})
		.catch(err => {
			console.log(err);
		});

};

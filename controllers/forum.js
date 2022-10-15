const News = require('../models/news');
const Comment = require('../models/comment');
const User = require('../models/user');

exports.getHome = (req, res) => {
	const user = req.user;

	News.find()
		.sort({_id: -1})
		.then(news => {
			res.render('forum/home', {
				pageTitle: 'Forum Home Page',
				news: news,
				path: '/',
				hasNews: news.length > 0,
				user: user || false
			});
		}).catch(err => {
			console.log(err);
		});
};

exports.getNewsList = (req, res) => {
	News.find()
		.sort({_id: -1})
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
	const userId = req.user ? req.user._id : null;
	News.findById(newsId)
		.populate('comments')
		.exec((err, newsItem) => {
			const comments = newsItem.comments;
			
			res.render('forum/news', {
				newsItem: newsItem,
				pageTitle: 'News Page',
				path: '/news-list',
				comments: comments,
				userId: userId
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

exports.postFavouriteComments = (req, res) => {
	const commentId = req.body.commentId;
	const newsId = req.body.newsId;
	const userId = req.user;

	User.findById(userId).then(user => {
		if(user.favouriteComments.includes(commentId)) {
			return res.redirect(`/news-list/${newsId}`);
		}

		Comment.findById(commentId)
			.then(comment => {
				return comment.updateComment(comment._id, userId);
			})
			.then(comment => {
				return req.user.addToFavouriteComments(comment);
			})
			.then(() => {
				res.redirect(`/news-list/${newsId}`);
			})
			.catch(err => {
				console.log(err);
			});

	}).catch(err => {
		console.log(err);
	});
};

exports.getUserProfile = (req, res) => { 
	const userId = req.user;  
	User.findById(userId)
		.then(user => {
			user.populate('favouriteComments')
				.execPopulate()
				.then(user => {
					Comment.find({userId: user._id})
						.then(comments => {
							res.render('forum/user-profile', {
								pageTitle: 'User Profile',
								path: '/user/user-profile',
								user: user,
								comments: comments
							});
						}).catch(err => {
							console.log(err);
						});
				})
				.catch(err => {
					console.log(err);
				});
		}).catch(err => {
			console.log(err);
		});
};

exports.postDeleteFavouriteComment = (req, res) => {
	const commentId = req.body.commentId;
	const userId = req.user;

	Comment.findById(commentId)
		.then(comment => {
			return comment.updateCommentDelete(userId);
		})
		.then(comment => {
			return req.user.deleteFavouriteComment(comment);
		})
		.then(() => {
			res.redirect('/user/user-profile');
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postAddCommentPoint = (req, res) => {
	const commentId = req.body.commentId;
	const newsId = req.body.newsId;
	const userId = req.user;

	Comment.findById(commentId)
		.then(comment => {
			return comment.updateCommentPoints('add');
		})
		.then(comment => {
			return comment.updateRatedBy(userId);
		})
		.then(comment => {
			const commentUserId = comment.userId;
			User.findById(commentUserId)
				.then(user => {
					return user.updateScore('add');
				})
				.then(() => {
					res.redirect(`/news-list/${newsId}`);
				})
				.catch(err => {
					console.log(err);
				});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postSubtractCommentPoint = (req, res) => {
	const commentId = req.body.commentId;
	const newsId = req.body.newsId;
	const userId = req.user;

	Comment.findById(commentId)
		.then(comment => {
			return comment.updateCommentPoints('subtract');
		})
		.then(comment => {
			return comment.updateRatedBy(userId);
		})
		.then(comment => {
			const commentUserId = comment.userId;
			User.findById(commentUserId)
				.then(user => {
					return user.updateScore('subtract');
				})
				.then(() => {
					res.redirect(`/news-list/${newsId}`);
				})
				.catch(err => {
					console.log(err);
				});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getUsersRanking = (req, res) => {
	User.find().sort({score: -1}).limit(10).exec( 
		function(err, users) {
			if(err) {
				return console.log(err);
			}

			res.render('forum/users-ranking', {
				pageTitle: 'Users Ranking',
				path: '/users-rankig',
				users: users
			});
		}
	);
};

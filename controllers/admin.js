const News = require('../models/news');

exports.getAddNews = (req, res) => {
	res.render('admin/edit-news', {
		pageTitle: 'Forum Add News Page',
		path: '/admin/add-news',
		editing: false,
		isAuth: req.session.isLoggedIn
	});
};

exports.postAddNews = (req, res) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const description = req.body.description;
	const content = req.body.content;

	const singleNews = new News({
		title: title, 
		imageUrl: imageUrl, 
		description: description, 
		content: content,
		userId: req.user
	});
	singleNews.save().then(() => {
		res.redirect('/admin/news-list');
	}).catch(err => {
		console.log(err);
	});
};

exports.getNewsList = (req, res) => {
	News.find().then(news => {
		res.render('admin/news-list', {
			pageTitle: 'Admin News List',
			news: news,
			path: '/admin/news-list',
			hasNews: news.length > 0,
			isAuth: req.session.isLoggedIn
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
			newsItem: newsItem,
			isAuth: req.session.isLoggedIn
		});
	});
};

exports.postEditNews = (req, res) => {
	const newsId = req.body.newsId;
	const updatedTitle = req.body.title;
	const updatedImageUrl = req.body.imageUrl;
	const updatedDescription = req.body.description;
	const updatedContent = req.body.content;
    
	News.findById(newsId)
		.then(news => {
			news.title = updatedTitle;
			news.imageUrl = updatedImageUrl;
			news.description = updatedDescription;
			news.content = updatedContent;
			return news.save();
		})
		.then(() => {
			res.redirect('/admin/news-list');
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postDeleteNews = (req, res) => {
	const newsId = req.body.newsId;
	News.findByIdAndRemove(newsId).then(() => {
		res.redirect('/admin/news-list');
	})
		.catch(err => {
			console.log(err);
		});
};

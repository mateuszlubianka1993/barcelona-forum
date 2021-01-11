const News = require('../models/news');
const deleteFile = require('../utils/file');

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

	const imageUrl = image.path;

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
	News.find({userId: req.user._id})
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
				deleteFile(news.imageUrl);
				news.imageUrl = image.path;
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
		deleteFile(news.imageUrl);
		return News.deleteOne({_id: newsId, userId: req.user._id});
	})
		.then(() => {
			res.redirect('/admin/news-list');
		})
		.catch(err => {
			console.log(err);
		});
};

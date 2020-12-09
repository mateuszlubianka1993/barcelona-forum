const news = [];

exports.getAddNews = (req, res, next) => {
    res.render('add-news', {
        pageTitle: 'Forum Add News Page',
        path: '/admin/add-news',
    });
}

exports.postAddNews = (req, res, next) => {
    news.push({title: req.body.title});
    res.redirect('/');
}

exports.getHome = (req, res, next) => {    
    res.render('home', {
        pageTitle: 'Forum Home Page',
        news: news,
        path: '/',
        hasNews: news.length > 0,
    });
}

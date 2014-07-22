var express = require('express'),
    logger = require('morgan'),
    goblet = require('./lib/goblet'),
    app = express(),
    port = process.env.NODE_PORT || 3000,
    env = process.env.NODE_ENV || 'development',
    silent = env === 'test';

goblet.init();

app.enable('verbose errors');

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

if (env === 'development') {
    app.use(logger('dev'));
    app.locals.pretty = true;
} else if (env === 'production') {
    app.disable('verbose errors');
}

app.get('/', function(req, res) {
    var tag = (req.query.tag) ? req.query.tag.toLowerCase() : '',
        posts = (tag) ? goblet.posts.filter(function(post) {
            return post.tags.indexOf(tag) > -1;
        }) : goblet.posts;
    
    res.render('index', {
        pages: goblet.pages,
        posts: posts,
        tag: tag
    });
});

app.get('/page/:slug', goblet.page);
app.get('/post/:slug', goblet.post);

app.get('/404', function(req, res, next) {
    next();
});

app.get('/500', function(req, res, next) {
    next(new Error('The server derped!'));
});

app.use(function(req, res, next){
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
        res.render('errors/404', { url: req.url });
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
});

app.use(function(err, req, res, next) {
    console.error(err);
    res.status(err.status || 500);
    res.render('errors/500', { error: err });
});

app.listen(port, function() {
    console.log('Listening on port ' + port);
});


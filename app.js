var express = require('express'),
    logger = require('morgan'),
    app = express(),
    port = process.env.NODE_PORT || 3000,
    env = process.env.NODE_ENV || 'development',
    silent = env === 'test';

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
    res.render('index');
});

app.get('/page/:slug', function(req, res) { 
    res.render('pages/' + req.params.slug);
});

app.get('/post/:slug', function(req, res) { 
    res.render('posts/' + req.params.slug);
});

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
    res.status(err.status || 500);
    res.render('errors/500', { error: err });
});

app.listen(port, function() {
    console.log('Listening on port ' + port);
});

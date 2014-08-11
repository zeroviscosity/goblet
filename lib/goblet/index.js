var fs = require('fs');

var goblet = {
    init: function() {
        fs.watchFile('./goblet.json', function(curr, prev) {
            goblet.update();
        });
        goblet.update();
    },
    update: function() {
        console.log('Update detected: goblet.json...');
        fs.readFile('./goblet.json', 'utf8', function(err, data) {
            try {
                var g = JSON.parse(data);
                goblet.site = g.site;
                goblet.pages = g.pages;
                goblet.posts = g.posts;
            } catch(e) {
                console.error('Could not parse goblet.json', e);
            }
        });
    },
    site: {
        title: ''
    },
    pages: [],
    posts: [],
    find: function(entries, slug) {
        var matches = entries.filter(function(entry) { 
            return entry.slug === slug;
        });
        
        if (matches.length) {
            return matches[0];
        } else {
            return null;
        }
    },
    main: function(req, res) {
        var tag = (req.query.tag) ? req.query.tag.toLowerCase() : '',
            posts = (tag) ? goblet.posts.filter(function(post) {
                return post.tags.indexOf(tag) > -1;
            }) : goblet.posts;
        
        res.render('index', {
            title: goblet.site.title,
            pages: goblet.pages,
            posts: posts,
            tag: tag
        });
    },
    page: function(req, res) {
        var slug = req.params.slug,
            page = goblet.find(goblet.pages, slug);
        
        if (page) {
            res.render('pages/' + slug, {
                title: [goblet.site.title, page.title].join(': '),
                page: page,
                pages: goblet.pages
            }); 
        } else {
            res.redirect('/404');
        }
    },
    post: function(req, res) {
        var slug = req.params.slug,
            post = goblet.find(goblet.posts, slug);
        
        if (post) {
            res.render('posts/' + slug, {
                title: [goblet.site.title, post.title].join(': '),
                post: post,
                pages: goblet.pages
            }); 
        } else {
            res.redirect('/404');
        }
    }
};

module.exports = goblet;

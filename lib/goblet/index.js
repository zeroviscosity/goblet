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
                goblet.pages = g.pages;
                goblet.posts = g.posts;
            } catch(e) {
                console.error('Could not parse goblet.json', e);
            }
        });
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
    page: function(req, res) {
        var slug = req.params.slug,
            page = goblet.find(goblet.pages, slug);
        
        if (page) {
            res.render('pages/' + slug, {
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
                post: post,
                pages: goblet.pages
            }); 
        } else {
            res.redirect('/404');
        }
    }
};

module.exports = goblet;

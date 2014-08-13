var fs = require('fs');

var goblet = {
    site: {
        title: '',
        url: ''
    },
    og: {
        image: '',
        title: '',
        url: '',
        siteName: ''
    },
    pages: [],
    posts: [],
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

                goblet.og.image = goblet.site.url + '/img/logo-120.png';
                goblet.og.title = goblet.site.title;
                goblet.og.url = goblet.site.url;
                goblet.og.siteName = goblet.site.title;
            } catch(e) {
                console.error('Could not parse goblet.json', e);
            }
        });
    },
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
            tag: tag,
            og: goblet.og
        });
    },
    page: function(req, res) {
        var slug = req.params.slug,
            page = goblet.find(goblet.pages, slug);
        
        if (page) {
            res.render('pages/' + slug, {
                title: [goblet.site.title, page.title].join(': '),
                page: page,
                pages: goblet.pages,
                og: {
                    image: goblet.og.image,
                    title: page.title,
                    url: goblet.site.url + '/page/' + slug,
                    siteName: goblet.og.title
                }
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
                pages: goblet.pages,
                og: {
                    image: goblet.og.image,
                    title: post.title,
                    url: goblet.site.url + '/post/' + slug,
                    siteName: goblet.og.title
                }
            }); 
        } else {
            res.redirect('/404');
        }
    }
};

module.exports = goblet;

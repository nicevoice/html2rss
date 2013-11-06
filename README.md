# how to use #

## step1 ##
    npm install

## step2 ##
    edit config.json

    {
        "posts_path":"F:\\Dropbox\\Blog\\vimwiki_html\\posts\\",
        "title": "左博尔",
        "description": "或者不妨像水，点点滴滴都是真实的生命",
        "link": "http://zobor.me",
        "posts_uri":"http://www.zobor.me/posts/"
    }


## step4 ##
make sure your posts dir like below:

    -blog/
        |--- vimwiki /
        |--- vimwiki_html /
            |--- static /
                |--- css /
                |--- imgs /
                |--- js /
            |--- posts /
                |--- 2010 /
                    |--- 10 /
                        |--- 14 /
                            |--- hello-world.html
                    |--- 11 /
                        |--- 10 /
                            |--- hello-world.html
                            |--- hello-node.html
            |--- index.html
            |--- favicon.ico
            |--- rss.xml
        |--- vimwiki_template /


## step3 ##
    node app

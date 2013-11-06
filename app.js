var fs=require("fs");
var $ = require('jquery');
var jstoxml = require('jstoxml');

var path ='C:\\Users\\Administrator\\Desktop\\test\\';
path="F:\\Dropbox\\Blog\\vimwiki_html\\posts\\";


var data={
    _name:'rss',
    _attrs:{
        version: '2.0'
    },
    _content:{
        channel :[
            {title:'Zobor'},
            {description: 'Description'},
            {link:'http://zobor.me'},
            {lastBuidDate: function(){return new Date()}},
            {pubDate: function(){return new Date();}},
        ]
    }
};

fs.readFile('config.json','utf-8',function(err,d){
    // 读取Rss配置文件
    if(err){
        console.log(err);
        return;
    }
    var cfg = JSON.parse(d);
    var _now = new Date().toGMTString();

    // 设置RSS数据模版
    data._content.channel[0] = {title: cfg.title};
    data._content.channel[1] = {description: cfg.description};
    data._content.channel[2] = {link: cfg.link};
    data._content.channel[3] = {lastBuidDate: _now};
    data._content.channel[4] = {pubDate: _now};

    var structs = getDirectoryStructure(cfg.posts_path);
    var list=stucture2urlList(structs);
    list.sort(function(a,b){
        return a['time']-a['time'];
    });

    getContentList(list,cfg.posts_uri,function(){
        mixXmlStr(data);
    });
});



function getDirectoryStructure(folderpath){
    var json = {};
    var search=function(path,obj){
        var _files=fs.readdirSync(path);
        _files.forEach(function(file){
            var pathname = path+'\\'+file,
            stat = fs.lstatSync(pathname);

        if (stat.isDirectory()){
            obj[file] = search(pathname, (obj[file]||{}));
        }else{
            if(obj.constructor===Object) obj=[];
            obj.push(file);
        }
        });
        return obj;
    };
    search(folderpath,json);
    return json;
}


function stucture2urlList(data){
    var json=[];
    for(var y in data){
        for(var m in data[y]){
            for(var d in data[y][m]){
                var time = [y,m,d].join(''),
                    path = [y,m,d].join('\\');
                json.push({
                    time:time,
                    //urlList: path+"\\"+data[y][m][d]
                    urlList: ( path+"\\"+ data[y][m][d].join(","+path+"\\") ).split(',')
                });
            }
        }
    }
    return json;
}



function parseHtml2Info(html){
    var dom = $(html);
    var content=dom.find('.content').html();
    var title=dom.find('#toc_1').html();
    return {
        title: title,
        content: content
    };
}

function getContentList(list,posts_uri,cb){
    var len=list.length;
    var index = 0,len=0;
    list.reverse();
    list.forEach(function( col ){
        var urls = col.urlList,time=col.time,_len=urls.length;
        urls.forEach(function(url,_index){
            fs.readFile(path+url,'utf-8',function(err,d){
                if(err){
                    console.log(err);
                    return ;
                }
                var info = parseHtml2Info(d);
                var _time = time.replace(/(\d{4})(\d{2})(\d{2})/,"$1-$2-$3");
                var col={
                    item: {
                        title: info.title,
                        link: posts_uri+url.replace(/\\/g,'/'),
                        pubDate: new Date(_time).toGMTString(),
                        description: "<![CDATA[" + info.content +"]]>"
                    }
                };
                data._content.channel.push(col);
                if(time===list[list.length-1].time &&
                    _index === (_len-1)){
                    cb();
                }
            });
        });
    });
}

function mixXmlStr(data){
    var xmlStr=jstoxml.toXML(data, {header: true, indent: '  '});
    data._content.channel.forEach(function(col){
        if(col.item && col.item.title){
            console.log(col.item.title+"\t>>>"+ col.item.link);
        }
    });
    fs.writeFile(path+'../'+'rss.xml', xmlStr, function (err) {
        if (err) throw err;

        console.log('total article>>> ' + (data._content.channel.length-5) );
        console.log('It\'s saved!');
    });
}



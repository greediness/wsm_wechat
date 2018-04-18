var util = require("../../utils/utils.js");
var app = getApp();
Page({
    data: {
        datas: [
            "唐人街探案2",
            "红海行动",
            "捉妖记2",
            "喜洋洋之开心过大年"
        ],
        searchResult: {},
        containerShow: true,
        searchPanelShow: false,
        chaXun: ""
    },
    onLoad: function (event) {
    },
    //进行异步请求
    getMovieListData: function (url, settedkey, catetgoryTitle) {
        var that = this;
        wx.request({
            url: url,
            method: 'GET',
            header: {
                'Content-Type': 'json'
            },
            success: function (res) {
                that.processDoubanData(res.data, settedkey, catetgoryTitle)
            },
            fail: function (error) {
                console.log(error);
            }
        })
    },
    //将请求来的参数进行处理
    processDoubanData: function (moviesDouban, settedkey, catetgoryTitle) {
        var movies = [];
        //console.log(moviesDouban.subjects[2]);
        for (var idx in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[idx];
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + "...";
            }
            var temp = {
                stars: util.convertToStarsArray(subject.rating.stars),
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id
            }
            movies.push(temp)
        }
        //console.log(movies)
        var readyData = {};
        readyData[settedkey] = {
            catetgoryTitle: catetgoryTitle,
            movies: movies
        };
        this.setData(readyData);
    },
    //当点击搜索框的时候，让内容隐藏
    onBindFocus: function (event) {
        this.setData({
            containerShow: false,
            searchPanelShow: true
        })
    },
    //当点击X时，让搜索的内容隐藏，主页面显示
    onCanceImgTap: function (event) {
        this.setData({
            containerShow: true,
            searchPanelShow: false,
            chaXun: ""
        })
    },
    //当搜索框失去焦点时，发出搜索请求
    onBindBlur: function (event) {
        var text = event.detail.value;
        //console.log(text);
        var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
        this.getMovieListData(searchUrl, "searchResult", "");
    },
    //点击热搜时候的搜索
    hotSreach: function (event) {
        this.setData({
            containerShow: false,
            searchPanelShow: true
        })
        var text = event.currentTarget.dataset.text;
        var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
        this.getMovieListData(searchUrl, "searchResult", "");
    },
    onMovieTap: function (event) {
        //跳转到详情页      
        wx.navigateTo({
            url: './movie-detail/movie-detail?id=' + event.currentTarget.dataset.movieid,
        })
    }
})

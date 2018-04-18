// pages/movies/more-movie/more-movie.js
var utils = require("../../../utils/utils.js");
var app = getApp();
Page({
    data: {
        navigateTitle: "",
        movies: {},
        requestUrl: '',
        totalCount: 0,
        isEmpty: true,
    },
    onLoad: function (options) {
        var category = options.category;
        //console.log(category);
        this.setData({
            navigateTitle: category
        })
        var dataUrl = "";
        switch (category) {
            case "正在热映":
                var dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
                break;
            case "即将上映":
                var dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
                break;
            case "豆瓣Top250":
                var dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
                break;
        }
        this.setData({
            requestUrl: dataUrl
        })
        utils.http(dataUrl, this.processDoubanData)
    },

    processDoubanData: function (moviesDouban) {
        var movies = [];
        //console.log(moviesDouban.subjects[2]);
        for (var idx in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[idx];
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + "...";
            }
            var temp = {
                stars: utils.convertToStarsArray(subject.rating.stars),
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id
            }
            movies.push(temp)
        }
        var totalMovies = {}

        //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
        if (!this.data.isEmpty) {
            totalMovies = this.data.movies.concat(movies)
        } else {
            totalMovies = movies;
            this.data.isEmpty = false;
        }
        this.setData({ movies: totalMovies });
        this.data.totalCount += 20;
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
    },
    onReady: function (event) {
        wx.setNavigationBarTitle({
            title: this.data.navigateTitle,
        })
    },
    onScrollLower: function (event) {
        //console.log("请求成功")
        var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
        utils.http(nextUrl, this.processDoubanData);
        wx.showNavigationBarLoading()
    },
    // onPullDownRefresh: function (event) {
    //     var refreshUrl = this.data.requestUrl + "?start=0&count=20";
    //     this.data.totalMovies = {},
    //     this.data.isEmpty = true;
    //     this.data.totalCount=0;
    //     utils.http(refreshUrl, this.processDoubanData);
    // },
    onMovieTap: function (event) {
        //跳转到详情页
        wx.navigateTo({
            url: '../movie-detail/movie-detail?id=' + event.currentTarget.dataset.movieid,
        })
    }
})
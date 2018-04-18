var util = require("../../utils/utils.js");
var app = getApp();
Page({

  //RESTFul API JSON
  //SOAP XML
  //粒度  不是力度

  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {}
  },
  onLoad: function (event) {
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";

    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "豆瓣Top250");
  },
  getMovieListData: function (url, settedkey, catetgoryTitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'json'
      },
      success: function (res) {
        that.processDoubanData(res.data, settedkey, catetgoryTitle)
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },

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
  onMoreTap: function (event) {
    //跳转到更多页面并传递页头的四个字过去
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category
    })
  },
  onMovieTap: function (event) {
    //跳转到详情页      
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + event.currentTarget.dataset.movieid,
    })
  }
})

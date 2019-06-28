/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ViewPagerAndroid, FlatList, Image, TouchableOpacity, Alert, WebView, ToolbarAndroid, } from 'react-native';
import { PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'rn-viewpager';
import * as rssParser from 'react-native-rss-parser';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};

rss = [
  {
    title: 'Home',
    url: 'https://vnexpress.net/rss/tin-moi-nhat.rss'
  },
  {
    title: 'Sport',
    url: 'https://vnexpress.net/rss/the-thao.rss'
  },
  {
    title: 'News',
    url: 'https://vnexpress.net/rss/the-gioi.rss'
  },

];

menuToolbar = [
  {
    title: 'FontNormal'
  },
  
  {
    title: 'FontSmall'
  },
  
  {
    title: 'FontLarge'
  }
];

// const rssSport = 'https://vnexpress.net/rss/the-thao.rss';
// const rssHome = 'https://vnexpress.net/rss/tin-moi-nhat.rss';
// const rssNews = 'https://vnexpress.net/rss/the-gioi.rss';

description = "hahahah";
objs = [];

export default class App extends Component<Props> {

  // constructor(props) {
  //   super(props);
  //   //this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  // }

  state = { data: [], showList: true }

  componentDidMount() {
    this.rssHome(rss[0].url);
    this.rssSport(rss[1].url);
    this.rssNews(rss[2].url)

    // this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    //   //this.goBack(); // works best when the goBack is async
    //   props.navigation.goBack(null);
    //   return true;
    // });
  }

  // componentWillMount() {
  //   //BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  // }

  // componentWillUnmount() {
  //   //BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  // }

  // navigation() {
  //   this.setState({ showList: false });
  // }

  handleBackButtonClick() {
    // this.props.navigation.goBack(null);
    // return true;
  }

  navigation = (event) => {
    //this.setState({ showList: false });
    //url = event;
    return fetch(event)
      .then((response) => response.text())
      .then((responseData) => {
        var DomParser = require('dom-parser');
        var parser = new DomParser();
        const document = parser.parseFromString(responseData, "text/html");
        document.getElementsByTagName('article')
        description = document.getElementsByTagName('article')[0].innerHTML;
        this.setState({ showList: false });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  

  showListRss() {
    return (
      <View style={styles.container}>
        
        <IndicatorViewPager
          style={styles.IndicatorViewPager}
          indicator={this._renderTitleIndicator()}>
          <View>
            <FlatList
              data={this.state.data[0]}
              renderItem={({ item }) =>
                <TouchableOpacity style={styles.renderitem} onPress={() => this.navigation(item.url)}>
                  <Image
                    style={styles.img}
                    source={{ uri: item.src }}
                  />
                  <Text style={styles.title}>{item.title}</Text>
                </TouchableOpacity>
              }
            />
          </View>
          <View>
            <FlatList
              data={this.state.data[1]}
              renderItem={({ item }) =>
                <TouchableOpacity style={styles.renderitem} onPress={() => this.navigation(item.url)}>
                  <Image
                    style={styles.img}
                    source={{ uri: item.src }}
                  />
                  <Text style={styles.title}>{item.title}</Text>
                </TouchableOpacity>
              }
            />
          </View>
          <View>
            <FlatList
              data={this.state.data[2]}
              renderItem={({ item }) =>
                <TouchableOpacity style={styles.renderitem} onPress={() => this.navigation(item.url)}>
                  <Image
                    style={styles.img}
                    source={{ uri: item.src }}
                  />
                  <Text style={styles.title}>{item.title}</Text>
                </TouchableOpacity>
              }
            />
          </View>
        </IndicatorViewPager>
      </View>
    )
  }



  _renderTitleIndicator() {
    return <PagerTitleIndicator style={styles.indicatorContainer} titles={[rss[0].title, rss[1].title, rss[2].title]} />;
  }

  showDetailNews() {
    return (
      <View>
        <ToolbarAndroid
          style={{ backgroundColor: "blue", height: 50, width: '100%' }}
          title="android"
          actions={[{ title: "setting", show: 'always' }, { title: "setting_1", show: 'always' }]}
        />
        <WebView
          source={{ baseUrl: '', html: description }}
          style={{ marginTop: 20 }}
        />
      </View>
    )
  }

  rssHome(url) {
    return fetch(url)
      .then((response) => response.text())
      //.then((responseData) => rssParser.parse(responseData))
      .then((responseData) => {
        var DomParser = require('dom-parser');
        var parser = new DomParser();

        var obj = rssParser.parse(responseData)._55.items;
        var length = obj.length;
        //console.log(rss.title);
        //console.log(rss.items.length);
        for (var i = 0; i < length; i++) {
          var description = obj[i].description.replace("<img width=130 height=100", "<img ")
          const document = parser.parseFromString(description, "text/html");
          try {
            var node = document.getElementsByTagName("img");
            obj[i].src = node[0].attributes[0].value;
            obj[i].url = obj[i].links[0].url;
          } catch (error) {
            obj[i].src = "https://vutruhuyenbi.com/forum/styles/mobile/theme/images/no_avatar.gif";
            obj[i].url = "http://vunamweb.com";
          }
        }

        objs[0] = obj;
        this.setState({ data: objs });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  rssSport(url) {
    return fetch(url)
      .then((response) => response.text())
      //.then((responseData) => rssParser.parse(responseData))
      .then((responseData) => {
        var DomParser = require('dom-parser');
        var parser = new DomParser();

        var obj = rssParser.parse(responseData)._55.items;
        var length = obj.length;
        //console.log(rss.title);
        //console.log(rss.items.length);
        for (var i = 0; i < length; i++) {
          var description = obj[i].description.replace("<img width=130 height=100", "<img ")
          const document = parser.parseFromString(description, "text/html");
          try {
            var node = document.getElementsByTagName("img");
            obj[i].src = node[0].attributes[0].value;
            obj[i].url = obj[i].links[0].url;
          } catch (error) {
            obj[i].src = "https://vutruhuyenbi.com/forum/styles/mobile/theme/images/no_avatar.gif";
            obj[i].url = "http://vunamweb.com";
          }
        }
        objs[1] = obj;
        this.setState({ data: objs });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  rssNews(url) {
    return fetch(url)
      .then((response) => response.text())
      //.then((responseData) => rssParser.parse(responseData))
      .then((responseData) => {
        var DomParser = require('dom-parser');
        var parser = new DomParser();

        var obj = rssParser.parse(responseData)._55.items;
        var length = obj.length;
        //console.log(rss.title);
        //console.log(rss.items.length);
        for (var i = 0; i < length; i++) {
          var description = obj[i].description.replace("<img width=130 height=100", "<img ")
          const document = parser.parseFromString(description, "text/html");
          try {
            var node = document.getElementsByTagName("img");
            obj[i].src = node[0].attributes[0].value;
            obj[i].url = obj[i].links[0].url;
          } catch (error) {
            obj[i].src = "https://vutruhuyenbi.com/forum/styles/mobile/theme/images/no_avatar.gif";
            obj[i].url = "http://vunamweb.com";
          }
        }
        objs[2] = obj;
        this.setState({ data: objs });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // rss(url) {
  //   return fetch(url)
  //     .then((response) => response.text())
  //     .then((responseJson) => {
  //       var xml2js = require("xml2js").parseString;
  //       var xml = "<root><title>dd</title><des><title>dd</title></des></root>";
  //       xml2js(xml, function (err, result) {
  //         //this.setState({ data: result.movies });
  //         //console.dir(result);
  //       });
  //       // var obj = xml2js.Builder(responseJson);
  //       // this.setState({ data: obj.movies });
  //       //return responseJson.movies;
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }

  render() {
    // const showListRss = <Text>showlist</Text>;
    // const showDetail = <Text>show detail</Text>

    // let message;
    // if (this.props.isgreeing)
    //   message = showListRss;
    // else
    //   message = showDetail;
    //this.rss("https://facebook.github.io/react-native/movies.json");
    return (
      this.state.showList ? this.showListRss() : this.showDetailNews()
    )
    //return (<View style={{flex: 1}}>{this.showDetailNews()}</View>);
    // return (
    //   this.showListRss()
    // )

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  ToolbarAndroid: {
    backgroundColor: "blue", 
    height: 30, 
    //width: '100%'
  },

  IndicatorViewPager: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 5
  },

  img: {
    //flex: 1 ,
    width: 100,
    height: 100,
  },

  title: {
    flex: 1,
    padding: 20,

  },

  renderitem: {
    flexDirection: "row",
    flex: 1,
    marginTop: 20,
  },

  indicatorContainer: {
    height: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  }
});

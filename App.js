/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  View,
  ViewPagerAndroid,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  WebView,
  ToolbarAndroid,
  ActivityIndicator,
  AsyncStorage
} from 'react-native';

import ShowSearch from 'react-native-search-box';
import SearchHeader from 'react-native-search-header';

import {
  PagerTabIndicator,
  IndicatorViewPager,
  PagerTitleIndicator,
  PagerDotIndicator
} from 'rn-viewpager';

import * as rssParser from 'react-native-rss-parser';
import ActionBar from 'react-native-action-bar';

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

rightIcons = [
  {
    image: require('./img/zoom_in.png'),
    onPress: () => this.props.Component.test()
  },
  {
    image: require('./img/zoom_out.png'),
    onPress: () => console.log('Right Custom image !')
  }
];

description = "";
let objs = [];
pageSelected = 0;
//let result = [];

class ShowActionBar extends React.Component {
  render() {
    var rightIcons;

    if (this.props.leftIconName == '')
      rightIcons = [
        {
          image: require('./img/zoom_in.png'),
          onPress: () => this.props.Component.setFont('large')
        },
        {
          image: require('./img/zoom_out.png'),
          onPress: () => this.props.Component.setFont('small')
        },
        {
          image: require('./img/search.png'),
          onPress: () => this.props.Component.search()
        }
      ];
    else
      rightIcons = [
        {
          image: require('./img/save.png'),
          onPress: () => this.props.Component.setFont('large')
        }
      ];

    return (
      <ActionBar
        containerStyle={styles.bar}
        title={'News'}
        // rightText={'Hello'}
        leftIconName={this.props.leftIconName}
        // leftBadge={'hjj'}
        onLeftPress={() => this.props.Component.setState({ showList: true, pageSelected: pageSelected })}
        // onTitlePress={() => console.log('Title!')}
        rightIcons={rightIcons}
      />
    );
  }
}

class ShowFlatList extends Component {
  getStyleFont() {
    switch (this.props.Component.state.typeFontSize) {
      case 'large':
        return styles.title_large;
        break;
      case 'small':
        return styles.title_small;
      default:
        return styles.title_normal;
    }
  }

  render() {
    return (
      <FlatList
        extraData={this.props.Component.state}
        data={this.props.Component.state.data[this.props.position]}
        ItemSeparatorComponent={this.props.Component.renderSeparator}
        numColumns={1}
        refreshing={false}
        onRefresh={this.props.Component.onRefresh}
        onEndReached={this.props.Component.handleLoadMore}
        // ListHeaderComponent={this.renderFooter}
        ListFooterComponent={this.props.Component.renderFooter}
        renderItem={({ item, index }) =>
          <TouchableOpacity style={styles.renderitem} onPress={() => this.props.Component.navigation(index)}>
            <Image
              style={styles.img}
              source={{ uri: item.src }}
            />
            <Text style={this.getStyleFont()}>{item.title}</Text>
          </TouchableOpacity>
        }
      />
    )
  }
}

export default class App extends Component<Props> {

  // constructor(props) {
  //   super(props);
  //   //this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  // }

  state = { data: [], showList: true, typeFontSize: '', pageSelected: 0, loading: false }

  componentDidMount() {
    // this.rssHome(rss[0].url);
    // this.rssSport(rss[1].url);
    // this.rssNews(rss[2].url);
    //this.getData_();
    this.getDataOffline();
  }

  navigation = (index) => {
    //this.setState({ showList: false });
    //url = event;
    return fetch(objs[pageSelected][index].url)
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

  renderSeparator = () => (
    <View
      style={{
        backgroundColor: 'grey',
        height: 1,
        //marginBottom: 5
      }}
    />
  );

  _renderTitleIndicator() {
    return <PagerTitleIndicator style={styles.indicatorContainer} titles={[rss[0].title, rss[1].title, rss[2].title]} />;
  }

  setFont(typeFontSize) {
    //this.searchHeader.placeholder = "knjj";
    this.setState({ typeFontSize: typeFontSize });
  }

  search() {
    this.searchHeader.show();
  }

  filterSearch(search) {
    let count = 0;
    const objs_ = objs;
    let result = [];
    if (search == undefined)
      result = objs;
    else {
      this.initDataSearch(result, objs, pageSelected);
      for (i = 0; i < objs_[pageSelected].length; i++) {
        var title = objs_[pageSelected][i].title;
        if (title.toUpperCase().indexOf(search.toUpperCase()) != -1) {
          result[pageSelected][count] = objs_[pageSelected][i];
          count++;
          //objs_[pageSelected].splice(i, 1);
        }
      }
    }
    this.setState({ data: result });
  }

  initDataSearch(result, objs, pageSelected) {
    result[pageSelected] = [];

    switch (pageSelected) {
      case 0:
        result[1] = objs[1];
        result[2] = objs[2];
        break;

      case 1:
        result[0] = objs[0];
        result[2] = objs[2];
        break;

      case 2:
        result[1] = objs[1];
        result[0] = objs[0];
        break;
    }
  }

  showListRss() {
    let style;

    if (this.state.typeFontSize == 'large')
      style = styles.title_large;
    else if (this.state.typeFontSize == 'small')
      style = styles.title_small;
    else
      style = styles.title_normal;

    return (
      <View style={styles.container}>
        <ShowActionBar leftIconName='' Component={this} />
        <SearchHeader
          style={styles.search}
          ref={(searchHeader) => {
            this.searchHeader = searchHeader;
          }}
          placeholder='Search...'
          placeholderColor='gray'
          headerBgColor='white'
          onGetAutocompletions={(text) => {
            this.filterSearch(text);
          }}
          onClear={(text) => {
            this.filterSearch(text);
          }}
        />
        <IndicatorViewPager
          style={styles.IndicatorViewPager}
          initialPage={this.state.pageSelected}
          onPageSelected={this.onPageSelected}
          indicator={this._renderTitleIndicator()}>
          <ShowFlatList
            Component={this}
            position={0}
          />
          <ShowFlatList
            Component={this}
            position={1}
          />
          <ShowFlatList
            Component={this}
            position={2}
          />
        </IndicatorViewPager>
      </View>
    )
  }

  showDetailNews() {
    return (
      <View style={styles.container}>
        <ShowActionBar leftIconName='back' Component={this} />
        <WebView
          source={{ baseUrl: '', html: description }}
          style={{ marginTop: 20, flex: 1 }}
        />
      </View>
    )
  }

  onPageSelected(page) {
    pageSelected = page.position;
    //console.log('state is: '+e)
  }

  handleLoadMore = () => {
    //console.log('end');
    this.setState({ loading: true });
    var length = objs[0].length;
    objs[0][length] = objs[0][length - 1];
    this.rssSport(rss[1].url);
  }

  renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (!this.state.loading) return null;
    return (
      <ActivityIndicator
        style={{ color: '#000' }}
      />
    );
  }

  onRefresh = () => {
    //console.log('refersh asap...');
    this.rssHome(rss[0].url);
  }

  _storeData = async (obj) => {
    try {
      await AsyncStorage.setItem('TASKS', JSON.stringify(obj));
      //console.log(JSON.stringify(obj));
    } catch (error) {
      console.log(error);
    }
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('TASKS');
      if (value == null)
        console.log('empty');
      else
        console.log('not empty');
    }
    catch (error) {
      // Error retrieving data   
    }
  }

  getData() {
    const DomParser = require('dom-parser');
    const parser = new DomParser();
    let obj, length, description, document, node;

    for (var i = 0; i < rss.length; i++) {
      return fetch(rss[i].url)
        .then((response) => response.text())
        //.then((responseData) => rssParser.parse(responseData))
        .then((responseData) => {
          obj = rssParser.parse(responseData)._55.items;
          length = obj.length;
          //console.log(rss.title);
          //console.log(rss.items.length);
          for (var j = 0; j < length; j++) {
            description = obj[j].description.replace("<img width=130 height=100", "<img ")
            document = parser.parseFromString(description, "text/html");
            try {
              node = document.getElementsByTagName("img");
              obj[j].src = node[0].attributes[0].value;
              obj[j].url = obj[j].links[0].url;
            } catch (error) {
              obj[j].src = "https://vutruhuyenbi.com/forum/styles/mobile/theme/images/no_avatar.gif";
              obj[j].url = "http://vunamweb.com";
            }
          }

          objs[i] = obj;
          //this._storeData(objs[0]);
          //this._retrieveData();
        })
        .catch((error) => {
          console.error(error);
        });
    }
    this.setState({ data: objs });
  }

  getData_() {
    for (var i = 0; i < rss.length; i++)
      this.getRssFromPosition(i);
  }

  getDataOffline = async () => {
    const value = await AsyncStorage.getItem('TASKS');
    objs = JSON.parse(value);
    this.setState({ data: objs });
  }

  checkData(objs) {
    for (var i = 0; i < objs.length; i++)
      if (objs[i] == undefined)
        return false;
    return true;
  }
  getRssFromPosition(position) {
    const DomParser = require('dom-parser');
    const parser = new DomParser();
    let obj, length, description, document, node;

    return fetch(rss[position].url)
      .then((response) => response.text())
      //.then((responseData) => rssParser.parse(responseData))
      .then((responseData) => {
        obj = rssParser.parse(responseData)._55.items;
        length = obj.length;
        for (var i = 0; i < length; i++) {
          description = obj[i].description.replace("<img width=130 height=100", "<img ")
          document = parser.parseFromString(description, "text/html");
          try {
            node = document.getElementsByTagName("img");
            obj[i].src = node[0].attributes[0].value;
            obj[i].url = obj[i].links[0].url;
          } catch (error) {
            obj[i].src = "https://vutruhuyenbi.com/forum/styles/mobile/theme/images/no_avatar.gif";
            obj[i].url = "http://vunamweb.com";
          }
        }

        objs[position] = obj;
        if (this.checkData(objs) && objs.length == rss.length) {
          //this._storeData(objs);
          this._retrieveData();
          this.setState({ data: objs });
        }
        else {
          console.log(this.checkData(objs));
          console.log(position);
          console.log('end');
        }

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
    paddingLeft: 5,
  },

  img: {
    //flex: 1 ,
    width: 100,
    height: 100,
    marginBottom: 5
  },

  title_normal: {
    flex: 1,
    padding: 20,
    fontSize: 14
  },

  title_small: {
    flex: 1,
    padding: 20,
    fontSize: 10
  },

  title_large: {
    flex: 1,
    padding: 20,
    fontSize: 50
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
  },

  search: {
    backgroundColor: 'blue'
  }
});

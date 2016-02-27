'use strict';

// deps
import React, { Component, View, Text, StyleSheet, Platform, ActivityIndicatorIOS, ProgressBarAndroid } from 'react-native';
import Rebase from 're-base';

// modules
import Config from '../config';
import Card from '../components/Card';
import CardSwiper from '../components/CardSwiper';

/**
 * Main Scene Component
 * @class SceneMain
 */
export default class SceneMain extends Component {

	/**
	 * Class constructor
	 */
  constructor (...args) {

    super(...args);

    // initial state
    this.state = {
      places: [],
      // for testing
      location: { lat: 64.140219, lon: -21.886277 }
    };

    // setup re-base class
    this.base = Rebase.createClass(Config.FIREBASE_URL);
  }

  /**
   * Fired when component did mount
   * @return {void}
   */
  componentDidMount () {

  	// bind places to this state's places object
    this.ref = this.base.listenTo('places', {
      context: this,
      asArray: true,
      then (data) {
        this.setState({
          places: data
        });
      }
    });
  }

  /**
   * Fired before component will unmount
   * @return {void}
   */
  componentWillUnmount () {
    this.base.removeBinding(this.ref);
  }

  /**
   * Render card method
   * @param  {object} Properties
   * @return {Card}
   */
  renderCard (props) {
    return (
      <Card {...props}/>
    );
  }

  /**
   * Rendered when no more cards are available
   * @return {Text}
   */
  renderNoMoreCards () {
    return (
		  <Text style={styles.noMoreCards}>Att bú</Text>
    );
  }

  /**
   * Fired when card is swiped to the left
   * @return {void}
   */
  _onSwipeLeft (card) {
  	console.log('card %o was swiped left', card);
  }

  /**
   * Fired when card is swiped to the right
   * @return {void}
   */
  _onSwipeRight (card) {
		console.log('card %o was swiped right', card);
  }

  /**
   * Render method
   * @return {Component}
   */
  render () {

    if (this.state.places.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingLogo}>Matr</Text>
          {Platform.OS === 'ios' ? <ActivityIndicatorIOS color="#fff" /> : null}
          {Platform.OS === 'android' ? <ProgressBarAndroid color="#fff" indeterminate={true} /> : null}
        </View>
      );
    }

    return (
	    <View style={styles.container}>
	      <CardSwiper cards={this.state.places} renderCard={this.renderCard} renderNoMoreCards={this.renderNoMoreCards} onSwipeRight={this._onSwipeRight} onSwipeLeft={this._onSwipeLeft} loop={true} style={styles.swipeCards} rightLabel="Good" leftLabel="Bad" />
	    </View>
    );
  }
}

/**
 * @const {StyleSheet} Component styles
 */
const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingLogo: {
    fontSize: 48,
    fontWeight: '100',
    color: '#fff',
    backgroundColor: 'transparent'
	},
	container: {
		flex: 1
	},
	swipeCards: {
		backgroundColor: 'transparent'
	},
	noMoreCards: {
		color: '#fff'
	}
});
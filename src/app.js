'use strict';

import React, { Component, Navigator, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SceneMain from './scenes/Main';

/**
 * App Component
 * @class App
 */
export default class App extends Component {

  /**
   * Render scene method
   * @param  {object} Selected route
   * @param  {Navigator} Reference to navigator
   * @return {Component}
   */
  renderScene (route, navigator) {
    switch (route.name) {
      default:
        return <SceneMain />
    }
  }

  /**
   * Render method
   * @return {Component}
   */
  render () {
    return (
      <LinearGradient style={{flex:1}} start={[0.75, 0.25]} end={[0.5, 1.0]} locations={[0.0,0.9]} colors={['#AFDB87', '#5DC492']}>
        <StatusBar backgroundColor="#83ad5c" translucent={true} barStyle="light-content" />
        <Navigator initialRoute={{ name: 'main', index: 0 }} renderScene={this.renderScene.bind(this)} />
      </LinearGradient>
    );
  }
}

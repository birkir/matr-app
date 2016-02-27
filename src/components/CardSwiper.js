'use strict';

// deps
import React, { Component, StyleSheet, Text, View, Animated, PanResponder, Image } from 'react-native';
import clamp from 'clamp';

/**
 * Card Swiper Component
 * @class CardSwiper
 */
class CardSwiper extends Component {

  /**
   * Class constructor
   */
  constructor (...args) {
    super(...args);

    this.state = {
      pan: new Animated.ValueXY(),
      enter: new Animated.Value(0.5),
      card: this.props.cards[0],
    };
  }

  /**
   * Fired when component did mount
   * @return {void}
   */
  componentDidMount() {
    this._animateEntrance();
  }

  /**
   * Fired before component will mount
   * @return {void}
   */
  componentWillMount() {

    // setup a pan responder
    this._panResponder = PanResponder.create({

      /**
       * Enable and start capturing paning gesture
       */
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      /**
       * Fired when pan responder is granted gesture
       */
      onPanResponderGrant: (e, gestureState) => {

        // starting offset
        this.state.pan.setOffset({
          x: this.state.pan.x._value,
          y: this.state.pan.y._value
        });

        // reset pan
        this.state.pan.setValue({
          x: 0,
          y: 0
        });
      },

      /**
       * Fired on each frame of pan
       * @return {Animated}
       */
      onPanResponderMove: Animated.event([null, {
        dx: this.state.pan.x,
        dy: this.state.pan.y
      }]),

      /**
       * Fired when pan gesture is released
       * @param {event}
       * @param {object} X and Y axis velocity
       * @return {void}
       */
      onPanResponderRelease: (e, {vx, vy}) => {

        this.state.pan.flattenOffset();

        let velocity;

        if (vx >= 0) {
          velocity = clamp(vx, 3, 5);
        } else if (vx < 0) {
          velocity = clamp(vx * -1, 3, 5) * -1;
        }

        if (Math.abs(this.state.pan.x._value) > 120) {

          const swipeRight = (this.state.pan.x._value > 0);

          this.props[swipeRight ? 'onSwipeRight' : 'onSwipeLeft'](this.state.card);

          if (this.props.cardRemoved) {
            this.props.cardRemoved(this.props.cards.indexOf(this.state.card));
          }

          Animated.decay(this.state.pan, {
            velocity: {
              x: velocity,
              y: vy
            },
            deceleration: 0.98
          })
          .start(this._resetState.bind(this));

        } else {

          // Go back to original placement
          Animated.spring(this.state.pan, {
            toValue: {
              x: 0,
              y: 0
            },
            friction: 4
          })
          .start();
        }
      }
    });
  }

  /**
   * Callback proxy for no more cards view
   * @return {function}
   */
  renderNoMoreCards () {
    if (this.props.renderNoMoreCards) {
      return this.props.renderNoMoreCards();
    }
  }

  /**
   * Callback proxy for card rendering
   * @return {function}
   */
  renderCard (data) {
    return this.props.renderCard(data);
  }

  /**
   * Go to next card
   * @return {void}
   */
  _goToNextCard() {

    let currentCardIdx = this.props.cards.indexOf(this.state.card);
    let newIdx = currentCardIdx + 1;
    let card = (newIdx > (this.props.cards.length - 1)) ? (this.props.loop ? this.props.cards[0] : null) : this.props.cards[newIdx];

    this.setState({
      card: card
    });
  }

  /**
   * Enterance animation
   * @return {void}
   */
  _animateEntrance() {
    Animated.spring(this.state.enter, {
      toValue: 1,
      friction: 8
    }).start();
  }

  /**
   * Fired when state resets
   * @return {void}
   */
  _resetState() {
    this.state.pan.setValue({ x: 0, y: 0 });
    this.state.enter.setValue(0);
    this._goToNextCard();
    this._animateEntrance();
  }

  /**
   * Render method
   * @return {Component}
   */
  render () {

    // extract pan and enter from state
    let { pan, enter } = this.state;

    let [translateX, translateY] = [pan.x, pan.y];

    let rotate = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: ["-30deg", "0deg", "30deg"]});
    let opacity = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: [0.5, 1, 0.5]});
    let scale = enter;

    let animatedCardstyles = {transform: [{translateX}, {translateY}, {rotate}, {scale}], opacity};

    let leftOpacity = pan.x.interpolate({inputRange: [-150, 0], outputRange: [1, 0]});
    let leftScale = pan.x.interpolate({inputRange: [-150, 0], outputRange: [1, 0.5], extrapolate: 'clamp'});
    let animatedLeftStyles = {transform: [{scale: leftScale}], opacity: leftOpacity}

    let rightOpacity = pan.x.interpolate({inputRange: [0, 150], outputRange: [0, 1]});
    let rightScale = pan.x.interpolate({inputRange: [0, 150], outputRange: [0.5, 1], extrapolate: 'clamp'});
    let animatedRightStyles = {transform: [{scale: rightScale}], opacity: rightOpacity}

    return (
      <View style={styles.container}>
        {this.state.card ? (
          <Animated.View style={[styles.card, animatedCardstyles]} {...this._panResponder.panHandlers}>
            {this.renderCard(this.state.card)}
          </Animated.View>
        ) : this.renderNoMoreCards()}

        <Animated.View style={[styles.leftButton, animatedLeftStyles]}>
          <Text style={styles.leftLabel}>{this.props.leftLabel}</Text>
        </Animated.View>

        <Animated.View style={[styles.rightButton, animatedRightStyles]}>
          <Text style={styles.rightLabel}>{this.props.rightLabel}</Text>
        </Animated.View>
      </View>
    );
  }
}

// Property types for class
CardSwiper.propTypes = {
  cards: React.PropTypes.array,
  loop: React.PropTypes.bool,
  renderCards: React.PropTypes.func,
  renderNoMoreCards: React.PropTypes.func,
  onSwipeLeft: React.PropTypes.func,
  onSwipeRight: React.PropTypes.func
};

// Default properties
CardSwiper.defaultProps = {
  loop: false
};

// StyleSheet
var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  rightButton: {
    borderColor: 'green',
    borderWidth: 2,
    position: 'absolute',
    padding: 20,
    bottom: 20,
    borderRadius: 5,
    right: 20,
  },
  rightLabel: {
    fontSize: 16,
    color: 'green',
  },
  leftButton: {
    borderColor: 'red',
    borderWidth: 2,
    position: 'absolute',
    bottom: 20,
    padding: 20,
    borderRadius: 5,
    left: 20,
  },
  leftLabel: {
    fontSize: 16,
    color: 'red',
  }
});

export default CardSwiper
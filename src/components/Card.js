'use strict';

import React, { Component, View, Text, Image, StyleSheet } from 'react-native';

/**
 * Card Component
 * @class Card
 */
export default class Card extends Component {

  /**
   * Is the place open right now
   * @param {object} Hours
   * @return {bool}
   */
  isOpen (hours) {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mins = (d.getHours() * 60) + d.getMinutes();
    return !! hours.find(hour => hour.days.indexOf(dayOfWeek) >= 0 && hour.timeFrom > mins && hour.timeTo < mins);
  }

  /**
   * Format minutes
   * @param {number} Number of minutes
   * @return {string}
   */
  formatMinutes (minutes) {
    const hours = Math.floor(minutes / 60);
    minutes -= (hours * 60);
    return [hours, minutes].map(String).map(n => '0'.repeat(2-n.length) + n).join(':');
  }

  /**
   * Render method
   * @return {View}
   */
  render () {
    return (
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: this.props.image }} style={styles.image} />
        </View>
        <Text style={styles.name}>{this.props.name}</Text>
        <Text style={styles.address}>{this.props.location.address}</Text>
      </View>
    );
  }
}

/**
 * @const {StyleSheet} Component styles
 */
const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    width: 300,
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 5
  },
  imageContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    elevation: 4,
    marginTop: 25,
    marginBottom: 25
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 70
  },
  name: {
    fontSize: 24,
    fontWeight: '200'
  },
  address: {
    fontSize: 13,
    color: '#A4AAB3',
    fontWeight: '300'
  }
});
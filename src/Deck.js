import React, { Component } from 'react';
import {
   View,
   Animated,
   PanResponder
  } from 'react-native';



class Deck extends Component{

  constructor(props){
    super(props);

    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        console.log(gesture);
        position.setValue({x: gesture.dx,y: gesture.dy })
      },
      onPanResponderRelease: () => {},

    });

    this.state = {position};
    this.panResponder= panResponder;
  }

  /*
  getCardStyle() {
    const { position } = this.state;
    const rotate = position.x.interpolate({
      inputRange: [-500, 0, 500],
      outputRange: ['-120deg', '0deg', '120deg']
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }]
    };
  }
  */

  getCardStyle(){

    const { position } = this.state;
    console.log('matias ',position);
    //debugger


     const rotate = position.x.interpolate({
      inputRange: [-500,0,500],
      outputRange: ['-90deg','0deg','90deg']
    });

    return {...position.getLayout(),
            transform: [{rotate}] };
  }
  renderCards(){
    return this.props.data.map((item,index) => {

      if(index === 0){
          return (
            <Animated.View
              key={item.id}
              style={this.getCardStyle()}
              {...this.panResponder.panHandlers}>
                {this.props.renderCard(item)}
            </Animated.View>
          );
      }
      console.log('matias ', item);
      return this.props.renderCard(item);
    })
  }

  render(){
    return(
      <View>
          {this.renderCards()}
      </View>
    );
  }
}

export default Deck;

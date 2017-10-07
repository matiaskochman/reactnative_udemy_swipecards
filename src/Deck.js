import React, { Component } from 'react';
import {
   View,
   Animated,
   PanResponder,
   Dimensions
  } from 'react-native';


const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

class Deck extends Component{

  static defaultProps = {
    onSwipeLeft: ()=>{},
    onSwipeRight: () =>{}
  }

  constructor(props){
    super(props);

    const position = new Animated.ValueXY();

    const panResponder = PanResponder.create({

      onStartShouldSetPanResponder: () => true,

      onPanResponderMove: (event, gesture) => {
        console.log(gesture);
        position.setValue({x: gesture.dx,y: gesture.dy })
      },

      onPanResponderRelease: (event, gesture) => {

        if(gesture.dx > SWIPE_THRESHOLD){
          console.log('force right')
          this.forceSwipe('right');
        }else if(gesture.dx < -SWIPE_THRESHOLD){
          console.log('forceleft')
          this.forceSwipe('left');
        } else {
          this.resetPosition();
        }

      },

    });

    this.state = {position, panResponder, index:0};
  }

  forceSwipe(direction){

    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    console.log(x);
    Animated.timing(this.state.position,{
      toValue: { x , y:0 } ,
      duration:SWIPE_OUT_DURATION
    }).start(() => this.onSwipeComplete(direction));
  }

  onSwipeComplete(direction){
    const { onSwipeRight, onSwipeLeft, data } = this.props;

    const item = data[this.state.index];
    direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
  }
  resetPosition(){
    Animated.spring(this.state.position,{
      value: {x:0,y:0}
    }).start();
  }

  getCardStyle(){

    const { position } = this.state;

    //debugger


     const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH,0,SCREEN_WIDTH],
      outputRange: ['-80deg','0deg','80deg']
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
              {...this.state.panResponder.panHandlers}>
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

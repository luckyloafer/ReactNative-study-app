import React, { useEffect } from 'react';
import { View, Animated, Easing } from 'react-native';

const RotateAnimation = ({width,left,color,layer,opacity}) => {
  const rotateValue = new Animated.Value(0);

  useEffect(() => {
    startAnimation();
  }, []);

  const startAnimation = () => {
    rotateValue.setValue(0); // Reset the animated value
    Animated.timing(rotateValue, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => startAnimation()); // Restart the animation on completion
  };

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          width: width,
          height: width-20,
          borderRadius:550,
          backgroundColor: color,  
          left:left,
          zIndex:layer,
          transform: [{ rotate }],
          top:60,
          opacity:opacity
        }}
      />
    </View>
  );
};

export default RotateAnimation;

import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export class CheckBox extends React.Component {
  render() {
    let { checked, onPress, size } = this.props;
    if (!size) size = 30;
    return (
      <TouchableOpacity onPress={onPress}>
        {Platform.OS == 'ios'
          ? <Ionicons name={checked ? 'ios-checkmark-circle-outline' : 'ios-radio-button-off-outline'} size={size} />
          : <MaterialIcons name={checked ? 'check' : 'check-box-outline-blank'} size={size} />}
      </TouchableOpacity>
    );
  }
}

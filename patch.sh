#!/bin/bash

perl -i -pe 's/#import "(RCT.*)"/#import <React\/$1>/' node_modules/react-native-location/RNLocation.{m,h}
perl -i -pe 's#(\s+)(@Override)#$1//$2# if $. == 23' node_modules/react-native-geocoder/android/src/main/java/com/devfd/RNGeocoder/RNGeocoderPackage.java
perl -i -pe "s/import React.*/import React, { Component } from 'react';\nimport PropTypes from 'prop-types';/" node_modules/react-native-picker{,-android}/index.js node_modules/react-native-app-intro/AppIntro.js
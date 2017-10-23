#!/bin/bash

perl -i -pe 's#(\s+)(@Override)#$1//$2# if $. == 23' node_modules/react-native-geocoder/android/src/main/java/com/devfd/RNGeocoder/RNGeocoderPackage.java
grep prop-types node_modules/react-native-picker/index.js || perl -i -pe "s/import React.*/import React, { Component } from 'react';\nimport PropTypes from 'prop-types';/" node_modules/react-native-picker{,-android}/index.js node_modules/react-native-app-intro/AppIntro.js
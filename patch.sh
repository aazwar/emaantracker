#!/bin/bash

perl -i -pe 's/#import "(RCT.*)"/#import <React\/$1>/' node_modules/react-native-location/RNLocation.{m,h}

perl -i -pe "s/import React.*/import React, { Component } from 'react';\nimport PropTypes from 'prop-types';/" node_modules/react-native-picker{,-android}/index.js node_modules/react-native-app-intro/AppIntro.js
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {is, fromJS} from 'immutable';
import PropTypes from 'prop-types';
import API from '@/api/api';
import envconfig from "@/envconfig/envcofig";
import {saveFormData, saveImg, clearData} from "@/store/home/action";
// import
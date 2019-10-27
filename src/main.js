// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbvue/build/css/mdb.css';
import Vue from 'vue';
import App from './App';
import router from './router';
import firebase from 'firebase';
Vue.use(require('vue-moment'));

Vue.config.productionTip = false;

const config = {
  apiKey: "AIzaSyCTp7uN9iNakXcHaZr3Bu6qG_utiLjGv3k",
  authDomain: "meme-forum-4abe6.firebaseapp.com",
  databaseURL: "https://meme-forum-4abe6.firebaseio.com",
  projectId: "meme-forum-4abe6",
  storageBucket: "meme-forum-4abe6.appspot.com",
  messagingSenderId: "2601869002",
  appId: "1:2601869002:web:03a8cdfef0d3bf5b521e33",
  measurementId: "G-QXGFR8Y3GH"
};
// Initialize Firebase
firebase.initializeApp(config);
firebase.analytics();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});

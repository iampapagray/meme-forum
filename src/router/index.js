import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/Login';
import Homepage from '@/components/HomePage';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Homepage
    }
  ]
});

<template>
  <div class="hello">
    <div class="white-logo">
      <!-- <span class="text-center">MF</span> -->
      <p class="text-center align-middle">MF</p>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-md-4 offset-md-4">
          <div class="card" style="height: 50vh">
            <div class="card-body align-middle">
              <h2 class="card-title mt-5"><a >Meme Forum</a></h2>
              <p class="card-text mt-3">House of the funniest memes</p>
              <a href="#" class="btn btn-primary mt-3 " style="background: yellow !important;" @click="lognWithGoogle">Sign In with Google</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- <p class="mb-2">The application is configured and ready to import our components. You will find MDB Vue docs <a href="https://mdbootstrap.com/vue/" target="_blank">here</a>.</p>
    <p>Please type <span class="black-text">npm run demo</span> or <span class="black-text">yarn demo</span> to launch our Demonstration Page. The files with the code are placed in the <span class="black-text">demo</span> directory.</p>
    <p>If You want to completely remove our demo from Your App, easily type <span class="black-text">npm run remove-demo</span> or <span class="black-text">yarn remove-demo</span>.</p> -->
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'Login',
  data () {
    return {
      msg: 'Welcome to Your MDB Vue.js App'
    };
  },
  methods: {
    lognWithGoogle () {
      console.log('logging in')
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then((result) => {
        // console.log(result);
        localStorage.setItem('user', JSON.stringify(result.user));
        this.$router.replace('Home');
      }).catch((err) => {
        alert('err ' + err.message)
      })
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hello{
    background: yellow;
    height: 100vh;
  }
  .white-logo{
    text-align: left;
    background-color: white;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    margin-left: 1%;
  }
  .white-logo > p{
    color: yellow;
    text-align: center;
    padding-top: 15px;
  }
  h3 {
    font-weight: normal;
    padding-top: 20px;
    padding-bottom: 30px;
  }
  p {
    color: #969696;
    margin-bottom: 0;
    font-size: 14px;
  }
</style>

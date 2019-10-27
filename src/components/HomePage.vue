<template>
    <div class="home">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-4">
                    <div class="yellow-logo">
                        <p class="text-center align-middle">MF</p>
                    </div>
                </div>
                <div class="col-md-4 offset-md-4 text-right">
                    <img @click="logout" :src="user.photoURL" class=" z-depth-1 rounded-circle" alt="image" height="60" width="60">
                    <p>{{user.displayName}}</p>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 text-right mt-3">
                    <button type="button" class="btn btn-yellow">Upload Meme</button>
                </div>
            </div>
            <hr>
            <div class="row mt-5 " v-for="meme in memes" :key="meme.id">
                <div class="col-md-1 text-left"> <!-- buttons -->
                    <div class="upvote mt-5" :class="upvotes.includes(meme.id) ? 'voted':'n-voted'" @click="upvote(meme.id)" ></div>
                    <strong class="text-center"> {{ meme.votes }} </strong>
                    <div class="downvote" :class="downvotes.includes(meme.id) ? 'voted':'n-voted'" @click="downvote(meme.id)"></div>
                </div>
                <div class="col-md-5 text-left">
                    <img :src="meme.image" alt="meme" height="100%" width="100%" >
                </div>
                <div class="col-md-6 text-left">
                    <h3 style="color: yellow; padding-bottom: 5px;">{{ meme.caption}} </h3>
                    <span class="mb-5">{{ meme.totalComments }} Comments</span>
                    <div class="mt-4" style="display: flex">
                        <img :src="user.photoURL" class=" z-depth-1 rounded-circle" alt="image" height="50" width="50">
                        <p class="pl-3 pt-3">Posted {{ meme.created | moment("from", "now")   }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import firebase from 'firebase';

export default {
    name:'Home',
    data(){
        return {
            user: {},
            memes: [],
            upvotes: [],
            downvotes: [],
            myvotes: ''
        }
    },
    created(){
        let usr = firebase.auth().currentUser;

        if(usr){
            this.user.uid = usr.uid
            this.user.displayName = usr.displayName
            this.user.email = usr.email
            this.user.photoURL = usr.photoURL

            console.log('user in', this.user);

            this.fetchVotes();
            this.fetchMemes();
        }else{
             firebase.auth().signOut().then((res) => {
                this.$router.replace('/');
            })
        }
        
    },
    methods: {
        fetchMemes(){
            // fetchMemes
            firebase.firestore().collection('memes').get()
            .then(querySnapshot => {
            this.memes = []
            querySnapshot.forEach((doc)=>{
                let bundle = {};
                let data = doc.data();
                bundle.id =  doc.id;
                bundle.caption = data.caption
                bundle.image = data.image
                bundle.created = data.created_at.seconds
                bundle.totalComments = data.comments.total
                bundle.votes = data.votes

                this.memes.push(bundle);
            });
            }).catch((err)=>{
            console.log('error loading data', err.message);
            });
        },
        fetchVotes(){
            // fetch votes
            firebase.firestore().collection("votes").where("user", "==", this.user.uid).get().then((querySnapshot) => {
                if(querySnapshot.size > 0){
                    querySnapshot.forEach((doc)=>{
                        this.myvotes = doc.id
                        this.upvotes = doc.data().memes_voted.ups
                        this.downvotes = doc.data().memes_voted.downs
                        // console.log('votes',this.votes)
                    });
                }else{
                    console.log('No votes yet')
                }
            }).catch((err)=>{
                console.log('Err')
            });
        },
        upvote(memId){
            if(!this.upvotes.includes(memId) && !this.downvotes.includes(memId)){
                // add +1 votes and record in ups
                var ref = firebase.firestore().collection("memes").doc(memId);
                var voteRef = firebase.firestore().collection("votes").doc(this.myvotes);
                return ref.update({
                  votes: firebase.firestore.FieldValue.increment(1)
                })
                .then(() => {
                    this.fetchMemes();
                    return voteRef.update({
                        "memes_voted.ups": firebase.firestore.FieldValue.arrayUnion(memId)
                    })
                    .then(()=>{
                        this.fetchVotes();
                    });
                    console.log("Document successfully updated!");
                })
                .catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
            }else if(!this.upvotes.includes(memId) && this.downvotes.includes(memId)){
                // remove record from down, add +2 votes and record in ups
                var ref = firebase.firestore().collection("memes").doc(memId);
                var voteRef = firebase.firestore().collection("votes").doc(this.myvotes);
                return ref.update({
                  votes: firebase.firestore.FieldValue.increment(2)
                })
                .then(() => {
                    this.fetchMemes();
                    return voteRef.update({
                        "memes_voted.ups": firebase.firestore.FieldValue.arrayUnion(memId),
                        "memes_voted.downs": firebase.firestore.FieldValue.arrayRemove(memId)
                    })
                    .then(()=>{
                        this.fetchVotes();
                    });
                    console.log("Document successfully updated!");
                })
                .catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
            }else{
                // do resset
                var ref = firebase.firestore().collection("memes").doc(memId);
                var voteRef = firebase.firestore().collection("votes").doc(this.myvotes);
                
                return ref.update({
                  votes: firebase.firestore.FieldValue.increment(-1)
                })
                .then(() => {
                    this.fetchMemes();
                    return voteRef.update({
                        "memes_voted.ups": firebase.firestore.FieldValue.arrayRemove(memId),
                    })
                    .then(()=>{
                        this.fetchVotes();
                    });
                    console.log("Document successfully updated!");
                })
                .catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
            }
        },
        downvote(memId){
            console.log('down', memId)
            if(!this.upvotes.includes(memId) && !this.downvotes.includes(memId)){
                // subtract -1 votes and record in downs
                var ref = firebase.firestore().collection("memes").doc(memId);
                var voteRef = firebase.firestore().collection("votes").doc(this.myvotes);
                return ref.update({
                  votes: firebase.firestore.FieldValue.increment(-1)
                })
                .then(() => {
                    this.fetchMemes();
                    return voteRef.update({
                        "memes_voted.downs": firebase.firestore.FieldValue.arrayUnion(memId)
                    })
                    .then(()=>{
                        this.fetchVotes();
                    });
                    console.log("Document successfully updated!");
                })
                .catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
            }else if(this.upvotes.includes(memId) && !this.downvotes.includes(memId)){
                // remove record from ups, subtract -2 votes and record in downs
                var ref = firebase.firestore().collection("memes").doc(memId);
                var voteRef = firebase.firestore().collection("votes").doc(this.myvotes);

                return ref.update({
                  votes: firebase.firestore.FieldValue.increment(-2)
                })
                .then(() => {
                    this.fetchMemes();
                    return voteRef.update({
                        "memes_voted.ups": firebase.firestore.FieldValue.arrayRemove(memId),
                        "memes_voted.downs": firebase.firestore.FieldValue.arrayUnion(memId)
                    })
                    .then(()=>{
                        this.fetchVotes();
                    });
                    console.log("Document successfully updated!");
                })
                .catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
            }else{
                // do reset
                var ref = firebase.firestore().collection("memes").doc(memId);
                var voteRef = firebase.firestore().collection("votes").doc(this.myvotes);
                
                return ref.update({
                  votes: firebase.firestore.FieldValue.increment(1)
                })
                .then(() => {
                    this.fetchMemes();
                    return voteRef.update({
                        "memes_voted.downs": firebase.firestore.FieldValue.arrayRemove(memId),
                    })
                    .then(()=>{
                        this.fetchVotes();
                    });
                    console.log("Document successfully updated!");
                })
                .catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
            }
        },
        logout() {
            console.log('logging out')
            firebase.auth().signOut().then((res) => {
                this.$router.replace('/');
            })
        }
    }
}
</script>

<style scoped>
  .home{
    background: white;
    min-height: 100vh;
  }
  .yellow-logo{
    text-align: left;
    background-color: yellow;
    height: 60px;
    width: 60px;
    border-radius: 50%;
    margin-left: 1%;
  }
  .yellow-logo > p{
    color: white;
    text-align: center;
    padding-top: 20px;
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

  .upvote{
      cursor: pointer;
      height: 60px;
      width: 40px;
      clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  }
  .voted{
      background-color: yellow;
  }
  .n-voted{
      background-color: grey;
  }
  .downvote{
      cursor: pointer;
      height: 60px;
      width: 40px;
      clip-path: polygon(100% 0, 0 0, 50% 100%);
  }
</style>
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB2Yg3hmkZa-2v1gXgSHAuMU8cQHXd2HDU",
    authDomain: "meme-me-9626c.firebaseapp.com",
    databaseURL: "https://meme-me-9626c.firebaseio.com",
    projectId: "meme-me-9626c",
    storageBucket: "meme-me-9626c.appspot.com",
    messagingSenderId: "934352914231"
  };
  firebase.initializeApp(config);

  // Intialize Firestore through Firebase

  var db = firebase.firestore();

  // Disable deprecated features
  db.settings({
      timestampsInSnapshots: true
  });
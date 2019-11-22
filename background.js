// TODO(DEVELOPER): Change the values below using values from the initialization snippet: Firebase Console > Overview > Add Firebase to your web app.
// Initialize Firebase
var config = {
  apiKey: 'AIzaSyBheoyoOSF7RQqnFDrHNGXSg9nSuzEorKY',
  databaseURL: 'https://console.firebase.google.com/u/0/project/free-app-d2064/database/free-app-d2064/data',
  storageBucket: "free-app-d2064.appspot.com"
};
firebase.initializeApp(config);

/**
 * initApp handles setting up the Firebase context and registering
 * callbacks for the auth status.
 *
 * The core initialization is in firebase.App - this is the glue class
 * which stores configuration. We provide an app name here to allow
 * distinguishing multiple app instances.
 *
 * This method also registers a listener with firebase.auth().onAuthStateChanged.
 * This listener is called when the user is signed in or out, and that
 * is where we update the UI.
 *
 * When signed in, we also authenticate to the Firebase Realtime Database.
 */
function initApp() {
  // Listen for auth state changes.
  firebase.auth().onAuthStateChanged(function(user) {
    console.log('User state change detected from the Background script of the Chrome Extension:', user);
  });
}

window.onload = function() {
  initApp();
};




// this file will run once on extension load
var config = {
    apiKey: "AIzaSyBheoyoOSF7RQqnFDrHNGXSg9nSuzEorKY",
    authDomain: "free-app-d2064.firebaseapp.com",
    databaseURL: "https://free-app-d2064.firebaseio.com",
    projectId: "free-app-d2064",
    storageBucket: "free-app-d2064.appspot.com",
    messagingSenderId: "567576616832",
    appId: "1:567576616832:web:7a537f5be92ebf1fe86b65"
  
};
const app = firebase.initializeApp(config);
const appDb = app.database().ref();


// instantiate global application state object for Chrome Storage and feed in firebase data
// Chrome Storage will store our global state as a a JSON stringified value.

const applicationState = { values: [] };

appDb.on('child_added', snapshot => {
  applicationState.values.push({
    id: snapshot.key,
    value: snapshot.val()
  });
  updateState(applicationState);
});

appDb.on('child_removed', snapshot => {
  const childPosition = getChildIndex(applicationState, snapshot.key)
  if (childPosition === -1) return
  applicationState.values.splice(childPosition, 1);
  updateState(applicationState);
});

appDb.on('child_changed', snapshot => {
  const childPosition = getChildIndex(applicationState, snapshot.key)
  if (childPosition === -1) return
  applicationState.values[childPosition] = snapshot.val();
  updateState(applicationState);
});

// updateState is a function that writes the changes to Chrome Storage
function updateState(applicationState) {
  chrome.storage.local.set({ state: JSON.stringify(applicationState) });
}

// getChildIndex will return the matching element in the object
function getChildIndex(appState, id) {
  return appState.values.findIndex(element => element.id == id)
}

// if your Chrome Extension requires any content scripts that will manipulate data,
// add a message listener here to access appDb:

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  switch (msg.type) {
    case 'updateValue':
      appDb.child(msg.opts.id).set({ value: msg.opts.value });
      response('success');
      break;
    default:
      response('unknown request');
      break;
  }
});
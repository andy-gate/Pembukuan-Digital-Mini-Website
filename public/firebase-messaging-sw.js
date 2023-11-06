importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js");


var firebaseConfig = {
  apiKey: "AIzaSyD5cdBcOSRlKuKa9QjRBoFDA6p_5mLGlMM",
  authDomain: "artaka-mpos.firebaseapp.com",
  databaseURL: "https://artaka-mpos.firebaseio.com",
  projectId: "artaka-mpos",
  storageBucket: "artaka-mpos.appspot.com",
  messagingSenderId: "96038767508",
  appId: "1:96038767508:web:4a3a86fff8db49d6c1dd81",
  measurementId: "G-X8B0QL18EQ"
};


firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(payload => {
   const title = payload.notification.title;
   const options = {
      body: payload.notification.body,
      icon: payload.notification.icon
   }
   return self.registration.showNotification(title, options);
})

self.addEventListener("notificationclick", function(event) {
   console.log('ARTAKA: -> ', event)
   const clickedNotification = event.notification;
   clickedNotification.close();
   const promiseChain = clients
       .matchAll({
           type: "window",
           includeUncontrolled: true
        })
       .then(windowClients => {
           let matchingClient = null;
           for (let i = 0; i < windowClients.length; i++) {
               const windowClient = windowClients[i];
               if (windowClient.url === feClickAction) {
                   matchingClient = windowClient;
                   break;
               }
           }
           if (matchingClient) {
               return matchingClient.focus();
           } else {
               return clients.openWindow(feClickAction);
           }
       });
       event.waitUntil(promiseChain);
});

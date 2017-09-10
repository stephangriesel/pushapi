importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-database.js')
importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-messaging.js')

firebase.initializeApp ({
    apiKey: 'AIzaSyDy5e7NDpbkXLBriI7JW36xU__GYeM7CbE',
    authDomain: 'first-api-bef6e.firebaseapp.com',
    databaseURL: 'https://first-api-bef6e.firebaseio.com',
    projectId: 'first-api-bef6e',
    storageBucket: 'first-api-bef6e.appspot.com',
    messagingSenderId: '876269114794'
})

self.addEventListener('notificationclick', event => {
    event.notification.close()

    event.waitUntil(
        self.clients.openWindow('https://artofmyself.com')
    )
})
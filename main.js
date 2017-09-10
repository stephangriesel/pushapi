firebase.initializeApp ({
    apiKey: 'AIzaSyDy5e7NDpbkXLBriI7JW36xU__GYeM7CbE',
    authDomain: 'first-api-bef6e.firebaseapp.com',
    databaseURL: 'https://first-api-bef6e.firebaseio.com',
    projectId: 'first-api-bef6e',
    storageBucket: 'first-api-bef6e.appspot.com',
    messagingSenderId: '876269114794'
})

const messaging = firebase.messaging(),
      database  = firebase.database(),
      pushBtn   = document.getElementById('push-button')

let userToken    = null,
    isSubscribed = false

window.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('https://cdn.css-tricks.com/service-worker.js')
        .then(registration => {
            messaging.useServiceWorker(registration)
            initializePush()
        })
        .catch(err => console.log('Service Worker Error', err))
    } else {
        pushBtn.textContent = 'Push not supported.'
    }
})

function initializePush(){
    userToken = localStorage.getItem('pushToken')
    isSubscribed = userToken !== null
    updateBtn()

    pushBtn.addEventListener('click', () => {
        pushBtn.disabled = true
        if (isSubscribed) return unsubscribeUser()
            return subscribeUser()
    })
}

function updateBtn(){
    if (Notification.permission === 'denied') {
        pushBtn.textContent = 'Subscription Blocked'
        return
    }

    pushBtn.textContent = isSubscribed ? 'Unsubscribe' : 'Subscribe'
    pushBtn.disabled = false
}

function subscribeUser(){
    messaging.requestPermission()
    .then(() => messaging.getToken())
    .then(token => {
        updateSubscriptionOnServer(token)
        isSubscribed = true
        userToken = token
        localStorage.setItem('pushToken', token)
        updateBtn()
    })
    .catch(err => console.log('Denied'. err))
}

function updateSubscriptionOnServer(token) {
    if (isSubscribed) {
        return database.ref('device_ids')
        .equalTo(token)
        .on('child_added',snapshot => snapshot.ref.remove())
    }

    database.ref('device_ids').once('value')
    .then(snapshots => {
        let deviceExists = false

        snapshots.forEach(childSnapshot => {
            if (childSnapshot.val() === token) {
                deviceExists = true
                return console.log('device already registered');
            }
        })

        if (!deviceExists) {
            console.log('Device subscribed');
            return database.ref('device_ids').push(token)
        }
    })
}

function unsubscribeUser() {
    messaging.deleteToken(userToken)
    .then(() => {
        updateSubscriptionOnServer(userToken)
        isSubscribed = false
        userToken = null
        localStorage.removeItem('pushToken')
        updateBtn()
    })
    .catch(err => console.log('Error unsubscribing', err))
}
import firebase from 'firebase';

console.log('firebase imported:', firebase);

class Fire {

    constructor() {
        this.init()
        this.checkAuth()
    }

    init = () => {
        if ( !firebase.apps.length ){
            firebase.initializeApp({
                apiKey: "AIzaSyA-oSHhc7ambLmafOOzH1ka2eGNoahYy7s",
                authDomain: "message-d4622.firebaseapp.com",
                projectId: "message-d4622",
                storageBucket: "message-d4622.appspot.com",
                messagingSenderId: "138146587065",
                appId: "1:138146587065:web:18fe95e815cc707c6f1668",
                measurementId: "G-SKJ5527MF9"
            })
        }
    };

    checkAuth = () => {
        firebase.auth().onAuthStateChange(user => {
            if(!user){
                firebase.auth().signInAnonymously();
            }
        });
    };

    send = messages => {
        messages.forEach(item => {
            const message = { 
                text : item.text,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                user: item.user
            };
            this.db.push(message)
        });
    };

    parse = message => {
        const {user,text,timestamp} = message.val()
        const {key: _id} = message
        const createdAt = new Date(timestamp)

        return{
            _id,
            createdAt,
            text,
            user
        };
    };

    get = callback => {
        this.db.on('child_added' , snapshot => callback(this.parse(snapshot)));
    };

    off() {
        this.db.off()
    }

    get db() {
        return firebase.database().ref("messages");
    }

    get uid() {
        return (firebase.auth().currentUser || {} ).uid
    }

}

export default new Fire();
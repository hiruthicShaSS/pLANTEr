// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyBATld8UXtBo95E5ZE5pCvqMhZ-qEoy-po",
    authDomain: "planter-4cca6.firebaseapp.com",
    databaseURL: "https://planter-4cca6.firebaseio.com",
    projectId: "planter-4cca6",
    storageBucket: "planter-4cca6.appspot.com",
    messagingSenderId: "129308553740",
    appId: "1:129308553740:web:cff6256bd7532e4763b429",
    measurementId: "G-2NYD7CR74X"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Make auth and firestore refrences
const auth = firebase.auth();
const auth_ = firebase.auth;


document.getElementById("login").addEventListener("click", login);
document.getElementById("register").addEventListener("click", register);

document.getElementById("login-github").addEventListener("click", login_github);
document.getElementById("login-google").addEventListener("click", login_google);

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password).then(cred => {
        location.replace(`https://hiruthic2002.github.io/pLANTEr/Website/index.html?uid=${cred.user.uid}&email=${email}`);
    }).catch(error => {
        document.getElementById("status").innerText = "Login Failure!😥";
        document.getElementById("status-info").innerText = `Error message: ${error.message}`;
        $("#modal-error").modal("open");
    });
}

function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        document.getElementById("status").innerText = "Registration Success!😀";
        document.getElementById("status-info").innerText = `This is your UID: ${cred.user.uid}`;
        $("#modal-error").modal("open");
    }).catch(error => {
        document.getElementById("status").innerText = "Registration Failure!😥";
        document.getElementById("status-info").innerText = `Error message: ${error.message}`;
        $("#modal-error").modal("open");
    });
}

function login_github() {
    const provider = new auth_.GithubAuthProvider();
    provider.addScope("user");
    auth.signInWithPopup(provider).then(result => {
        const token = result.credential.accessToken;
        const user = result.user;
        location.replace(`https://hiruthic2002.github.io/pLANTEr/Website/index.html?user=GitHub: ${user}&uid=${user.uid}&email=${user.email}`);
    }).catch(error => {
        document.getElementById("status").innerText = "OAuth Failure!😥";
        document.getElementById("status-info").innerText = `Error message: ${error.message}`;
        $("#modal-error").modal("open");
    })
}

function login_google() {
    const provider = new auth_.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    provider.setCustomParameters({
        'login_hint': 'user@example.com'
    });
    auth.signInWithPopup(provider).then(result => {
        const token = result.credential.accessToken;
        const user = result.user;
        location.replace(`https://hiruthic2002.github.io/pLANTEr/Website/index.html?user=GitHub: ${user}&uid=${user.uid}&email=${user.email}`);
    }).catch(error => {
        document.getElementById("status").innerText = "OAuth Failure!😥";
        document.getElementById("status-info").innerText = `Error message: ${error.message}`;
        $("#modal-error").modal("open");
    })
}


function signOut() {
    auth.signOut().then(() => location.replace(`https://hiruthic2002.github.io/pLANTEr/Website/index.html?signOut=1`)).catch(error => {
        document.getElementById("status").innerText = "Log Out Failure!😥";
        document.getElementById("status-info").innerText = `Error message: ${error.message}`;
        $("#modal-error").modal("open");
    })
}

$(document).ready(function() {
    $(".modal").modal();
});

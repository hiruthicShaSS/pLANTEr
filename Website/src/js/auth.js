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


// START: Event Binders ================================================================================
document.body.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        login();
    }
})

document.getElementById("login").addEventListener("click", login);
document.getElementById("register").addEventListener("click", register);

document.getElementById("login-github").addEventListener("click", login_github);
document.getElementById("login-google").addEventListener("click", login_google);
// END: Event Binders ================================================================================

const load = () => document.getElementById("loading").style.display = "block";
const unLoad = () => document.getElementById("loading").style.display = "none";

const param = new URLSearchParams(window.location.search);

function postLogin(loc) {
    if (document.getElementById("remember").checked) {
        // TODO: Presistent login

        // auth.setPersistence(auth_.Auth.Persistense.LOCAL).catch(() => {
        //     document.getElementById("status").innerText = "Something went wrong!😥";
        //     document.getElementById("status-info").innerText = `Error message: ${error.message}`;
        //     $("#modal-error").modal("open");
        // })
    }

    location.replace(loc);
}

// START: Account Management ==========================================================================
function login() {
    load();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password).then(cred => {
        if (parseInt(param.get("relogin")) == 1) {
            location.replace(`index.html?uid=${cred.user.uid}&email=${email}&relogin=1`);
            return;
        }
        postLogin(`index.html?uid=${cred.user.uid}&email=${email}`);
    }).catch(error => {
        unLoad();
        document.getElementById("status").innerText = "Login Failure!😥";
        document.getElementById("status-info").innerText = `Error message: ${error.message}`;
        $("#modal-error").modal("open");
    });
}

function register() {
    load();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        document.getElementById("status").innerText = "Registration Success!😀";
        cred.user.updateProfile({ displayName: email.match(/^([^@]*)@/)[1] }); // Not working
        document.getElementById("status-info").innerText = `This is your UID: ${cred.user.uid}`;
        $("#modal-error").modal("open");
        document.getElementById("ok").addEventListener("click", postLogin(`index.html?uid=${cred.user.uid}&email=${email}`));
    }).catch(error => {
        unload();
        document.getElementById("status").innerText = "Registration Failure!😥";
        document.getElementById("status-info").innerText = `Error message: ${error.message}`;
        $("#modal-error").modal("open");
    });
}

// Start: OAuth Account Management ======================================================================
function login_github() {
    load();
    const provider = new auth_.GithubAuthProvider();
    provider.addScope("user");
    auth.signInWithPopup(provider).then(result => {
        const token = result.credential.accessToken;
        const user = result.user;
        if (parseInt(param.get("relogin")) == 1) {
            location.replace(`index.html?user=GitHub: ${user}&uid=${user.uid}&email=${user.email}&relogin=1`);
            return;
        }
        postLogin(`index.html?user=GitHub: ${user}&uid=${user.uid}&email=${user.email}`);
    }).catch(error => {
        unload();
        document.getElementById("status").innerText = "OAuth Failure!😥";
        document.getElementById("status-info").innerText = `Error message: ${error.message}`;
        $("#modal-error").modal("open");
    })
}

function login_google() {
    load();
    const provider = new auth_.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    provider.setCustomParameters({
        'login_hint': 'user@example.com'
    });
    auth.signInWithPopup(provider).then(result => {
        const token = result.credential.accessToken;
        const user = result.user;
        if (parseInt(param.get("relogin")) == 1) {
            location.replace(`index.html?user=GitHub: ${user}&uid=${user.uid}&email=${user.email}&relogin=1`);
            return;
        }
        postLogin(`index.html?user=GitHub: ${user}&uid=${user.uid}&email=${user.email}`);
    }).catch(error => {
        unload();
        document.getElementById("status").innerText = "OAuth Failure!😥";
        document.getElementById("status-info").innerText = `Error message: ${error.message}`;
        $("#modal-error").modal("open");
    })
}
// END: OAuth Account Management ========================================================================

// Reset password
document.getElementById("reset-password").addEventListener("click", () => {
    const email = document.getElementById("email").value;
    auth.sendPasswordResetEmail(email).then(() => {
        document.getElementById("status").innerText = "Password reset mail sent!";
        document.getElementById("status-info").innerText = "";
        $("#modal-error").modal("open");
    }).catch(error => {
        document.getElementById("status").innerText = "Password reset failure!😥";
        document.getElementById("status-info").innerText = `Error message: ${error.message}`;
        $("#modal-error").modal("open");
    })
})


function signOut() {
    auth.signOut().then(() => location.replace(`index.html?signOut=1`)).catch(error => {
        document.getElementById("status").innerText = "Log Out Failure!😥";
        document.getElementById("status-info").innerText = `Error message: ${error.message}`;
        $("#modal-error").modal("open");
    })
}
// END: Account Management ==============================================================================

$(document).ready(function() {
    $(".modal").modal();
});
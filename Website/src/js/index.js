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

const auth = firebase.auth();
var storageRef = firebase.storage().ref();

function isMobileDevice() {
    var check = false;
    (function(a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

if (isMobileDevice()) {
    alert("Some parts of this site is not optimized for mobile platforms.");
}

let UID = ""

// START: Event Binders ================================================================================
document.getElementById("account").addEventListener("click", () => $("#modal-account").modal("open"));
document.getElementById("get").addEventListener("click", () => {
    let username = document.getElementById("username").value;
    if (username != "") {
        scrape();
    } else {
        document.getElementById("required-username").innerText = "Required";
        document.getElementById("required-username").style.color = "red";
        setTimeout(() => {
            document.getElementById("required-username").innerText = "";
        }, 2000);
    }
});

const logoutElements = document.getElementsByClassName("logout");
for (let i = 0; i < logoutElements.length; i++) {
    logoutElements[i].addEventListener("click", signOut);
}

function signOut() {
    auth.signOut().then(() => location.replace(`index.html?signOut=1`)).catch(error => {
        document.getElementById("status").innerText = "Log Out Failure!😥";
        document.getElementById("status-info").innerText = `Error message: ${error.message}`;
        $("#modal-error").modal("open");
    })
}

// START: Update user profile picture - Promise =========================================================
var file, uploadImage;
document.getElementById("upload_profile_pic").addEventListener("change", (e) => {
    file = e.target.files[0];

    uploadImage = new Promise((resolve, reject) => {
        var metadata = { contentType: 'image/.*', size: file.size };
        const uploadTask = storageRef.child(`/users/${UID}/profile_pic.jpg`).put(file, metadata);

        // Listen for changes in upload
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');

            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    document.getElementById("error_code").innerHTML = `<p style="color: green">Upload Paused!</a>`;
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    document.getElementById("file_upload_status").setAttribute("value", progress);
                    console.log('Upload is running');
                    break;
            }
        }, (error) => {
            switch (error.code_) {
                case 'storage/unauthorized':
                    document.getElementById("error_code").innerHTML = `<p style="color: red">You are unauthorized</p>`;
                    break;

                case 'storage/canceled':
                    document.getElementById("error_code").innerHTML = `<p style="color: red">Upload cancelled</p>`;
                    break;

                case "storage/object-not-found":
                    break;

                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    document.getElementById("error_code").innerHTML = `<p style="color: red">Unknown error occurred, ${error.serverResponse}</p>`;
                    break;
                default:
                    document.getElementById("error_code").innerHTML = `<p style="color: red">${error.message_}</p>`
                    break;
            }
            reject(error.code);
        }, () => {
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                document.getElementById("update-loading").style.display = "none";
                document.getElementById("file_upload_status").setAttribute("value", 100);
                document.getElementById("error_code").innerHTML = `<p style="color: green">File uploaded!</p>
                <a href="${downloadURL}">Download</a>`;
                document.getElementById("user_pic").setAttribute("src", downloadURL);
                resolve(downloadURL);
            });
        }))
    });
});
// END: Update user profile picture - Promise ==========================================================
// END: Event Binders ==================================================================================

// START: Fetch info ===================================================================================
let timer = 0;

function scrape() {
    setInterval(() => timer++, 1000);
    let username = document.getElementById("username").value;
    let getInfo = document.getElementById("getInfo").checked;
    let cache = document.getElementById("cache").checked;

    document.getElementById("get").style.display = "none";
    document.getElementById("loading").style.display = "block";

    fetch(
            `https://planter-server.herokuapp.com/fetch?username=${username}&getInfo=${(getInfo) ? 1 : 0}&force=${(cache) ? 1 : 0}`
        )
        .then((response) => response.json())
        .then((data) => {
            if (parseInt(data.code) == 400) {
                console.log(data.message);
                return
            }

            document
                .getElementById("avatar")
                .setAttribute("src", data.info.image_url);
            document.getElementById("blog").setAttribute("href", data.info.blog);
            document
                .getElementById("twitter")
                .setAttribute("href", data.info.twitter);
            document.getElementById("bio").innerText = data.info.bio;
            // document.getElementById("followers").innerText = data.followers;
            // document.getElementById("follower-btn").setAttribute("data-url", data.followers_url);
            // document.getElementById("following").innerText = data.following;
            // document.getElementById("following-btn").setAttribute("data-url", data.following_url);
            document
                .getElementById("link")
                .setAttribute("href", `https://github.com/${username}`);

            document.getElementById("data").innerHTML = `Total Stars:                     ${data.data[0]}<br/>
                                                         Total Commits (${data.data[1]}): ${data.data[2]}<br/>
                                                         Total PRs:                       ${data.data[3]}<br/>
                                                         Total Issues:                    ${data.data[4]}<br/>
                                                         Contributed to:                  ${data.data[5]}<br/><hr>`

            document.getElementById("data-section").style.display = "block";
            document.getElementById("loading").style.display = "none";
            console.log(data);

            M.toast({ html: `Scraping completed in ${parseFloat(data.time).toPrecision(2)} seconds<br>
            Total time taken: ${timer} seconds` });
        });
}
// END: Fetch Info ======================================================================================

// START: Update user ===================================================================================
// Save button EventListener
document.getElementById("save").addEventListener("click", () => {
    function toaster(msg = "User info updated!") {
        M.toast({ html: msg });
    }

    document.getElementById("update-loading").style.display = "block";
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;

    const user = auth.currentUser;

    // Update user name
    if (name != "" && name != user.displayName) {
        user.updateProfile({ displayName: name }).then(() => {
            document.getElementById("update-loading").style.display = "none";
            toaster();
        }).catch(error => {
            toaster(error.message);
        })
    }
    // Update user email
    if (email != "" && email != user.email) {
        user.updateEmail(email).then(() => {
            document.getElementById("update-loading").style.display = "none";
            toaster();
        }).catch(err => {
            document.getElementById("update-loading").style.display = "none";
            toaster(`An error occured: ${err.message}`);
            if (err.code == "auth/requires-recent-login") {
                setTimeout(() => {
                    if (confirm("Do you want to re-login to change your email ?")) {
                        location.replace("accounts.html?relogin=1");
                    }
                }, 3000);
            }
        })
    }
    // Update user password
    if (password != "") {
        user.updatePassword(password).then(() => {
            document.getElementById("update-loading").style.display = "none";
            toaster();
        }).catch(err => {
            document.getElementById("update-loading").style.display = "none";
            toaster(`An error occured: ${err.message}`);
            if (err.code == "auth/requires-recent-login") {
                setTimeout(() => {
                    if (confirm("Do you want to re-login to change your password ?")) {
                        location.replace("accounts.html?relogin=1");
                    }
                }, 3000);
            }
        });
    }

    // Update user profile pic
    uploadImage.then(downloadURL => {
        user.updateProfile({ photoURL: downloadURL }).then(() => {
            toaster();
        });
    }).catch(error => {
        console.log(error);
    })
});
// END: Update user =====================================================================================

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(key, val) {
    if (getCookie(key) == val) {

    } else {
        document.cookie = `${key}=${val};`;
        introJs().start();
    }
}


$(document).ready(function() {
    setCookie("visited", "true");

    $(".sidenav").sidenav({
        menuWidth: 300, // Default is 300
        edge: 'left', // Choose the horizontal origin
        closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        draggable: true, // Choose whether you can drag to open on touch screens,
    });
    $('.parallax').parallax();
    $(".modal").modal();
    $('.collapsible').collapsible();


    const param = new URLSearchParams(window.location.search);
    const uid = param.get("uid");
    const email = (param.get("email") == null) ? "Login" : param.get("email");

    auth.onAuthStateChanged(user => {
        if (user) {
            UID = user.uid
            const loginElements = document.getElementsByClassName("login")
            for (let i = 0; i < loginElements.length; i++) {
                loginElements[i].innerHTML = `<img src="${(user.photoURL == null) ? "res/tree.png" : user.photoURL}" alt="user profile pic" id="avatar-account" class="z-depth-1 left circle responsive-img">${user.email}`;
            }

            document.getElementById("user_pic").setAttribute("src", (user.photoURL == null) ? "res/tree.png" : user.photoURL);
            document.getElementById("email").setAttribute("value", user.email);
            document.getElementById("name").setAttribute("value", (user.displayName == null) ? "" : user.displayName);

            if (parseInt(param.get("relogin")) == 1) {
                $("#modal-account").modal("open");
            }
            $(".dropdown-trigger").dropdown();
        }
    })
});
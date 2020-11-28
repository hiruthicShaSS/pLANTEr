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
const db = firebase.firestore();


const videos = document.getElementById("videos");
document.getElementById("upload").addEventListener("click", upload);


function upload() {
    let link;
    let caption;

    function uploadMetadata() {
        link = document.getElementById("link").value;
        caption = document.getElementById("caption").value;

        let hostname;
        if (link.indexOf("//") > -1) {
            hostname = link.split("/")[2];
        } else {
            hostname = link.split("/")[0];
        }

        hostname = hostname.split(":")[0];
        hostname = hostname.split("?")[0];

        if (hostname == "youtu.be") {
            link = link.replace("youtu.be", "youtube.com/embed");
        }
    }

    $("#modal-upload").modal("open");
    document.getElementById("modal-upload-btn").addEventListener("click", (e) => {
        uploadMetadata();

        if (link != "" && caption != "") {
            auth.onAuthStateChanged(user => {
                if (user) {
                    const time = firebase.firestore.Timestamp.fromDate(new Date());
                    data = {
                        [time]: [link, caption, user.displayName],
                    }
                    db.collection("halloffame").doc(user.uid).update(data).then(() => {
                        document.getElementById("required").innerText = "Video uploaded";
                        document.getElementById("required").style.color = "green";
                    }).catch((error) => {
                        document.getElementById("required").innerText = `Something went wrong, ${error}`;
                        document.getElementById("required").style.color = "red";
                    })
                } else {
                    $("#modal-signin").modal("open");
                }
            })
        } else {
            document.getElementById("required").innerText = "Fill every inputs";
            document.getElementById("required").style.color = "red";
        }
    });
}

let grid = document.createElement("div");
grid.setAttribute("class", "row");

function render() {
    function finish(uid, link, name, caption) {
        let iframe_base = document.createElement("iframe");
        iframe_base.setAttribute("frameborder", 0);
        iframe_base.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");

        let grid_col = document.createElement("div");
        grid_col.setAttribute("class", "col s4");
        grid.appendChild(grid_col);

        let row = document.createElement("div");
        row.setAttribute("class", "row");
        // let col = document.createElement("div");
        // col.setAttribute("class", "col s12 m4");
        let card = document.createElement("div");
        card.setAttribute("class", "card");
        let card_image = document.createElement("div");
        card_image.setAttribute("class", "card-image video-container");
        let card_content = document.createElement("div");
        card_content.setAttribute("class", "card-content");
        let user = document.createElement("span");
        user.setAttribute("class", "card-title");
        let p = document.createElement("p");


        row.appendChild(card);
        // col.appendChild(card);
        card.appendChild(card_image);
        card.appendChild(user);
        card_content.appendChild(p);
        card.appendChild(card_content);

        grid_col.appendChild(row);

        iframe_base.setAttribute("src", link);
        card_image.appendChild(iframe_base);
        user.innerText = name;
        p.innerText = caption;

        videos.appendChild(grid);
    }

    db.collection("halloffame").onSnapshot(doc => {
        doc.forEach(data => {
            db.collection("halloffame").doc(data.id).get().then(posts => {
                const post = posts.data();
                const times = Object.keys(post);

                for (let i = 0; i < times.length; i++) {
                    finish(data.id, post[times[i]][0], post[times[i]][2], post[times[i]][1]);
                }
            })
        })
    })
}


$(document).ready(() => {
    $(".modal").modal();
    render();
})
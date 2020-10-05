document.getElementById("get").addEventListener("click", chooseMethod);

const base_url = "https://api.github.com";

function chooseMethod() {
    let username = document.getElementById("username").value;
    if (username != "") {
        if (document.getElementById("switch").checked) {
            scrape();
        } else {
            get();
        }
    } else {
        document.getElementById("required-username").innerText = "Required";
        document.getElementById("required-username").style.color = "red";
        setTimeout(() => {
            document.getElementById("required-username").innerText = "";
        }, 2000);
    }
}

// Better to stay with scraping process than using the api
// Might remove the below block and set to scrap alone
function get() {
    let username = document.getElementById("username").value;

    if (username != "") {
        // fetch(`https://api.github.com/users/${username}`).then(response => {
        //     return response.json();
        // }).then(data => {
        //     document.getElementById("data-section").style.display = "block";
        //     document.getElementById("avatar").setAttribute("src", data.avatar_url);
        //     document.getElementById("blog").setAttribute("href", data.blog)
        //     document.getElementById("followers").innerText = data.followers;
        //     document.getElementById("follower-btn").setAttribute("data-url", data.followers_url);
        //     document.getElementById("following").innerText = data.following;
        //     document.getElementById("following-btn").setAttribute("data-url", data.following_url);
        //     document.getElementById("link").setAttribute("href", data.html_url);

        //     if (data.message) {
        //         $("#modal-error").modal("open");
        //         document.getElementById("loading").style.display = "none";
        //         return
        //     }

        //     // Fetch PR's
        //     fetch(data.repos_url).then(res => res.json())
        //         .then(data => {
        //             data.forEach(repo => {
        //                 fetch(`https://api.github.com/repos/${repo.full_name}/commit_activity`).then(res => res.json())
        //                     .then(data => {
        //                         console.log(data);
        //                     });
        //             })
        //         });
        // });

        fetch(`https://api.github.com/users/${username}/repos`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.message) {
                    $("#modal-error").modal("open");
                    document.getElementById("loading").style.display = "none";
                    return;
                }

                document.getElementById("get").style.display = "none";
                document.getElementById("loading").style.display = "block";

                data.forEach((repo) => {
                    repo = repo.name;
                    let first_commit = get_first_commit(repo);
                    let compare_url =
                        base_url +
                        "/repos/" +
                        username +
                        "/" +
                        repo +
                        "/compare/" +
                        first_commit +
                        "..." +
                        "master";
                    let commit_req = httpGet(compare_url);
                    let commit_count = JSON.parse(commit_req)["total_commits"] + 1;
                    console.log("Commit Count: ", commit_count);
                });
                document.getElementById("loading").style.display = "none";
            });
    } else {
        document.getElementById("required-username").innerText = "Required";
        document.getElementById("required-username").style.color = "red";
        setTimeout(() => {
            document.getElementById("required-username").innerText = "";
        }, 2000);
    }

    function httpGet(theUrl, return_headers) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", theUrl, false); // false for synchronous request
        xmlHttp.send(null);
        if (return_headers) {
            return xmlHttp;
        }
        return xmlHttp.responseText;
    }

    function get_first_commit(repo) {
        let url = base_url + "/repos/" + username + "/" + repo + "/commits";
        let req = httpGet(url, true);
        let first_commit_hash = "";
        if (req.getResponseHeader("Link")) {
            let page_url = req
                .getResponseHeader("Link")
                .split(",")[1]
                .split(";")[0]
                .split("<")[1]
                .split(">")[0];
            let req_last_commit = httpGet(page_url);
            let first_commit = JSON.parse(req_last_commit);
            first_commit_hash = first_commit[first_commit.length - 1]["sha"];
        } else {
            let first_commit = JSON.parse(req.responseText);
            first_commit_hash = first_commit[first_commit.length - 1]["sha"];
        }
        return first_commit_hash;
    }
}

function scrape() {
    let username = document.getElementById("username").value;
    let getInfo = document.getElementById("getInfo").checked;

    document.getElementById("get").style.display = "none";
    document.getElementById("loading").style.display = "block";

    fetch(
            `https://planter-server.herokuapp.com/fetch?username=${username}&getInfo=${getInfo}`
        )
        .then((response) => response.json())
        .then((data) => {
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
        });
}

// Mobile NavBAr trigger
$(document).ready(function() {
    $(".sidenav").sidenav();
    $(".modal").modal();
});
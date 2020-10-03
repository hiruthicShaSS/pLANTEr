document.getElementById("get").addEventListener("click", get);

const base_url = 'https://api.github.com';

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
        document.getElementById("get").style.display = "none";
        document.getElementById("loading").style.display = "block";

        fetch(`https://api.github.com/users/${username}/repos`).then(response => {
            return response.json();
        }).then(data => {
            console.log(data);
            data.forEach(repo => {
                repo = repo.name;
                let first_commit = get_first_commit(repo);
                let compare_url = base_url + '/repos/' + username + '/' + repo + '/compare/' + first_commit + '...' + "master";
                let commit_req = httpGet(compare_url);
                let commit_count = JSON.parse(commit_req)['total_commits'] + 1;
                console.log('Commit Count: ', commit_count);
            })
            document.getElementById("loading").style.display = "none";
        });
    } else {
        document.getElementById("required-username").innerText = "Required";
        document.getElementById("required-username").style.color = "red";
        setTimeout(() => {
            document.getElementById("required-username").innerText = "";
        }, 2000)
    }

    function httpGet(theUrl, return_headers) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", theUrl, false); // false for synchronous request
        xmlHttp.send(null);
        if (return_headers) {
            return xmlHttp
        }
        return xmlHttp.responseText;
    }

    function get_first_commit(repo) {
        let url = base_url + '/repos/' + username + '/' + repo + '/commits';
        let req = httpGet(url, true);
        let first_commit_hash = '';
        if (req.getResponseHeader('Link')) {
            let page_url = req.getResponseHeader('Link').split(',')[1].split(';')[0].split('<')[1].split('>')[0];
            let req_last_commit = httpGet(page_url);
            let first_commit = JSON.parse(req_last_commit);
            first_commit_hash = first_commit[first_commit.length - 1]['sha']
        } else {
            let first_commit = JSON.parse(req.responseText);
            first_commit_hash = first_commit[first_commit.length - 1]['sha'];
        }
        return first_commit_hash;
    }
}

// Mobile NavBAr trigger
$(document).ready(function() {
    $('.sidenav').sidenav();
    $('.modal').modal();
});
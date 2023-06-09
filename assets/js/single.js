var issuesContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

var getRepoName = function() {
    // assign variable for query string
    var queryString = document.location.search;
    // pull repo name from query string by splitting it at "=" and selecting second new string (index 1)
    var repoName = queryString.split("=")[1];

    if (repoName) {
        // display repo name on page
        repoNameEl.textContent = repoName;

        getRepoIssues(repoName);
    } else {
        // if no repo provided, redirect to homepage
        document.location.replace("./index.html");
    }
};

var getRepoIssues = function(repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    fetch(apiUrl)
        .then(function(response) {
            // request was successful
            if (response.ok) {
                response.json().then(function(data) {
                    // pass response data to dom function
                    displayIssues(data);

                    // check if api has paginated issues
                    if (response.headers.get("Link")) {
                        displayWarning(repo);
                    }
                });
            } else {
                // if unsuccessful, redirect to homepage
                document.location.replace("./index.html");
            }
        });
};

var displayIssues = function(issues) {
    // check that there are open issues
    if (issues.length === 0) {
        issuesContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    for (var i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        // create span to hold issue title 
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append to container
        issueEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement("span");

        // check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issues)";
        }

        // append to container 
        issueEl.appendChild(typeEl);

        issuesContainerEl.appendChild(issueEl);
    }
};

var displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    // add link to warning
    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    // append to warning container
    limitWarningEl.appendChild(linkEl);
};

getRepoName();
const listElement = document.querySelector(".posts");
const postTemplate = document.getElementById("single-post");
const form = document.querySelector("#new-post form");
const fetchButton = document.querySelector("#available-posts button");

function sendHttpRequest(method, url, data) {
    const promise = new Promise((resolve, reject) => {
        // Create a new XMLHttpRequest object that helps to interact with servers
        const xhr = new XMLHttpRequest();

        // Configure it: GET-request for the URL /article/.../load
        xhr.open(method, url);

        xhr.responseType = "json"; // Set the response type to JSON

        // Call a function when the state changes.
        xhr.onload = function () {
            if (xhr.status != 200) {
                // Analyze HTTP response status
                console.error(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
            } else {
                resolve(xhr.response); // Show the result
            }
        };
        xhr.send(JSON.stringify(data)); // Send the request over the network
    });
    return promise;
}

async function fetchPosts() {
    const responseData = await sendHttpRequest(
        "GET",
        "https://jsonplaceholder.typicode.com/posts"
    );
    const listOfPosts = responseData;
    for (const post of listOfPosts) {
        const postEl = document.importNode(postTemplate.content, true);
        postEl.querySelector("h2").textContent = post.title.toUpperCase();
        postEl.querySelector("p").textContent = post.body;
        listElement.appendChild(postEl);
    }
}

async function createPost(title, content) {
    const postId = Math.random();
    const post = {
        title: title,
        body: content,
        userId: postId,
    };
    sendHttpRequest("POST", "https://jsonplaceholder.typicode.com/posts", post);
}

fetchButton.addEventListener("click", fetchPosts);
form.addEventListener('submit', event => {
    event.preventDefault();
    const entredTitle = event.currentTarget.querySelector('#title').value;
    const enteredContent = event.currentTarget.querySelector('#content').value;
    createPost(entredTitle, enteredContent)
})

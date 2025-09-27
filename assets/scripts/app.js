const listElement = document.querySelector(".posts");
const postTemplate = document.getElementById("single-post");
const form = document.querySelector("#new-post form");
const fetchButton = document.querySelector("#available-posts button");
const postList = document.querySelector("ul");

function sendHttpRequest(method, url, data) {
    const promise = new Promise((resolve, reject) => {
        // Create a new XMLHttpRequest object that helps to interact with servers
        const xhr = new XMLHttpRequest();

        // Configure it: GET-request for the URL /article/.../load
        xhr.open(method, url);

        xhr.responseType = "json"; // Set the response type to JSON

        // Call a function when the state changes.
        xhr.onload = function () {
            // Analyze HTTP response status
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response); // Show the result
            } else {
                console.error(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
                reject(new Error('Something went wrong!'));
            }
        };

        xhr.onerror = function () {
            reject(new Error('Failed to send request'));
        };

        xhr.send(JSON.stringify(data)); // Send the request over the network
    });
    return promise;
}

async function fetchPosts() {
    try {
        const responseData = await sendHttpRequest(
            "GET",
            "https://jsonplaceholder.typicode.com/posts"
        );
        const listOfPosts = responseData;
        for (const post of listOfPosts) {
            const postEl = document.importNode(postTemplate.content, true);
            postEl.querySelector("h2").textContent = post.title.toUpperCase();
            postEl.querySelector("p").textContent = post.body;
            postEl.querySelector("li").id = post.id;
            listElement.appendChild(postEl);
        }
    } catch (error) {
        alert(error.message);
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
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const entredTitle = event.currentTarget.querySelector("#title").value;
    const enteredContent = event.currentTarget.querySelector("#content").value;
    createPost(entredTitle, enteredContent);
});

postList.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
        const postId = event.target.closest("li").id;
        sendHttpRequest(
            "DELETE",
            `https://jsonplaceholder.typicode.com/posts/${postId}`
        );
    }
});

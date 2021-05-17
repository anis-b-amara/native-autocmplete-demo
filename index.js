var fullUsersList = [];
var fullPostsList = [];
var userSelect = "";
var searchInput = document.getElementById("search-input");
var searchList = document.getElementById("search-list");
var filteredList = [];

/**
 * Load users and posts from the server
 */

var xhrUsers = new XMLHttpRequest();
var xhrPosts = new XMLHttpRequest();

xhrUsers.open("GET", "https://jsonplaceholder.typicode.com/users/");
xhrUsers.send();

xhrUsers.onload = function () {
  fullUsersList = JSON.parse(xhrUsers.response);
};

xhrUsers.onprogress = function () {
  console.log("loading");
};

xhrUsers.onerror = function () {
  console.log("error");
};

xhrPosts.open("GET", "https://jsonplaceholder.typicode.com/posts/");
xhrPosts.send();

xhrPosts.onload = function () {
  fullPostsList = JSON.parse(xhrPosts.response);
};

xhrPosts.onprogress = function () {
  console.log("loading posts");
};

xhrPosts.onerror = function () {
  console.log("error");
};

/**
 * Get user choice preference
 * @param {string} e User input
 * @return {void}
 */

function selectChoice(e) {
  userSelect = e.target.value;
  var searchLabel = document.getElementById("search-label");
  if (userSelect) {
    searchLabel.innerText = "Search for " + userSelect;
    searchInput.removeAttribute("disabled");
    return;
  }
  searchInput.setAttribute("disabled", "");
  searchLabel.innerText = "Search";
  searchInput.value = "";
}

/**
 * Autcomplete search
 * @param {Event} e
 * @returns {void}
 */

function autocompleteSearch(e) {
  var searchText = e.target.value;
  var regex = new RegExp(searchText, "gi");
  if (searchText.length === 0) {
    filteredList = [];

    showList(filteredList);
    return;
  }
  if (userSelect === "users") {
    filteredList = fullUsersList.filter(function (user) {
      return user.name.match(regex);
    });
  }
  if (userSelect === "posts") {
    filteredList = fullPostsList.filter(function (post) {
      return post.title.match(regex);
    });
  }

  showList(filteredList);
}

/**
 * Display dropdwown of seach result
 * @param {Array} filteredList
 * @returns {void}
 */
function showList(filteredList) {
  searchList.innerHTML = "";
  searchList.setAttribute("class", "search-list");
  if (filteredList.length) {
    searchList.setAttribute("class", "search-list search-list_display");
    return filteredList
      .map(function (item) {
        var itemDiv = document.createElement("div");
        var itemContent;
        if (userSelect === "users") {
          itemContent = document.createTextNode(item.name);
        }
        if (userSelect === "posts") {
          itemContent = document.createTextNode(item.title);
        }
        itemDiv.appendChild(itemContent);
        itemDiv.setAttribute("class", "search-item");
        itemDiv.addEventListener("click", function () {
          searchInput.value = itemDiv.textContent;
          searchList.setAttribute("class", "search-list");
        });
        return itemDiv;
      })
      .reduce(function (acc, item) {
        acc.appendChild(item);
        return acc;
      }, searchList);
  }
}

/**
 * Listen to user search typing
 */

searchInput.addEventListener("input", autocompleteSearch);

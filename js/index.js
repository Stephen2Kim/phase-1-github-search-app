document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("github-form");
    const searchInput = document.getElementById("search");
    const userList = document.getElementById("user-list");
    const reposList = document.getElementById("repos-list");
    
    // Initially display users
    let isUserSearch = true;
  
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = searchInput.value.trim();
  
      if (query) {
        if (isUserSearch) {
          searchUsers(query);
        } else {
          searchRepos(query);
        }
      }
    });
  
    function searchUsers(query) {
      fetch(`https://api.github.com/search/users?q=${query}`, {
        headers: {
          Accept: "application/vnd.github.v3+json"
        }
      })
      .then(response => response.json())
      .then(data => {
        userList.innerHTML = ""; // Clear previous results
        data.items.forEach(user => {
          const userItem = document.createElement("li");
          userItem.innerHTML = `
            <img src="${user.avatar_url}" alt="${user.login}" width="50" height="50">
            <a href="${user.html_url}" target="_blank">${user.login}</a>
          `;
          userItem.addEventListener("click", () => {
            searchUserRepos(user.login);
          });
          userList.appendChild(userItem);
        });
      })
      .catch(error => console.error('Error fetching users:', error));
    }
  
    function searchRepos(query) {
      fetch(`https://api.github.com/search/repositories?q=${query}`, {
        headers: {
          Accept: "application/vnd.github.v3+json"
        }
      })
      .then(response => response.json())
      .then(data => {
        userList.innerHTML = ""; // Clear previous results
        reposList.innerHTML = ""; // Clear previous repo details
        data.items.forEach(repo => {
          const repoItem = document.createElement("li");
          repoItem.innerHTML = `
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            <p>${repo.description || 'No description'}</p>
          `;
          reposList.appendChild(repoItem);
        });
      })
      .catch(error => console.error('Error fetching repositories:', error));
    }
  
    function searchUserRepos(user) {
      fetch(`https://api.github.com/users/${user}/repos`, {
        headers: {
          Accept: "application/vnd.github.v3+json"
        }
      })
      .then(response => response.json())
      .then(repos => {
        reposList.innerHTML = ""; // Clear previous repo details
        repos.forEach(repo => {
          const repoItem = document.createElement("li");
          repoItem.innerHTML = `
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            <p>${repo.description || 'No description'}</p>
          `;
          reposList.appendChild(repoItem);
        });
      })
      .catch(error => console.error('Error fetching user repositories:', error));
    }
  
    // Toggle search mode
    document.getElementById('toggle-search').addEventListener('click', () => {
      isUserSearch = !isUserSearch;
      document.getElementById('toggle-search').textContent = isUserSearch ? 'Search Repositories' : 'Search Users';
      searchInput.placeholder = isUserSearch ? 'Search GitHub Users...' : 'Search GitHub Repositories...';
      userList.innerHTML = ""; // Clear user list when switching
      reposList.innerHTML = ""; // Clear repos list when switching
    });
  });
  
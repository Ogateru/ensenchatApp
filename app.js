// js/app.js

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    // デバイスが準備完了したら呼ばれる
    changeTab('tab-chat'); // デフォルトで「ちゃっと」タブを表示
}

function changeTab(tabId) {
    // タブの切り替え処理
    document.querySelectorAll('.tab-content').forEach(function (tabContent) {
        tabContent.style.display = 'none';
    });

    if (tabId === 'tab-posts') {
        // 「記事」タブの場合、WordPressから記事データを取得
        fetchWordPressPosts();
    }

    document.getElementById(tabId).style.display = 'block';
}

function fetchWordPressPosts() {
    // WordPress REST APIエンドポイント（例: https://example.com/wp-json/wp/v2/posts）
    var apiUrl = 'https://ensenchat.com/wp-json/wp/v2/posts';

    fetch(apiUrl)
        .then(response => response.json())
        .then(posts => {
            // 取得した記事データを処理する（例: 時系列順に表示）
            displayWordPressPosts(posts);
        })
        .catch(error => {
            console.error('Error fetching WordPress posts:', error);
        });
}

function displayWordPressPosts(posts) {
    // 記事データを表示する処理を追加
    var postsContainer = document.getElementById('tab-posts');
    postsContainer.innerHTML = ''; // 既存のコンテンツをクリア

    posts.forEach(post => {
        var postElement = document.createElement('div');
        postElement.innerHTML = '<h2>' + post.title.rendered + '</h2>';
        postElement.innerHTML += '<p>' + post.content.rendered + '</p>';
        // 他の記事情報を表示する要素も追加可能

        postsContainer.appendChild(postElement);
    });
}

function fetchWordPressPosts() {
    // WordPress REST APIエンドポイント
    var apiUrl = 'https://ensenchat.com/wp-json/wp/v2/posts';

    fetch(apiUrl)
        .then(response => response.json())
        .then(posts => {
            // 取得した記事データを処理する
            displayWordPressPosts(posts);
        })
        .catch(error => {
            console.error('Error fetching WordPress posts:', error);
        });
}

function displayWordPressPosts(posts) {
    // 記事データを表示する処理を追加
    var postsContainer = document.getElementById('tab-posts');
    postsContainer.innerHTML = ''; // 既存のコンテンツをクリア

    posts.forEach(post => {
        var postElement = document.createElement('div');
        postElement.innerHTML = '<h2>' + post.title.rendered + '</h2>';
        postElement.innerHTML += '<p>' + post.content.rendered + '</p>';
        // 他の記事情報を表示する要素も追加可能

        postsContainer.appendChild(postElement);
    });
}

function loginToWordPress(username, password) {
    // WordPressにログインする処理を追加
    var loginUrl = 'https://ensenchat.com/wp-json/jwt-auth/v1/token';

    var credentials = {
        username: username,
        password: password
    };

    fetch(loginUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    })
    .then(response => response.json())
    .then(data => {
        // ログイン成功時の処理
        console.log('Login successful:', data);

        // ログインに成功したらコメントを投稿などの処理を実行することができます
        // 例: postComment(data.token, 'Hello, this is a comment!');
    })
    .catch(error => {
        console.error('Error logging in:', error);
    });
}

function postComment(token, comment) {
    // コメントをWordPressに投稿する処理を追加
    var commentUrl = 'https://ensenchat.com/wp-json/wp/v2/comments';

    var newComment = {
        content: comment,
        post: 1, // 投稿のIDに合わせて変更
    };

    fetch(commentUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(newComment),
    })
    .then(response => response.json())
    .then(data => {
        // コメント投稿成功時の処理
        console.log('Comment posted successfully:', data);
    })
    .catch(error => {
        console.error('Error posting comment:', error);
    });
}


function displayWordPressPosts(posts) {
    // 記事データを表示する処理を追加
    var postsContainer = document.getElementById('tab-posts');
    postsContainer.innerHTML = ''; // 既存のコンテンツをクリア

    posts.forEach(post => {
        var postContainer = document.createElement('div');
        postContainer.className = 'post-container';

        // タイトルとアイキャッチ画像の表示
        postContainer.innerHTML = '<h2 onclick="showPostContent(' + post.id + ')">' + post.title.rendered + '</h2>';
        if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0].source_url) {
            postContainer.innerHTML += '<img src="' + post._embedded['wp:featuredmedia'][0].source_url + '" alt="アイキャッチ画像">';
        }
        
        postsContainer.appendChild(postContainer);
    });
}

function showPostContent(postId) {
    // クリックされた記事の詳細を表示する処理
    var postUrl = 'https://ensenchat.com/wp-json/wp/v2/posts/' + postId;

    fetch(postUrl)
        .then(response => response.json())
        .then(post => {
            // 詳細を表示する処理を実装
            var postContent = document.getElementById('tab-posts');
            postContent.innerHTML = '<h2>' + post.title.rendered + '</h2>';
            if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0].source_url) {
                postContent.innerHTML += '<img src="' + post._embedded['wp:featuredmedia'][0].source_url + '" alt="アイキャッチ画像">';
            }
            postContent.innerHTML += '<div>' + post.content.rendered + '</div>';
        })
        .catch(error => {
            console.error('Error fetching post details:', error);
        });
}

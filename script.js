let musicList = []; // 保存搜索到的音乐列表
let currentSongIndex = 0;

// 初始化 APlayer
const ap = new APlayer({
    narrow: false,
    loop: 'all', // 全部循环
    order: 'random', // 随机循环
    volume: 0.2, // 播放音量
    autoplay: false, // 是否自动播放
    showlrc: false, // 是否开启歌词功能，默认 false（为 true 时 musics 集合中需要传入 lrc 字段。）
    fixed: 0, // 是否固定在左下角不动，1即为 true
    theme: '#F5F5F5',
    music: [],
});

// 搜索音乐
async function searchMusic() {
    const query = document.getElementById('searchBar').value.trim();
    const apiSource = document.getElementById('apiSelect').value; // 获取接口选择器的值

    if (!query) {
        alert('Please enter a search term.');
        return;
    }

    try {
        // 使用环境变量来动态设置后端的 URL
        const backendUrl = "https://mewww-avyg.vercel.app" || 'http://127.0.0.1:5000'; // 本地开发时使用 localhost 地址，线上使用 Vercel 设置的环境变量

        // 根据接口选择动态设置请求地址
        let apiUrl;
        if (apiSource === 'api1') {
            apiUrl = `${backendUrl}/api1/search?query=${encodeURIComponent(query)}`;
        } else if (apiSource === 'api2') {
            apiUrl = `${backendUrl}/api2/search?query=${encodeURIComponent(query)}`;
        } else {
            throw new Error('Invalid API source selected.');
        }

        // 发起请求
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 解析JSON
        musicList = await response.json();
        // console.log("Music list:", musicList); // 打印返回的音乐列表数据

        // 渲染搜索结果
        renderMusicList(musicList);

        // 添加音乐到播放器并播放
        updatePlayerPlaylist();
    } catch (error) {
        console.error('Error fetching music:', error);
        alert('Failed to fetch music data. Please try again later.');
    }
}


// 更新 APlayer 播放列表并自动播放
function updatePlayerPlaylist() {
    if (!musicList || musicList.length === 0) {
        alert('No music found to add to the player.');
        return;
    }

    // 清空 APlayer 的播放列表
    ap.list.clear();

    // 将所有音乐添加到 APlayer 的播放列表
    const playlist = musicList.map((song) => ({
        title: song.SongName, // 歌曲名称
        author: song.SingerName, // 歌手
        url: song.play_url, // 音乐链接
        pic: song.img || 'default_album_art.jpg', // 封面图
    }));
    ap.list.add(playlist);

    // 自动播放第一首歌曲
    currentSongIndex = 0;
    ap.list.switch(currentSongIndex);
    // ap.play();
}

// 渲染音乐列表
function renderMusicList(musicList) {
    const musicListDiv = document.getElementById('musicList');
    musicListDiv.innerHTML = ''; // 清空旧内容

    if (!musicList || musicList.length === 0) {
        musicListDiv.innerHTML = '<p>No music found.</p>';
        return;
    }

    // 动态生成音乐列表
    musicList.forEach((music, index) => {
        const musicItem = document.createElement('div');
        musicItem.className = 'music-item';
        musicItem.innerHTML = `
            <p>${index + 1}. ${music.SongName} - ${music.SingerName}</p>
        `;
        musicListDiv.appendChild(musicItem);
    });
    // 隐藏音乐列表，用户不可见
    musicListDiv.style.display = 'none';
}
// 点击搜索按钮时，给按钮加上动画效果
$("button").click(function() {
    $(this).addClass('animate__animated animate__pulse');
    setTimeout(function() {
        $("button").removeClass('animate__pulse');
    }, 1000);
});

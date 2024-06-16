const statusDiv = document.getElementById('status');
statusDiv.style.padding = '20px';
statusDiv.style.fontSize = '16px';
statusDiv.style.backgroundColor = '#f9f9f9';
statusDiv.style.borderTop = '2px solid #ddd';
statusDiv.style.marginTop = '20px';
statusDiv.style.borderRadius = '10px';
statusDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
statusDiv.style.width = '70%';
statusDiv.style.margin = '20px auto';

document.getElementById('ip').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('check').click();
    }
});

document.getElementById('check').addEventListener('click', () => {
    const ip = document.getElementById('ip').value;
    fetch(`https://api.mcsrvstat.us/2/${ip}`)
        .then(response => response.json())
        .then(data => {
            const statusDiv = document.getElementById('status');
            if (data.online) {
                let playerList = 'プレイヤー: なし';
                if (data.players.list && data.players.list.length > 0) {
                    playerList = '<ul>';
                    data.players.list.forEach(player => {
                        if (!player.includes('.') && !player.startsWith('BE_')) {
                            playerList += `<li><a href="https://ja.namemc.com/profile/${player}" target="_blank">${player}</a></li>`;
                        }
                    });
                    playerList += '</ul>';
                }
                statusDiv.innerHTML = `
            <p class="online"><font color="green">サーバーはオンラインです。</font></p>
            <p>IPアドレス: ${data.hostname}（${data.ip}）</p>
            <p>プレイヤー数: ${data.players.online}/${data.players.max}</p>
            <p>バージョン: ${data.version}</p>
            <p class="motd">Motd: <code>${data.motd.raw.join('<br>')}</code></p>
            <div class="player-list">${playerList}</div>`;
                statusDiv.classList.remove('offline');
            } else {
                statusDiv.innerHTML = '<p class="offline"><font color="red">サーバーの情報を取得できませんでした。<br>恐らく：オフライン、Proxy</p>';
                statusDiv.classList.add('offline');
            }
        })
        .catch(error => {
            console.error('Error fetching server status:', error);
            document.getElementById('status').innerHTML = '<p class="offline">サーバーのステータスを取得中にエラーが発生しました。</p>';
            statusDiv.classList.add('offline');
        });
});
document.addEventListener("DOMContentLoaded", () => {
    const serverList = document.getElementById("server-list");

    // 🔹 ここに連携サーバー情報を追加
    const servers = [
        {
            name: "茜-あかね-公式サーバー",
            description: "茜-あかね-の公式サポートサーバーです。",
            invite: "https://discord.gg/a32WABB8Qv",
        },
        {
            name: "Fortify support",
            description: "Fortify Shield botの公式サポートサーバーです。",
            invite: "https://discord.gg/CVRsP4sDTV",
        },
        {
            name: "SharkBot Support",
            description: "SharkBotの公式サポートサーバーです。",
            invite: "https://discord.gg/mUyByHYMGk",
        },
        {
            name: "神日京国",
            description: "史上最大規模のテーマパークサーバー！",
            invite: "https://discord.gg/jP7hg3eycC",
        },
        {
            name: "ゲーム/防災情報コミュニティサーバー",
            description: "みんな集まれ！マイクラ＆ロブロックスの最高の遊び場へ！",
            invite: "https://discord.gg/8xVZaW96DH",
        },
    　　 {
            name: "GendaiMC",
            description: "カスタムされたサーバーで、最高の仲間と、未知の冒険へ。",
            invite: "https://discord.gg/fNv4MYBerz",
        }
    ];

    // 🔹 サーバーリストを生成
    servers.forEach(server => {
        const serverCard = document.createElement("div");
        serverCard.className = "server-card";
        serverCard.innerHTML = `
            <h3>${server.name}</h3>
            <p>${server.description}</p>
            <button onclick="joinServer('${server.invite}')">参加する</button>
        `;
        serverList.appendChild(serverCard);
    });
});

// 🔹 参加ボタン処理
function joinServer(inviteUrl) {
    window.open(inviteUrl, "_blank");
}
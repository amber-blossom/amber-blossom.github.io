document.addEventListener("DOMContentLoaded", () => {
    const serverList = document.getElementById("server-list");

    // 🔹 連携サーバー情報
    const servers = [
        {
            name: "茜-あかね-公式サーバー",
            description: "茜-あかね-の公式サポートサーバーです。",
            invite: "https://discord.gg/a32WABB8Qv",
            badge: "公式",
            color: "#ff6b9d",
            tags: ["公式", "サポート", "Bot"],
        },
        {
            name: "Fortify support",
            description: "Fortify Shield botの公式サポートサーバーです。",
            invite: "https://discord.gg/CVRsP4sDTV",
            badge: "公式",
            color: "#4e9af1",
            tags: ["公式", "サポート", "Bot", "セキュリティ"],
        },
        {
            name: "SharkBot Support",
            description: "SharkBotの公式サポートサーバーです。",
            invite: "https://discord.gg/mUyByHYMGk",
            badge: "公式",
            color: "#00c9a7",
            tags: ["公式", "サポート", "Bot"],
        },
        {
            name: "神日京国",
            description: "史上最大規模のテーマパークサーバー！",
            invite: "https://discord.gg/jP7hg3eycC",
            badge: "コミュニティ",
            color: "#f7b731",
            tags: ["コミュニティ", "ロールプレイ", "イベント"],
        },
        {
            name: "ゲーム/防災情報コミュニティサーバー",
            description: "みんな集まれ！マイクラ＆ロブロックスの最高の遊び場へ！",
            invite: "https://discord.gg/8xVZaW96DH",
            badge: "コミュニティ",
            color: "#a29bfe",
            tags: ["コミュニティ", "ゲーム", "Minecraft", "Roblox", "防災"],
        },
        {
            name: "GendaiMC",
            description: "カスタムされたサーバーで、最高の仲間と、未知の冒険へ。",
            invite: "https://discord.gg/fNv4MYBerz",
            badge: "ゲーム",
            color: "#fd79a8",
            tags: ["ゲーム", "Minecraft", "コミュニティ"],
        },
    ];

    // 🔹 全タグを収集（重複なし）
    const allTags = [...new Set(servers.flatMap(s => s.tags))];

    // 🔹 スタイル注入
    const style = document.createElement("style");
    style.textContent = `
        /* ===== 検索UI ===== */
        .search-area {
            margin-bottom: 28px;
        }
        .search-bar-wrap {
            position: relative;
            margin-bottom: 14px;
        }
        .search-bar-wrap .search-icon {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(255,255,255,0.35);
            pointer-events: none;
        }
        #server-search {
            width: 100%;
            box-sizing: border-box;
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 12px 16px 12px 42px;
            font-size: 0.95rem;
            color: #fff;
            outline: none;
            transition: border-color 0.2s, background 0.2s;
        }
        #server-search::placeholder { color: rgba(255,255,255,0.3); }
        #server-search:focus {
            border-color: rgba(255,255,255,0.3);
            background: rgba(255,255,255,0.09);
        }
        .tag-filter-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .tag-btn {
            font-size: 0.78rem;
            font-weight: 600;
            padding: 5px 13px;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.15);
            background: transparent;
            color: rgba(255,255,255,0.5);
            cursor: pointer;
            transition: all 0.18s;
            letter-spacing: 0.03em;
        }
        .tag-btn:hover {
            background: rgba(255,255,255,0.08);
            color: rgba(255,255,255,0.85);
        }
        .tag-btn.active {
            background: #fff;
            color: #111;
            border-color: #fff;
        }
        .no-results {
            color: rgba(255,255,255,0.35);
            font-size: 0.9rem;
            padding: 32px 0;
            text-align: center;
            width: 100%;
        }

        /* ===== モーダル ===== */
        .modal-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(10, 10, 20, 0.75);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            z-index: 1000;
            align-items: center;
            justify-content: center;
            padding: 16px;
        }
        .modal-overlay.active { display: flex; }
        .modal-content {
            background: #1a1a2e;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 20px;
            padding: 36px 32px 32px;
            max-width: 460px;
            width: 100%;
            position: relative;
            box-shadow: 0 24px 60px rgba(0,0,0,0.5);
            animation: slideUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes slideUp {
            from { transform: translateY(30px) scale(0.96); opacity: 0; }
            to   { transform: translateY(0) scale(1); opacity: 1; }
        }
        .modal-close {
            position: absolute;
            top: 14px; right: 18px;
            background: rgba(255,255,255,0.08);
            border: none;
            color: #aaa;
            font-size: 22px;
            width: 34px; height: 34px;
            border-radius: 50%;
            cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            transition: background 0.2s, color 0.2s;
        }
        .modal-close:hover { background: rgba(255,255,255,0.18); color: #fff; }
        .modal-badge {
            display: inline-block;
            font-size: 11px; font-weight: 700;
            letter-spacing: 0.08em;
            padding: 3px 10px;
            border-radius: 20px;
            margin-bottom: 12px;
            background: var(--badge-color, #555);
            color: #fff;
        }
        .modal-title {
            font-size: 1.4rem; font-weight: 800;
            color: #fff;
            margin: 0 0 10px;
            line-height: 1.3;
        }
        .modal-description {
            font-size: 0.93rem;
            color: rgba(255,255,255,0.65);
            line-height: 1.7;
            margin: 0 0 18px;
        }
        .modal-tags {
            display: flex; flex-wrap: wrap; gap: 6px;
            margin-bottom: 24px;
        }
        .modal-tag {
            font-size: 0.75rem; font-weight: 600;
            padding: 3px 10px;
            border-radius: 20px;
            background: rgba(255,255,255,0.08);
            color: rgba(255,255,255,0.55);
            letter-spacing: 0.03em;
        }
        .modal-invite-btn {
            display: inline-flex;
            align-items: center; justify-content: center;
            width: 100%;
            padding: 13px 0;
            border-radius: 12px;
            font-size: 0.95rem; font-weight: 700;
            color: #fff;
            text-decoration: none;
            background: var(--btn-color, #5865f2);
            transition: filter 0.2s, transform 0.15s;
        }
        .modal-invite-btn:hover {
            filter: brightness(1.15);
            transform: translateY(-1px);
        }

        /* ===== カード ===== */
        .server-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 18px;
        }
        .server-card {
            background: #16213e;
            border: 1px solid rgba(255,255,255,0.07);
            border-radius: 16px;
            padding: 22px 20px 18px;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
            position: relative;
            overflow: hidden;
            user-select: none;
        }
        .server-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 3px;
            background: var(--card-accent, #5865f2);
            border-radius: 16px 16px 0 0;
        }
        .server-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 32px rgba(0,0,0,0.35);
            border-color: rgba(255,255,255,0.15);
        }
        .server-card:active { transform: translateY(-1px); }
        .server-card-badge {
            display: inline-block;
            font-size: 10px; font-weight: 700;
            letter-spacing: 0.07em;
            padding: 2px 9px;
            border-radius: 20px;
            margin-bottom: 10px;
            background: var(--card-accent, #5865f2);
            color: #fff;
            opacity: 0.9;
        }
        .server-card h3 {
            font-size: 1rem; font-weight: 700;
            color: #fff;
            margin: 0 0 7px;
        }
        .server-card p {
            font-size: 0.84rem;
            color: rgba(255,255,255,0.5);
            margin: 0 0 12px;
            line-height: 1.5;
        }
        .server-card-tags {
            display: flex; flex-wrap: wrap; gap: 5px;
            margin-bottom: 12px;
        }
        .server-card-tag {
            font-size: 0.72rem; font-weight: 600;
            padding: 2px 8px;
            border-radius: 20px;
            background: rgba(255,255,255,0.07);
            color: rgba(255,255,255,0.4);
        }
        .server-card-tap-hint {
            display: flex; align-items: center; gap: 5px;
            font-size: 0.73rem;
            color: rgba(255,255,255,0.25);
        }
    `;
    document.head.appendChild(style);

    // 🔹 検索UIをmainの先頭（h1の直後）に挿入
    const main = document.querySelector("main");
    const searchArea = document.createElement("div");
    searchArea.className = "search-area";
    searchArea.innerHTML = `
        <div class="search-bar-wrap">
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="server-search" placeholder="サーバー名・説明・タグで検索…" autocomplete="off">
        </div>
        <div class="tag-filter-list" id="tag-filter-list"></div>
    `;
    main.insertBefore(searchArea, serverList);

    // 🔹 タグボタン生成
    const tagFilterList = document.getElementById("tag-filter-list");
    let activeTag = null;

    allTags.forEach(tag => {
        const btn = document.createElement("button");
        btn.className = "tag-btn";
        btn.textContent = `# ${tag}`;
        btn.dataset.tag = tag;
        btn.addEventListener("click", () => {
            if (activeTag === tag) {
                activeTag = null;
                btn.classList.remove("active");
            } else {
                document.querySelectorAll(".tag-btn").forEach(b => b.classList.remove("active"));
                activeTag = tag;
                btn.classList.add("active");
            }
            renderCards();
        });
        tagFilterList.appendChild(btn);
    });

    // 🔹 モーダル生成
    const modal = document.createElement("div");
    modal.id = "server-modal";
    modal.className = "modal-overlay";
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" id="modal-close-btn" aria-label="閉じる">&times;</button>
            <div class="modal-badge" id="modal-badge"></div>
            <h2 class="modal-title" id="modal-title"></h2>
            <p class="modal-description" id="modal-description"></p>
            <div class="modal-tags" id="modal-tags"></div>
            <a class="modal-invite-btn" id="modal-invite-btn" href="#" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style="vertical-align:middle;margin-right:6px"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.055a19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
                Discordで参加する
            </a>
        </div>
    `;
    document.body.appendChild(modal);

    // 🔹 カード描画
    function renderCards() {
        const query = document.getElementById("server-search").value.trim().toLowerCase();
        serverList.innerHTML = "";

        const filtered = servers.filter(s => {
            const matchTag  = !activeTag || s.tags.includes(activeTag);
            const matchText = !query
                || s.name.toLowerCase().includes(query)
                || s.description.toLowerCase().includes(query)
                || s.tags.some(t => t.toLowerCase().includes(query));
            return matchTag && matchText;
        });

        if (filtered.length === 0) {
            serverList.innerHTML = `<p class="no-results">該当するサーバーが見つかりませんでした。</p>`;
            return;
        }

        filtered.forEach(server => {
            const card = document.createElement("div");
            card.className = "server-card";
            card.style.setProperty("--card-accent", server.color);
            card.innerHTML = `
                <span class="server-card-badge">${server.badge}</span>
                <h3>${server.name}</h3>
                <p>${server.description}</p>
                <div class="server-card-tags">
                    ${server.tags.map(t => `<span class="server-card-tag"># ${t}</span>`).join("")}
                </div>
                <div class="server-card-tap-hint">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    タップして詳細を見る
                </div>
            `;
            card.addEventListener("click", () => openModal(server));
            serverList.appendChild(card);
        });
    }

    // 🔹 検索入力
    document.getElementById("server-search").addEventListener("input", renderCards);

    // 🔹 モーダルを開く
    function openModal(server) {
        document.getElementById("modal-badge").textContent = server.badge;
        document.getElementById("modal-badge").style.setProperty("--badge-color", server.color);
        document.getElementById("modal-title").textContent = server.name;
        document.getElementById("modal-description").textContent = server.description;
        document.getElementById("modal-tags").innerHTML =
            server.tags.map(t => `<span class="modal-tag"># ${t}</span>`).join("");
        const btn = document.getElementById("modal-invite-btn");
        btn.href = server.invite;
        btn.style.setProperty("--btn-color", server.color);
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    // 🔹 モーダルを閉じる
    function closeModal() {
        modal.classList.remove("active");
        document.body.style.overflow = "";
    }
    document.getElementById("modal-close-btn").addEventListener("click", closeModal);
    modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

    // 初期描画
    renderCards();
});
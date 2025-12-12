document.addEventListener("DOMContentLoaded", () => {
    // 要素取得（存在確認）
    const captchaTextEl = document.getElementById("captchaText");
    const captchaInputEl = document.getElementById("captchaInput");
    const form = document.getElementById("contactForm");
    const resultMessageEl = document.getElementById("resultMessage");
    const submitButton = form.querySelector('button[type="submit"]');

    if (!captchaTextEl || !captchaInputEl || !form || !resultMessageEl || !submitButton) {
        console.error("必要な要素が見つかりません。HTML 内の id を確認してください。");
        return;
    }

    let num1, num2, answer;
    let isFormDirty = false;

    function generateCaptcha() {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = num1 + num2;
        captchaTextEl.innerText = `認証： ${num1} + ${num2} = ?`;
        captchaInputEl.value = "";
    }

    // 初期出題
    generateCaptcha();

    // 入力検知（リロード確認用フラグ）
    form.querySelectorAll("input, textarea").forEach(el =>
        el.addEventListener("input", () => {
            isFormDirty = true;
        })
    );

    window.addEventListener("beforeunload", function (e) {
        if (isFormDirty) {
            e.preventDefault();
            e.returnValue = "";
        }
    });

    function showMessage(text, type = "success") {
        // type: "success" or "error"
        resultMessageEl.textContent = text;
        resultMessageEl.style.color = (type === "success") ? "#10b981" : "#ef4444";
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        // 値取得（trim）
        const name = (form.name && form.name.value) ? form.name.value.trim() : "";
        const email = (form.email && form.email.value) ? form.email.value.trim() : "";
        const subject = (form.subject && form.subject.value) ? form.subject.value.trim() : "";
        const message = (form.message && form.message.value) ? form.message.value.trim() : "";
        const captchaValue = Number(captchaInputEl.value);

        // シンプルなバリデーション
        if (!name || !email || !message) {
            showMessage("必須項目が未入力です。名前・メール・メッセージを入力してください。", "error");
            return;
        }

        if (Number.isNaN(captchaValue)) {
            showMessage("認証の答えを入力してください。", "error");
            captchaInputEl.focus();
            return;
        }

        // 認証チェック
        if (captchaValue !== answer) {
            showMessage("認証に失敗しました。新しい問題を出題しました。もう一度お試しください。", "error");

            // 新しい問題を出して、Captcha入力はクリア、フォーカス
            generateCaptcha();
            captchaInputEl.focus();
            return;
        }

        // ここで送信処理（Discord Webhook）
        const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1448933235261182104/pJDAPJC0a6u-ZZbWTGiYZBPrhNKEyzfYHmA2YaZpWGBbViFKrjy3Im8Imp_UzxX5uOQC";

        // Disable button to prevent double submit
        submitButton.disabled = true;
        submitButton.style.opacity = "0.6";

        try {
            const payload = {
                username: "お問い合わせフォーム",
                embeds: [
                    {
                        title: "📩 お問い合わせが届きました",
                        color: 5814783,
                        fields: [
                            { name: "名前", value: name || "（未入力）" },
                            { name: "メールアドレス", value: email || "（未入力）" },
                            { name: "件名", value: subject || "（なし）" },
                            { name: "内容", value: message || "（なし）" }
                        ],
                        timestamp: new Date().toISOString()
                    }
                ]
            };

            const res = await fetch(DISCORD_WEBHOOK, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                // HTTP レスポンスが OK でない場合
                showMessage("送信に失敗しました（サーバーエラー）。時間を置いて再度お試しください。", "error");
                console.error("Webhook response:", res.status, await res.text());
                // 失敗してもボタンは再度押せるように戻す
                submitButton.disabled = false;
                submitButton.style.opacity = "1";
                return;
            }

            // 成功
            showMessage("ご回答ありがとうございます。ページを移動します…", "success");
            isFormDirty = false;

            // 少し待ってから飛ばす
            setTimeout(() => {
                window.location.href = "https://amber-blossom.github.io/index";
            }, 1500);

            form.reset();
            generateCaptcha(); // 次回のために新しい問題も作る

        } catch (error) {
            console.error("送信時エラー:", error);
            showMessage("送信時にエラーが発生しました。ネットワークを確認して再度お試しください。", "error");
            submitButton.disabled = false;
            submitButton.style.opacity = "1";
        }
    });
});

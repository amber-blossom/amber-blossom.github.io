// ---- 認証の問題生成 ----
let num1 = Math.floor(Math.random() * 10) + 1;
let num2 = Math.floor(Math.random() * 10) + 1;
let answer = num1 + num2;

document.getElementById("captchaText").innerText = `認証： ${num1} + ${num2} = ?`;


// ---- フォーム送信 ----
document.getElementById("contactForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const subject = form.subject.value;
    const message = form.message.value;

    const captchaValue = Number(document.getElementById("captchaInput").value);

    // 認証チェック
    if (captchaValue !== answer) {
        alert("認証に失敗しました。もう一度お試しください。");
        return;
    }

    // ▼ Discord Webhook
    const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1448933235261182104/pJDAPJC0a6u-ZZbWTGiYZBPrhNKEyzfYHmA2YaZpWGBbViFKrjy3Im8Imp_UzxX5uOQC";

    try {
        await fetch(DISCORD_WEBHOOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: "お問い合わせフォーム", // ← Webhook名
                embeds: [
                    {
                        title: "📩 お問い合わせが届きました",
                        color: 5814783,
                        fields: [
                            { name: "名前", value: name },
                            { name: "メールアドレス", value: email },
                            { name: "件名", value: subject },
                            { name: "内容", value: message }
                        ],
                        timestamp: new Date().toISOString()
                    }
                ]
            })
        });

        // 成功メッセージ
        document.getElementById("resultMessage").innerText =
            "ご回答ありがとうございます。ページを移動します…";

        // 1.5秒後にトップへ
        setTimeout(() => {
            window.location.href = "https://amber-blossom.github.io/index";
        }, 1500);

        form.reset();

    } catch (error) {
        document.getElementById("resultMessage").innerText =
            "エラーが発生しました。もう一度お試しください。";
        console.error(error);
    }
});

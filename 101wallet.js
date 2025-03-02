async function connectWallet() {
    if (!window.ethereum) {
        alert("请安装 MetaMask 以连接钱包！");
        return;
    }

    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const walletAddress = accounts[0];
        document.getElementById("walletAddress").innerText = walletAddress;

        // 触发事件，供其他模块监听
        document.dispatchEvent(new CustomEvent("walletConnected", { detail: walletAddress }));
    } catch (error) {
        alert("连接钱包失败：" + error.message);
    }
}

document.getElementById("connectWalletBtn").addEventListener("click", connectWallet);

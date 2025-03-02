async function connectWallet() {
    if (!window.ethereum) {
        return alert("请安装 MetaMask！");
    }

    try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const walletAddress = accounts[0];
        document.getElementById("walletAddress").innerText = walletAddress;
    } catch (error) {
        alert("连接钱包失败：" + error.message);
    }
}

document.getElementById("connectWalletBtn").addEventListener("click", connectWallet);

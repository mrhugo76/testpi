async function fetchTokenBalances() {
    const walletAddress = document.getElementById("walletAddress").innerText;
    if (walletAddress === "未连接") return alert("请先连接钱包！");

    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,tether&vs_currencies=usd`);
    const prices = await response.json();

    const balances = [
        { name: "Ethereum", balance: 2.5, price: prices.ethereum.usd },
        { name: "Bitcoin", balance: 0.1, price: prices.bitcoin.usd },
        { name: "Tether", balance: 500, price: prices.tether.usd }
    ];

    const balanceContainer = document.getElementById("tokenBalances");
    balanceContainer.innerHTML = balances.map(token => 
        `<p>${token.name}: ${token.balance} (${(token.balance * token.price).toFixed(2)} USD)</p>`
    ).join("");
}

document.getElementById("walletAddress").addEventListener("DOMSubtreeModified", fetchTokenBalances);

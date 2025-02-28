  <script>
    // Token ABI for ERC20 tokens
    const TOKEN_ABI = [
      { "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "type": "function" },
      { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "type": "function" },
      { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "type": "function" },
      { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "type": "function" },
      { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "type": "function" }
    ];

    // App state
    let web3;
    let account = '';
    let balance = '0';
    let tokens = [];
    let gasPrice = '';
    let maxFeePerGas = '';
    let maxPriorityFeePerGas = '';
    let selectedToken = null;
    let isLoading = false;

    // DOM Elements
    const connectWalletBtn = document.getElementById('connect-wallet');
    const connectWalletMainBtn = document.getElementById('connect-wallet-main');
    const accountDisplay = document.getElementById('account-display');
    const notConnectedDiv = document.getElementById('not-connected');
    const connectedDiv = document.getElementById('connected');
    const balanceDisplay = document.getElementById('balance');
    const userAddressDisplay = document.getElementById('user-address');
    const qrCodeDisplay = document.getElementById('qrcode');
    const tokenAddressInput = document.getElementById('token-address');
    const addTokenBtn = document.getElementById('add-token');
    const tokenListDiv = document.getElementById('token-list');
    const noTokensMsg = document.getElementById('no-tokens');
    const transferModal = document.getElementById('transfer-modal');
    const modalTitle = document.getElementById('modal-title');
    const selectedTokenInfo = document.getElementById('selected-token-info');
    const selectedTokenName = document.getElementById('selected-token-name');
    const selectedTokenBalance = document.getElementById('selected-token-balance');
    const tokenDropdown = document.getElementById('token-dropdown');
    const recipientInput = document.getElementById('recipient');
    const amountInput = document.getElementById('amount');
    const toggleGasBtn = document.getElementById('toggle-gas');
    const gasOptionsDiv = document.getElementById('gas-options');
    const maxFeeInput = document.getElementById('max-fee');
    const maxPriorityFeeInput = document.getElementById('max-priority-fee');
    const marketFeeDisplay = document.getElementById('market-fee');
    const marketPriorityFeeDisplay = document.getElementById('market-priority-fee');
    const closeModalBtn = document.getElementById('close-modal');
    const sendTokenBtn = document.getElementById('send-token');
    const receiveButton = document.getElementById('receive-button');
    const receiveSection = document.getElementById('receive-section');
    const sendButton = document.getElementById('send-button');
    const sendTokenModal = document.getElementById('send-token-modal');
    const sendTokenList = document.getElementById('send-token-list');
    const noTokensSend = document.getElementById('no-tokens-send');
    const ethBalanceSend = document.getElementById('eth-balance-send');
    const closeSendModalBtn = document.getElementById('close-send-modal');

    // Connect wallet
    async function connectWallet() {
      if (window.ethereum) {
        try {
          web3 = new Web3(window.ethereum);
          
          const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
          });
          
          account = accounts[0];
          updateUI();
          await updateBalance();
          await updateGasPrices();
        } catch (error) {
          console.error("Error connecting to wallet:", error);
          alert("Failed to connect wallet. Please try again.");
        }
      } else {
        alert("Please install MetaMask or another Ethereum wallet.");
      }
    }

    // Update UI after connecting
    function updateUI() {
      notConnectedDiv.classList.add('hidden');
      connectedDiv.classList.remove('hidden');
      
      // Update account display
      accountDisplay.innerHTML = `
        <div class="text-sm font-mono bg-blue-700 px-2 py-1 rounded">
          ${account.substring(0, 6)}...${account.substring(account.length - 4)}
        </div>
      `;
      
      // Update address display
      userAddressDisplay.textContent = account;
    }

    // Update ETH balance
    async function updateBalance() {
      try {
        const balanceWei = await web3.eth.getBalance(account);
        const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
        balance = parseFloat(balanceEth).toFixed(4);
        balanceDisplay.textContent = `${balance} ETH`;
        ethBalanceSend.textContent = balance;
      } catch (error) {
        console.error("Error updating balance:", error);
      }
    }

    // Update gas prices
    async function updateGasPrices() {
      try {
        // Get current gas prices from the network
        const gasPriceWei = await web3.eth.getGasPrice();
        gasPrice = web3.utils.fromWei(gasPriceWei, 'gwei');
        
        // For EIP-1559 compatible networks
        try {
          const feeData = await web3.eth.getFeeData();
          if (feeData && feeData.maxFeePerGas) {
            maxFeePerGas = web3.utils.fromWei(feeData.maxFeePerGas, 'gwei');
            maxPriorityFeePerGas = web3.utils.fromWei(feeData.maxPriorityFeePerGas, 'gwei');
          } else {
            // If EIP-1559 is not supported, set reasonable defaults based on current gas price
            maxFeePerGas = (parseFloat(gasPrice) * 2).toString();
            maxPriorityFeePerGas = (parseFloat(gasPrice) * 0.5).toString();
          }
        } catch (error) {
          // Fallback for networks that don't support EIP-1559
          maxFeePerGas = (parseFloat(gasPrice) * 2).toString();
          maxPriorityFeePerGas = (parseFloat(gasPrice) * 0.5).toString();
        }
        
        // Update gas inputs
        maxFeeInput.value = maxFeePerGas;
        maxPriorityFeeInput.value = maxPriorityFeePerGas;
        
        // Update market rate displays
        marketFeeDisplay.textContent = `Current market: ${parseFloat(maxFeePerGas) / 2} Gwei`;
        marketPriorityFeeDisplay.textContent = `Current market: ${parseFloat(maxPriorityFeePerGas) / 2} Gwei`;
      } catch (error) {
        console.error("Error updating gas prices:", error);
        // Set default values if we can't get current gas prices
        gasPrice = '50';
        maxFeePerGas = '100';
        maxPriorityFeePerGas = '2';
        
        maxFeeInput.value = maxFeePerGas;
        maxPriorityFeeInput.value = maxPriorityFeePerGas;
      }
    }

    // Add token
    async function addToken() {
      const tokenAddress = tokenAddressInput.value;
      
      if (!web3 || !tokenAddress || !account) {
        alert("Please connect wallet and enter a token address");
        return;
      }

      try {
        isLoading = true;
        addTokenBtn.disabled = true;
        
        const tokenContract = new web3.eth.Contract(TOKEN_ABI, tokenAddress);
        
        // Get token details
        const [name, symbol, decimalsResult, balanceWei] = await Promise.all([
          tokenContract.methods.name().call(),
          tokenContract.methods.symbol().call(),
          tokenContract.methods.decimals().call(),
          tokenContract.methods.balanceOf(account).call()
        ]);
        
        const decimals = parseInt(decimalsResult);
        const divisor = Math.pow(10, decimals);
        const tokenBalance = (parseFloat(balanceWei) / divisor).toFixed(4);
        
        const newToken = {
          name,
          symbol,
          balance: tokenBalance,
          address: tokenAddress,
          decimals
        };
        
        tokens.push(newToken);
        updateTokenList();
        updateSendTokenList();
        updateTokenDropdown();
        tokenAddressInput.value = '';
      } catch (error) {
        console.error("Error adding token:", error);
        alert("Failed to add token. Please check the contract address.");
      } finally {
        isLoading = false;
        addTokenBtn.disabled = false;
      }
    }

    // Update token list
    function updateTokenList() {
      if (tokens.length === 0) {
        noTokensMsg.classList.remove('hidden');
        return;
      }
      
      noTokensMsg.classList.add('hidden');
      tokenListDiv.innerHTML = '';
      
      tokens.forEach((token, index) => {
        const tokenElement = document.createElement('div');
        tokenElement.className = 'p-3 hover:bg-gray-100 cursor-pointer transition-colors';
        tokenElement.innerHTML = `
          <div class="flex justify-between items-center">
            <div>
              <p class="font-medium">${token.symbol}</p>
              <p class="text-xs text-gray-600">${token.name}</p>
            </div>
            <p class="font-medium">${token.balance}</p>
          </div>
        `;
        tokenElement.addEventListener('click', () => openTransferModal(token));
        tokenListDiv.appendChild(tokenElement);
      });
    }

    // Update send token list
    function updateSendTokenList() {
      // Clear existing token elements (except the ETH one which is static)
      const tokenElements = sendTokenList.querySelectorAll('div:not(:first-child)');
      tokenElements.forEach(el => el.remove());
      
      if (tokens.length === 0) {
        noTokensSend.classList.remove('hidden');
      } else {
        noTokensSend.classList.add('hidden');
        
        tokens.forEach(token => {
          const tokenElement = document.createElement('div');
          tokenElement.className = 'p-3 hover:bg-gray-100 cursor-pointer transition-colors';
          tokenElement.innerHTML = `
            <div class="flex justify-between items-center">
              <div>
                <p class="font-medium">${token.symbol}</p>
                <p class="text-xs text-gray-600">${token.name}</p>
              </div>
              <p class="font-medium">${token.balance}</p>
            </div>
          `;
          tokenElement.addEventListener('click', () => {
            openTransferModal(token);
            sendTokenModal.classList.add('hidden');
          });
          sendTokenList.appendChild(tokenElement);
        });
      }
      
      // Add ETH transfer option
      const ethElement = sendTokenList.querySelector('div:first-child');
      ethElement.addEventListener('click', () => {
        openEthTransferModal();
        sendTokenModal.classList.add('hidden');
      });
    }

    // Update token dropdown
    function updateTokenDropdown() {
      // Clear existing options except the first one
      while (tokenDropdown.options.length > 1) {
        tokenDropdown.remove(1);
      }
      
      // Add ETH option
      const ethOption = document.createElement('option');
      ethOption.value = 'eth';
      ethOption.textContent = 'ETH - Ethereum';
      tokenDropdown.appendChild(ethOption);
      
      // Add token options
      tokens.forEach((token, index) => {
        const option = document.createElement('option');
        option.value = index.toString();
        option.textContent = `${token.symbol} - ${token.name}`;
        tokenDropdown.appendChild(option);
      });
      
      // Add change event listener
      tokenDropdown.addEventListener('change', handleTokenSelection);
    }
    
    // Handle token selection in dropdown
    function handleTokenSelection() {
      const selectedValue = tokenDropdown.value;
      
      if (selectedValue === '') {
        selectedTokenName.textContent = 'Select a token';
        selectedTokenBalance.textContent = '0.0000';
        selectedToken = null;
        return;
      }
      
      if (selectedValue === 'eth') {
        selectedTokenName.textContent = 'ETH (Ethereum)';
        selectedTokenBalance.textContent = balance;
        selectedToken = {
          name: 'Ethereum',
          symbol: 'ETH',
          balance: balance,
          address: null,
          decimals: 18
        };
        return;
      }
      
      const index = parseInt(selectedValue);
      selectedToken = tokens[index];
      selectedTokenName.textContent = `${selectedToken.symbol} (${selectedToken.name})`;
      selectedTokenBalance.textContent = selectedToken.balance;
    }

    // Open transfer modal for a specific token
    function openTransferModal(token) {
      selectedToken = token;
      modalTitle.textContent = `Transfer ${selectedToken.symbol}`;
      selectedTokenName.textContent = `${selectedToken.name} (${selectedToken.symbol})`;
      selectedTokenBalance.textContent = selectedToken.balance;
      
      // Set the dropdown to the correct token
      if (token.symbol === 'ETH') {
        tokenDropdown.value = 'eth';
      } else {
        const tokenIndex = tokens.findIndex(t => t.address === token.address);
        tokenDropdown.value = tokenIndex.toString();
      }
      
      recipientInput.value = '';
      amountInput.value = '';
      
      transferModal.classList.remove('hidden');
    }

    // Open ETH transfer modal
    function openEthTransferModal() {
      selectedToken = {
        name: 'Ethereum',
        symbol: 'ETH',
        balance: balance,
        address: null,
        decimals: 18
      };
      
      modalTitle.textContent = 'Transfer ETH';
      selectedTokenName.textContent = 'ETH (Ethereum)';
      selectedTokenBalance.textContent = balance;
      
      // Set the dropdown to ETH
      tokenDropdown.value = 'eth';
      
      recipientInput.value = '';
      amountInput.value = '';
      
      transferModal.classList.remove('hidden');
    }

    // Close modal
    function closeModal() {
      transferModal.classList.add('hidden');
      selectedToken = null;
      gasOptionsDiv.classList.add('hidden');
      toggleGasBtn.textContent = 'Show Advanced Gas Options';
    }

    // Close send token modal
    function closeSendModal() {
      sendTokenModal.classList.add('hidden');
    }

    // Toggle gas options
    function toggleGasOptions() {
      const isHidden = gasOptionsDiv.classList.contains('hidden');
      
      if (isHidden) {
        gasOptionsDiv.classList.remove('hidden');
        toggleGasBtn.textContent = 'Hide Advanced Gas Options';
      } else {
        gasOptionsDiv.classList.add('hidden');
        toggleGasBtn.textContent = 'Show Advanced Gas Options';
      }
    }

    // Send token
    async function sendToken() {
      if (!web3 || !selectedToken || !recipientInput.value || !amountInput.value || !account) {
        alert("Please fill in all fields");
        return;
      }

      try {
        isLoading = true;
        sendTokenBtn.disabled = true;
        sendTokenBtn.textContent = 'Sending...';
        
        const recipient = recipientInput.value;
        const amount = amountInput.value;
        
        // Prepare transaction parameters
        const txParams = {
          from: account,
          to: recipient,
          gasLimit: web3.utils.toHex(100000), // Set a reasonable gas limit
        };
        
        // Use EIP-1559 gas parameters if available
        if (maxFeeInput.value && maxPriorityFeeInput.value) {
          // Convert from Gwei to Wei
          txParams.maxFeePerGas = web3.utils.toWei(maxFeeInput.value, 'gwei');
          txParams.maxPriorityFeePerGas = web3.utils.toWei(maxPriorityFeeInput.value, 'gwei');
        } else {
          // Fallback to legacy gas price
          txParams.gasPrice = web3.utils.toWei(gasPrice, 'gwei');
        }
        
        // Handle ETH transfer differently from token transfers
        if (selectedToken.symbol === 'ETH') {
          // Convert ETH amount to Wei
          txParams.value = web3.utils.toWei(amount, 'ether');
          
          // Send ETH transaction
          await web3.eth.sendTransaction(txParams);
          
          // Update ETH balance after successful transfer
          await updateBalance();
        } else {
          // For token transfers
          const tokenContract = new web3.eth.Contract(TOKEN_ABI, selectedToken.address);
          
          // Convert amount to token units based on decimals
          const amountInTokenUnits = web3.utils.toBN(
            (parseFloat(amount) * Math.pow(10, selectedToken.decimals)).toString()
          );
          
          // Send token transaction
          await tokenContract.methods.transfer(recipient, amountInTokenUnits).send(txParams);
          
          // Update token balance after successful transfer
          const newBalanceWei = await tokenContract.methods.balanceOf(account).call();
          const divisor = Math.pow(10, selectedToken.decimals);
          const newBalance = (parseFloat(newBalanceWei) / divisor).toFixed(4);
          
          // Update token in the list
          tokens = tokens.map(token => 
            token.address === selectedToken.address 
              ? { ...token, balance: newBalance } 
              : token
          );
          
          updateTokenList();
          updateSendTokenList();
        }
        
        alert("Transaction sent successfully!");
        closeModal();
      } catch (error) {
        console.error("Error sending transaction:", error);
        alert("Failed to send transaction. Please check your inputs and try again.");
      } finally {
        isLoading = false;
        sendTokenBtn.disabled = false;
        sendTokenBtn.textContent = 'Send';
      }
    }

    // Generate QR code
    function generateQRCode() {
      if (!account) return;
      
      // Clear previous QR code
      qrCodeDisplay.innerHTML = '';
      
      // Generate new QR code
      new QRCode(qrCodeDisplay, {
        text: account,
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    }

    // Toggle receive section
    function toggleReceiveSection() {
      if (receiveSection.classList.contains('hidden')) {
        receiveSection.classList.remove('hidden');
        generateQRCode();
      } else {
        receiveSection.classList.add('hidden');
      }
    }

    // Show send token modal
    function showSendTokenModal() {
      // Update ETH balance
      ethBalanceSend.textContent = balance;
      sendTokenModal.classList.remove('hidden');
    }

    // Event listeners
    connectWalletBtn.addEventListener('click', connectWallet);
    connectWalletMainBtn.addEventListener('click', connectWallet);
    addTokenBtn.addEventListener('click', addToken);
    closeModalBtn.addEventListener('click', closeModal);
    toggleGasBtn.addEventListener('click', toggleGasOptions);
    sendTokenBtn.addEventListener('click', sendToken);
    receiveButton.addEventListener('click', toggleReceiveSection);
    sendButton.addEventListener('click', showSendTokenModal);
    closeSendModalBtn.addEventListener('click', closeSendModal);

    // First ETH element in send token list
    const ethElement = sendTokenList.querySelector('div:first-child');
    ethElement.addEventListener('click', () => {
      openEthTransferModal();
      sendTokenModal.classList.add('hidden');
    });

    // Initialize token dropdown
    updateTokenDropdown();

    // Handle Ethereum account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          account = accounts[0];
          updateUI();
          updateBalance();
          // Reset tokens when account changes
          tokens = [];
          updateTokenList();
          updateSendTokenList();
          updateTokenDropdown();
          // Hide receive section if visible
          receiveSection.classList.add('hidden');
        } else {
          // Disconnected
          account = '';
          notConnectedDiv.classList.remove('hidden');
          connectedDiv.classList.add('hidden');
          accountDisplay.innerHTML = `
            <button 
              id="connect-wallet"
              class="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors"
            >
              Connect Wallet
            </button>
          `;
          document.getElementById('connect-wallet').addEventListener('click', connectWallet);
        }
      });
    }
  </script>

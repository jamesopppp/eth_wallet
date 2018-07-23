import bip39 from 'bip39';
import ethers from 'ethers';
import abi from './abi';
import currencyList from './currencyList';
/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name)
    return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content); //从一个对象解析出字符串
  }
  window
    .localStorage
    .setItem(name, content);
};

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name)
    return;
  return window
    .localStorage
    .getItem(name);
};

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name)
    return;
  window
    .localStorage
    .removeItem(name);
};

/**
 * 判断值是否是空 是空返回true，不是空返回false；
 * @param data
 */
export const objIsNull = data => {
  var flag = true;
  if (data != null && data != undefined && data != "" && data != "null" && data != "nil" && data != "undefined") {
    flag = false;
  }
  return flag;
}

/**
 * 判断值是否是空 是空返回true，不是空返回false；
 * @param data
 */
export const createWallet = () => {
  console.log("start");
  let words = bip39.generateMnemonic(
    128,
    null,
    bip39.wordlists.chinese_simplified
  );
  let seed = bip39.mnemonicToSeed(words);
  let root = ethers.HDNode.fromSeed(seed);
  var key1 = root.derivePath("m/44'/60'/0'/0/0");
  let privateKey = key1.privateKey;
  let wallet = new ethers.Wallet(privateKey);
  let walletItem = {};
  walletItem.wallet = wallet;
  let bitList = [];
  for (let i = 1, len = currencyList.length; i < len; i++) {
    let bitItem = {};
    bitItem.token = currencyList[i].token;
    bitItem.isOpen = false;
    bitList.push(bitItem);
  }
  walletItem.isFirstIn = false;
  walletItem.bitList = bitList;
  setStore('mnemonic', words);
  setStore('walletItem', walletItem);
  return wallet;
}

/**
 * 生成二维码内容戳
 * 地址,金额,币种
 */
export const generateQRtxt = (amount, token) => {
  let walletList = JSON.parse(getStore("walletList"));
  let initalAddress = walletList[0].wallet.address;
  let icapAddress = ethers.utils.getAddress(initalAddress, true);
  let scanTxt = `iban:${icapAddress}?amount=${amount}&token=${token}`;
  return scanTxt;
};


/**
 * 获取 Erc20 TOKEN 余额
 * 传入 TOKEN地址, 钱包地址
 * 返回余额
 */
export const getErc20Balance = (address, providerName) => {
  let provider = ethers.providers.getDefaultProvider(providerName);
  let balanceList = [];
  for (let i = 1, len = currencyList.length - 1; i < len; i++) {
    let balanceItem = {};
    let token = currencyList[i].contract;
    let contract = new ethers.Contract(token, abi, provider);
    contract.balanceOf(address).then(function (balance) {
      balanceItem.token = currencyList[i].token;
      balanceItem.balance = balance;
      balanceList.push(balanceItem);
    })
  }
  return balanceList;
};


/**
 * 传入地址补0
 * 
 * 返回64位 补0地址
 */
export const addressPadZero = (address) => {
  let data = address.substr(2);
  let zeroAddress = data.padStart(64, '0');
  return zeroAddress;
};

/**
 * 传入金额补0
 * 返回64位 补0金额戳
 */
export const moneyPadZero = (amount) => {
  let data = String(amount * Math.pow(10, 8));
  let zeroAmount = data.padStart(64, '0');
  return zeroAmount;
};

/**
 * 传入转账地址,转账金额
 * 返回交易的data串
 */
export const generateData = (address, amount) => {
  let dataAddress = address.substr(2);
  let zeroAddress = dataAddress.padStart(64, '0');

  let dataAmount = amount * Math.pow(10, 8);
  let amount1 = ethers.utils.bigNumberify(dataAmount);
  let amount2 = amount1.toHexString().substr(2);
  let zeroAmount = amount2.padStart(64, '0');

  let data = "0xa9059cbb" + zeroAddress + zeroAmount;
  return data;
};


/**
 * 交易eth以太坊币
 * 传入 私钥,服务器地址昵称,收款地址,金额
 * 回调返回交易哈希值
 */
export const transferEth = (privateKey, providerName, address, amount) => {
  console.log(privateKey, providerName, address, amount);
  let wallet = new ethers.Wallet(privateKey);
  wallet.provider = ethers.providers.getDefaultProvider(providerName);

  let transaction = {
    gasLimit: 1000000,
    to: address,
    data: "0x",
    value: ethers.utils.parseEther(amount)
  };

  let sendTransactionPromise = wallet.sendTransaction(transaction);

  return sendTransactionPromise;
};


/**
 * 判断方法
 * 判断是否有钱包账户
 * 有就返回 true 否就 false
 */
export const isOwnAccount = () => {
  let walletList = JSON.parse(getStore('walletList'));
  let flag = false;
  if (!objIsNull(walletList)) {
    if (walletList.length > 0) {
      flag = true;
    }
  }
  return flag;
};


/**
 * 查询钱包币种余额
 * 
 * 返回 余额
 */
export const getBitBalance = (token, address, providerName) => {
  let name = token.toUpperCase();
  let balance = 0;
  let provider;
  if (objIsNull(providerName)) {
    provider = ethers.providers.getDefaultProvider();
  } else {
    provider = ethers.providers.getDefaultProvider(providerName);
  }
  if (name == 'ETH') {
    provider.getBalance(address).then(function (balance) {
      let etherString = ethers.utils.formatEther(balance);
      balance = etherString;
      console.log('b', balance)
    });
  } else {
    let contractAddress;
    for (let i = 0, len = currencyList.length; i < len; i++) {
      if (currencyList[i].token == name) {
        contractAddress = currencyList[i].contract;
        break;
      }
    }
    let contract = new ethers.Contract(contractAddress, abi, provider);
    balance = contract.balanceOf(address);
  }
  return balance;
};

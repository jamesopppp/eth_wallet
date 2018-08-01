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
    bip39.wordlists.english
  );
  let seed = bip39.mnemonicToSeed(words);
  let root = ethers.HDNode.fromSeed(seed);
  var key1 = root.derivePath("m/44'/60'/0'/0/0");
  let privateKey = key1.privateKey;
  let wallet = new ethers.Wallet(privateKey);
  let walletItem = {};
  walletItem.wallet = wallet;
  walletItem.isFirstIn = true;
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
  let val = Math.pow(10, 8);

  let dataAmount = accMul(amount, val);
  let amount1 = ethers.utils.bigNumberify(dataAmount);

  let amount2 = amount1.toHexString().substr(2);
  let zeroAmount = amount2.padStart(64, '0');

  let data = "0xa9059cbb" + zeroAddress + zeroAmount;
  return data;
};


/**
 * 数值相乘
 * 解决精度丢失问题
 */
export const accMul = (arg1, arg2) => {
  let m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length;
  } catch (e) {}
  try {
    m += s2.split(".")[1].length;
  } catch (e) {}
  return (
    Number(s1.replace(".", "")) *
    Number(s2.replace(".", "")) /
    Math.pow(10, m)
  );
}

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
 * 时间戳转换
 * 传入时间戳
 * 返回 yyyy-mm-dd HH-mm-ss
 */
export const formartTimeStamp = (timestamp) => {
  let date = new Date(timestamp * 1000); //如果date为13位不需要乘1000
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
  let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return Y + M + D + h + m + s;
};

/**
 * 交易data计算金额
 * 传入data(input)串
 * 返回 交易金额
 */
export const formartTranstionData = (data) => {
  let type = data.substr(0, 10);
  let amount;
  let amountData = parseInt(data.substr(74), 16);
  if (type.toString() !== '0xa9059cbb') {
    amount = 0;
  } else {
    amount = (amountData / Math.pow(10, 8)).toFixed(3);
  }
  return amount;
};

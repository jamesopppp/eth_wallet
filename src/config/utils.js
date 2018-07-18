import bip39 from 'bip39';
import ethers from 'ethers';
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
  setStore('mnemonic', words);
  setStore('walletItem', walletItem);
  return wallet;
}

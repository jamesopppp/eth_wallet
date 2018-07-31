<template>
  <div class="importWallet">
      <v-header title="导入钱包"></v-header>
      <div class="importWallet-view zoomIn animated">
          <div class="selectView">
              <div @click="selectTab(0)" :class="tab==0?'select':''">助记词</div>
              <div @click="selectTab(1)" :class="tab==1?'select':''">官方钱包</div>
              <div @click="selectTab(2)" :class="tab==2?'select':''">私钥</div>
              <div :class="{'tab1':tab===0,'tab2':tab===1,'tab3':tab===2}" class="selectBlock"></div>
          </div>
          <div v-show="tab===0">
            <textarea v-model="mnemonic" placeholder="助记词,按空格分隔" class="mnemonicInput"></textarea>
            <div class="path">m/44/60/0/0/0</div>
            <input v-model="pathPassword1" class="password" type="text" placeholder="密码">
            <input v-model="pathPassword2" class="password" type="text" placeholder="重复密码">
            <input v-model="pathMessage" class="password" type="text" placeholder="密码提示信息(可不填)">
            <div class="rulse">
                <div @click="checkbox=!checkbox" :class="!checkbox?'space':''" class="block" v-ripple>
                    <i class="iconfont icon-queren"></i>
                </div>
                <span>我已经仔细阅读并同意</span><span>《服务及隐私条款》</span>
            </div>
            <v-btn @click="mnemonicImport" :disabled="isCreate" :loading="isCreate" :class="!checkbox?'noSelect':''" class="create">开始导入</v-btn>
           </div>
          <div v-show="tab===1">
            <p class="keystoreTip">直接复制粘贴以太坊官方钱包keystore文件内容至输入框,或者通过生成keystore内容的二维码,扫描录入</p>
            <textarea v-model="keyStore" placeholder="Keystore文本内容" class="keystoreInput"></textarea>
            <input v-model="keyStorePassword" class="password" type="text" placeholder="Keystore密码">
            <div class="rulse">
                <div @click="checkbox1=!checkbox1" :class="!checkbox1?'space':''" class="block" v-ripple>
                    <i class="iconfont icon-queren"></i>
                </div>
                <span>我已经仔细阅读并同意</span><span>《服务及隐私条款》</span>
            </div>
            <v-btn @click="keystoreImport" :disabled="isCreate" :loading="isCreate" :class="!checkbox1?'noSelect':''" class="create">开始导入</v-btn>
           </div>
          <div v-show="tab===2">
            <textarea v-model="privateKey" placeholder="明文私钥" class="mnemonicInput"></textarea>
            <input v-model="privateKeyPass1" class="password" type="text" placeholder="密码">
            <input v-model="privateKeyPass2" class="password" type="text" placeholder="重复密码">
            <input v-model="privateKeyMessage" class="password" type="text" placeholder="密码提示信息(可不填)">
            <div class="rulse">
                <div @click="checkbox2=!checkbox2" :class="!checkbox2?'space':''" class="block" v-ripple>
                    <i class="iconfont icon-queren"></i>
                </div>
                <span>我已经仔细阅读并同意</span><span>《服务及隐私条款》</span>
            </div>
            <v-btn @click="privateKeyImport" :disabled="isCreate" :loading="isCreate" :class="!checkbox2?'noSelect':''" class="create">开始导入</v-btn>
           </div>
      </div>
      <v-snackbar :timeout="1500" auto-height color="info" bottom v-model="toast">
            {{ toastText }}
            <v-btn dark flat @click="toast = false">
              关闭
            </v-btn>
      </v-snackbar>
      <v-dialog v-model="isCreate" hide-overlay persistent width="300">
        <v-card color="primary" dark>
            <v-card-text>
                钱包导入中...
            <v-progress-linear indeterminate class="mb-0" color="white">
            </v-progress-linear>
            </v-card-text>
        </v-card>
      </v-dialog>
      <div class="shadow" v-show="isCreate"></div>
  </div>
</template>

<script>
import { objIsNull, getStore, setStore } from "@/config/utils";
import vHeader from "@/components/common/header-bar/header-bar";
export default {
  data() {
    return {
      tab: 0,
      checkbox: true,
      checkbox1: true,
      checkbox2: true,
      isCreate: false,
      pathPassword1: "",
      pathPassword2: "",
      mnemonic: "",
      toast: false,
      toastText: "",
      pathMessage: "",
      keyStore: "",
      keyStorePassword: "",
      privateKey: "",
      privateKeyPass1: "",
      privateKeyPass2: "",
      privateKeyMessage: ""
    };
  },
  created() {
    let that = this;
  },
  mounted() {},
  methods: {
    mnemonicImport() {
      let that = this;
      if (!that.checkbox) {
        return;
      }
      if (objIsNull(that.mnemonic)) {
        that.toastText = "请输入您的助记词";
        that.toast = true;
        return;
      }
      if (objIsNull(that.pathPassword1) || objIsNull(that.pathPassword2)) {
        that.toastText = "请设置您的钱包密码";
        that.toast = true;
        return;
      }
      if (that.pathPassword1.toString() != that.pathPassword2.toString()) {
        that.toastText = "请确认钱包密码是否相同";
        that.toast = true;
        return;
      }
      if (!objIsNull(that.pathMessage)) {
        if (that.pathMessage.length > 20) {
          that.toastText = "密码提示信息过长";
          that.toast = true;
          return;
        }
      }
      let englishValid = that.bip39.validateMnemonic(
        that.mnemonic,
        that.bip39.wordlists.english
      );
      if (englishValid) {
        that.isCreate = true;
        setTimeout(() => {
          let seed = that.bip39.mnemonicToSeed(that.mnemonic);
          let root = that.ethers.HDNode.fromSeed(seed);
          var key1 = root.derivePath("m/44'/60'/0'/0/0");
          let privateKey = key1.privateKey;
          let wallet = new that.ethers.Wallet(privateKey);
          let walletItem = {};
          walletItem.wallet = wallet;
          walletItem.isFirstIn = true;
          let walletList = JSON.parse(getStore("walletList"));
          let name = "GeeWer" + that.mathRand();
          let details = {
            walletName: name,
            walletPassword: that.pathPassword1,
            walletMessage: that.pathMessage
          };
          that.$set(walletItem, "details", details);
          if (objIsNull(walletList) || walletList.length == 0) {
            let list = [];
            list.push(walletItem);
            setStore("walletList", list);
          } else {
            walletList.unshift(walletItem);
            setStore("walletList", walletList);
          }
        }, 1000);
        setTimeout(() => {
          that.isCreate = false;
          that.$router.push({ name: "home" });
        }, 3500);
      } else {
        that.toastText = "助记词或输入格式有误";
        that.toast = true;
        return;
      }
    },
    keystoreImport() {
      let that = this;
      if (!that.checkbox1) {
        return;
      }
      if (objIsNull(that.keyStore)) {
        that.toastText = "请输入您的keystore文本";
        that.toast = true;
        return;
      }
      if (objIsNull(that.keyStorePassword)) {
        that.toastText = "请输入您的keystore密码";
        that.toast = true;
        return;
      }
      that.isCreate = true;
      that.ethers.Wallet.fromEncryptedWallet(
        that.keyStore,
        that.keyStorePassword
      )
        .then(function(wallet) {
          console.log("Address: " + wallet.address);
          let walletItem = {};
          walletItem.wallet = wallet;
          walletItem.isFirstIn = true;
          let walletList = JSON.parse(getStore("walletList"));
          let name = "GeeWer" + that.mathRand();
          let details = {
            walletName: name,
            walletPassword: that.keyStorePassword,
            walletMessage: ""
          };
          that.$set(walletItem, "details", details);
          if (objIsNull(walletList) || walletList.length == 0) {
            let list = [];
            list.push(walletItem);
            setStore("walletList", list);
          } else {
            walletList.unshift(walletItem);
            setStore("walletList", walletList);
          }
          setTimeout(() => {
            that.isCreate = false;
            that.$router.push({ name: "home" });
          }, 2000);
        })
        .catch(function(err) {
          console.log(err);
          that.isCreate = false;
          that.toastText = "keystore文本或密码错误";
          that.toast = true;
          return;
        });
    },
    privateKeyImport() {
      let that = this;
      if (!that.checkbox2) {
        return;
      }
      if (objIsNull(that.privateKey)) {
        that.toastText = "请输入您的私钥";
        that.toast = true;
        return;
      }
      if (objIsNull(that.privateKeyPass1) || objIsNull(that.privateKeyPass2)) {
        that.toastText = "请设置您的钱包密码";
        that.toast = true;
        return;
      }
      if (that.privateKeyPass1.toString() !== that.privateKeyPass2.toString()) {
        that.toastText = "请确认您的钱包密码";
        that.toast = true;
        return;
      }
      if (!objIsNull(that.privateKeyMessage)) {
        if (that.privateKeyMessage.length > 20) {
          that.toastText = "密码提示信息过长";
          that.toast = true;
          return;
        }
      }
      if (that.privateKey.substr(0, 2) !== "0x") {
        that.privateKey = "0x" + that.privateKey;
      }
      try {
        that.isCreate = true;
        let wallet = new that.ethers.Wallet(that.privateKey);
        let walletItem = {};
        walletItem.wallet = wallet;
        walletItem.isFirstIn = true;
        let walletList = JSON.parse(getStore("walletList"));
        let name = "GeeWer" + that.mathRand();
        let details = {
          walletName: name,
          walletPassword: that.privateKeyPass1,
          walletMessage: that.privateKeyMessage
        };
        that.$set(walletItem, "details", details);
        if (objIsNull(walletList) || walletList.length == 0) {
          let list = [];
          list.push(walletItem);
          setStore("walletList", list);
        } else {
          walletList.unshift(walletItem);
          setStore("walletList", walletList);
        }
        setTimeout(() => {
          that.isCreate = false;
          that.$router.push({ name: "home" });
        }, 2000);
      } catch (err) {
        console.log(err);
        that.isCreate = false;
        that.toastText = "明文私钥输入错误";
        that.toast = true;
        return;
      }
    },
    mathRand() {
      let Num = "";
      for (let i = 0; i < 6; i++) {
        Num += Math.floor(Math.random() * 10);
      }
      return Num;
    },
    selectTab(index) {
      if (index === 0) {
        if (this.tab !== 0) {
          this.tab = 0;
        }
      }
      if (index === 1) {
        if (this.tab !== 1) {
          this.tab = 1;
        }
      }
      if (index === 2) {
        if (this.tab !== 2) {
          this.tab = 2;
        }
      }
    }
  },
  components: {
    vHeader
  },
  props: {}
};
</script>
<style lang="less" scoped>
@import "./importWallet.less";
</style>
<template>
  <div class="home">
        <div class="wavesBox fadeInDown animated" v-touch="{down: () => swipe('down')}">
            <div class="box-bg">
            </div>
            <div v-ripple class="view">
              <img @click="openMenu" src="./more.png" class="menu">
              <img ref="scan" @click="goScan" src="./scan.png" class="scan">
              <img class="logo" src="../../assets/images/logo.png">
              <p class="name">{{name}}</p>
              <p class="code">{{address}}</p>
              <img class="qc" @click="goTab" src="../../assets/images/qc.svg">
              <div class="add" @click="addBit">
                +
              </div>
              <transition name="swipe">
                <div v-show="loadingTop" class="loadTop">
                  <v-progress-circular class="circular" indeterminate></v-progress-circular>
                </div>
              </transition>
              <!-- <div class="money"><span>总资产($)</span><span>&asymp;</span><span>{{balance}}</span></div> -->
            </div>
        </div>
        <div class="bitList fadeInUp animated">
          <div class="box" ref="bitList">
              <swipeout>
                <swipeout-item class="moveItem fadeInUp animated" :key="item.token" v-for="item in homeList" transition-mode="follow">
                  <div slot="right-menu">
                    <swipeout-button class="transaction" @click.native="transfer(item.token)">
                      <img src="./transaction.png">
                      <p>转账</p>
                    </swipeout-button>
                    <swipeout-button class="receipt" @click.native="showScan(item.token)">
                      <img src="./shoukuan.png">
                      <p>收款</p>
                    </swipeout-button>
                  </div>
                  <div @click="goDetails(item.token,item.contract)" class="item" v-ripple slot="content">
                    <p class="name">{{item.token}}</p>
                    <p class="details">{{item.name}}</p>
                    <div class="icon">
                      <img :src="item.icon">
                    </div>
                    <div class="money">
                      <p>&asymp; {{item.balance}} {{item.token?item.token.toLowerCase():''}}</p>
                    </div>
                  </div>
                </swipeout-item>
              </swipeout>
          </div>
        </div>
        <popup hide-on-deactivated is-transparent v-model="scanShow" position="bottom">
          <div class="scanView">
            <div class="top">
              <span>{{token}}转账</span>
              <span @click="cancelShow">取消</span>
            </div>
            <qrcode class="qrcode" :value="QRval" tag="img" :options="{ size: 200 }"></qrcode>
            <p class="tip">(正在使用{{token}}货币进行收款)</p>
          </div>
        </popup>
        <v-navigation-drawer class="leftDrawer" v-model="leftDrawer" fixed>
          <div class="leftView">
            <div v-ripple class="head">
              <img src="./left-header.png" class="left-bg">
              <div class="left-box">
                  <img class="avatar" src="../../assets/images/logo.png"> 
                  <p>{{name}}</p>
                  <p>{{address}}</p>
              </div>
            </div>
            <div class="view-list">
              <div @click="changeName" class="view-item" v-ripple>
                <img src="./rename.png">
                <span>编辑钱包名称</span>
              </div>
              <div @click="changePassword" class="view-item" v-ripple>
                <img src="./password.png">
                <span>钱包密码修改</span>
              </div>
              <div class="view-item" @click="confirmPassword(0)" v-ripple>
                <img src="./export.png">
                <span>导出私钥</span>
              </div>
              <div class="view-item" @click="confirmPassword(1)" v-ripple>
                <img src="./keystore.png">
                <span>导出KeyStore</span>
              </div>
              <div class="view-item" @click="goTokenIssue" v-ripple>
                <img src="./sign.png">
                <span>通证发行(内测)</span>
              </div>
              <div @click="buyEth" slot="activator" class="view-item" v-ripple>
                <img src="./buyeth.png">
                <span>ETH购买(未开放)</span>
              </div>
            </div>
          </div>
        </v-navigation-drawer>
        <v-dialog content-class="export-privateKey-pop" persistent max-width="400" v-model="exportPrivateKeyPop">
            <div class="export-privateKey-title">导出私钥<i @click="exportPrivateKeyPop=false" class="iconfont icon-quxiao"></i></div>
            <div class="export-privateKey-safeTip">
              安全警告: 私钥未经加密,导出存在风险,建议使用助记词和Keystore进行备份。
            </div>
            <div class="export-privateKey-privateKey">
              {{privateKey}}
            </div>
            <v-btn :disabled="copying" :loading="copying" @click="doCopy" class="export-privateKey-copy">复制</v-btn>
        </v-dialog>
        <v-dialog content-class="password-confirm-pop" persistent max-width="400" v-model="passwordConfirmPop">
            <div class="password-confirm-title">安全验证<i @click="passwordConfirmPop=false" class="iconfont icon-quxiao"></i></div>
            <input v-model="walletPassword" class="password-confirm-input" type="password" placeholder="钱包密码"> 
            <v-btn @click="passwordConfirm" class="password-confirm-sure">确定</v-btn>
        </v-dialog>
        <v-dialog content-class="change-name-pop" persistent max-width="400" v-model="changeNamePop">
            <div class="change-name-title">修改钱包名称<i @click="closeChangeNamePop" class="iconfont icon-quxiao"></i></div>
            <input autofocus v-model="walletName" type="text" maxlength="15" class="change-name-input" :placeholder="name"> 
            <v-btn :disabled="changing" :loading="changing" @click="changeNameConfirm" class="change-name-sure">确定修改</v-btn>
        </v-dialog>
        <v-dialog content-class="change-password-pop" persistent max-width="400" v-model="changePasswordPop">
            <div class="change-password-title">修改钱包密码<i @click="closeChangePasswordPop" class="iconfont icon-quxiao"></i></div>
            <input v-model="changePssword1" type="password" maxlength="15" class="change-password-input1" placeholder="请输入旧钱包密码">
            <input v-model="changePssword2" type="password" maxlength="15" class="change-password-input2" placeholder="请输入新密码">  
            <input v-model="changePssword3" type="password" maxlength="15" class="change-password-input3" placeholder="重复新密码">  
            <v-btn :disabled="changing" :loading="changing" @click="changePasswordConfirm" class="change-password-sure">确定修改</v-btn>
        </v-dialog>
        <v-snackbar class="backButton" v-model="snackBar" color="info" :timeout="1500">
            {{snackBarText}}
          <v-btn dark flat @click="snackBar = false">
            关闭
          </v-btn>
        </v-snackbar>
        <div v-show="leftDrawer||passwordConfirmPop||exportPrivateKeyPop||changeNamePop||changePasswordPop" class="leftMask"></div>
  </div>
</template>

<script>
import { Swipeout, SwipeoutItem, SwipeoutButton, Popup } from "vux";
import { mapState } from "vuex";
import BScroll from "better-scroll";
import { getStore, generateQRtxt, setStore, objIsNull } from "@/config/utils";
import abi from "@/config/abi";
export default {
  name: "home",
  data() {
    return {
      address: "",
      name: "",
      scanShow: false,
      QRval: "GeeWer",
      leftDrawer: false,
      balance_eth: 0,
      token: "ETH",
      bitList: [],
      homeList: [],
      tokenData: [],
      loadingTop: false,
      exportPrivateKeyPop: false,
      privateKey: "",
      copying: false,
      snackBar: false,
      snackBarText: "",
      passwordConfirmPop: false,
      walletPassword: "",
      isFromWhere: 0,
      changeNamePop: false,
      walletName: "",
      changing: false,
      changePssword1: "",
      changePssword2: "",
      changePssword3: "",
      changePasswordPop: false
    };
  },
  // mounted() {
  //   let that = this;
  //   that.$store.commit("SET_TAB", 0);
  //   that.bitList = JSON.parse(getStore("walletList"));
  //   that.address = that.bitList[0].wallet.address;
  //   that.name = that.bitList[0].details.walletName;
  //   that.getCurrencyList();
  //   that.getBitList();
  // },
  // beforeDestroy() {
  //   let that = this;
  //   that.bitList[0].isFirstIn = false;
  //   setStore("walletList", that.bitList);
  // },
  activated() {
    let that = this;
    that.$store.commit("SET_TAB", 0);
    that.bitList = JSON.parse(getStore("walletList"));
    that.address = that.bitList[0].wallet.address;
    that.name = that.bitList[0].details.walletName;
    that.getBitList();
    // that.testPlace();
  },
  deactivated() {
    let that = this;
    that.bitList[0].isFirstIn = false;
    setStore("walletList", that.bitList);
    that.$refs.scan.classList.remove("scanClick");
  },
  methods: {
    closeChangeNamePop() {
      this.walletName = "";
      this.changeNamePop = false;
    },
    closeChangePasswordPop() {
      this.changePssword1 = "";
      this.changePssword2 = "";
      this.changePssword3 = "";
      this.changePasswordPop = false;
    },
    changePassword() {
      this.leftDrawer = false;
      this.changePasswordPop = true;
    },
    changePasswordConfirm() {
      let that = this;
      let password = that.bitList[0].details.walletPassword;
      if (
        objIsNull(that.changePssword1) ||
        objIsNull(that.changePssword2) ||
        objIsNull(that.changePssword3)
      ) {
        that.snackBarText = "钱包密码不能为空";
        that.snackBar = true;
        return;
      }
      if (that.changePssword2 !== that.changePssword3) {
        that.snackBarText = "输入钱包密码不相同";
        that.snackBar = true;
        return;
      }
      if (that.changePssword1 !== password) {
        that.snackBarText = "钱包旧密码输入错误";
        that.snackBar = true;
        return;
      }
      that.changing = true;
      setTimeout(() => {
        that.changing = false;
        that.changePasswordPop = false;
        that.bitList[0].details.walletPassword = that.changePssword2;
        that.changePssword1 = "";
        that.changePssword2 = "";
        that.changePssword3 = "";
        that.snackBarText = "钱包密码修改成功";
        that.snackBar = true;
      }, 1500);
    },
    changeNameConfirm() {
      let that = this;
      if (objIsNull(that.walletName)) {
        that.snackBarText = "钱包名称不能为空";
        that.snackBar = true;
        return;
      }
      that.changing = true;
      setTimeout(() => {
        that.changing = false;
        that.changeNamePop = false;
        that.bitList[0].details.walletName = that.walletName;
        that.name = that.walletName;
        that.walletName = "";
        that.snackBarText = "钱包名称修改成功";
        that.snackBar = true;
      }, 1500);
    },
    changeName() {
      this.leftDrawer = false;
      this.changeNamePop = true;
    },
    buyEth() {
      this.snackBarText = "功能暂未开放";
      this.snackBar = true;
    },
    goTokenIssue() {
      this.$router.push({ name: "tokenIssue" });
    },
    passwordConfirm(from) {
      let that = this;
      let password = that.bitList[0].details.walletPassword;
      that.privateKey = that.bitList[0].wallet.privateKey.substr(2);
      if (objIsNull(that.walletPassword)) {
        that.snackBarText = "请输入钱包密码";
        that.snackBar = true;
        return;
      }
      if (that.walletPassword.toString() !== password.toString()) {
        that.walletPassword = "";
        that.snackBarText = "钱包密码密码不正确";
        that.snackBar = true;
        return;
      } else {
        that.walletPassword = "";
        that.passwordConfirmPop = false;
        if (that.isFromWhere === 0) {
          that.exportPrivateKeyPop = true;
        } else {
          that.$router.push({ name: "exportKeystore" });
        }
      }
    },
    doCopy() {
      let that = this;
      that.copying = true;
      setTimeout(() => {
        that.$copyText(that.privateKey).then(
          function(e) {
            setTimeout(() => {
              that.copying = false;
              that.exportPrivateKeyPop = false;
              that.snackBarText = "私钥已复制";
              that.snackBar = true;
            }, 500);
          },
          function(e) {
            that.copying = false;
            console.log(e);
          }
        );
      }, 1000);
    },
    goDetails(token, contract) {
      let reToken = token.toUpperCase();
      this.$router.push({
        path: "bitDetails",
        query: {
          token: reToken,
          contract: contract
        }
      });
    },
    swipe(direction) {
      if (!this.loadingTop) {
        this.getBitList();
      }
    },
    onButtonClick() {
      this.scanShow = true;
    },
    goTab() {
      this.$router.push({ name: "transaction" });
    },
    cancelShow() {
      this.scanShow = false;
    },
    goScan() {
      let target = event.currentTarget;
      target.classList.add("scanClick");
      setTimeout(() => {
        this.$router.push({ path: "scan", query: { way: 0 } });
      }, 200);
    },
    openMenu() {
      this.leftDrawer = true;
    },
    showScan(token) {
      this.token = token.toUpperCase();
      this.QRval = generateQRtxt(0, this.token);
      this.scanShow = true;
    },
    transfer(token) {
      let reToken = token.toUpperCase();
      let transfer = {
        address: "",
        amount: 0,
        token: reToken
      };
      this.$store.commit("SET_TRANSFER", transfer);
      this.$router.push({ name: "transfer" });
    },
    getEthBalance() {
      let that = this;
      let provider = that.ethers.providers.getDefaultProvider(that.provider);
      return new Promise((resolve, reject) => {
        provider.getBalance(that.address).then(function(balance) {
          let etherString = that.ethers.utils.formatEther(balance);
          let balance_eth = parseFloat(etherString).toFixed(3);
          that.$store.commit("SET_BALANCE", balance_eth);
          resolve(balance_eth);
        });
      });
    },
    async getBitList() {
      let that = this;
      this.loadingTop = true;
      if (objIsNull(that.tokenData)) {
        that.tokenData = await that.getCurrencyList();
      }
      let tokenList = that.tokenData.tokenList;
      let isFirstIn = that.bitList[0].isFirstIn;
      let ethItem = {};
      let homeList = [];
      ethItem.token = "ETH";
      ethItem.contract = "0x";
      ethItem.name = "Ether";
      ethItem.sort = that.tokenData.ext.ethSort;
      ethItem.balance = await that.getEthBalance();
      ethItem.icon =
        "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1730342955,191148670&fm=27&gp=0.jpg";
      homeList.push(ethItem);
      if (isFirstIn) {
        let localList = [];
        for (let i = 0, len = tokenList.length; i < len; i++) {
          let localItem = {};
          if (tokenList[i].isOpen) {
            localItem.isOpen = true;
            let homeItem = {};
            let decimals = await that.getErcDecimals(tokenList[i].contract);
            let oldBalance = await that.getErcBalance(tokenList[i].contract);
            let val = Math.pow(10, decimals);
            let balance = (oldBalance / val).toFixed(3);
            homeItem.token = tokenList[i].token;
            homeItem.name = tokenList[i].name;
            homeItem.sort = tokenList[i].sort;
            homeItem.contract = tokenList[i].contract;
            homeItem.balance = balance;
            homeItem.icon = tokenList[i].icon;
            homeList.push(homeItem);
          } else {
            localItem.isOpen = false;
          }
          localItem.token = tokenList[i].token;
          localList.push(localItem);
        }
        that.bitList[0].bitList = localList;
      } else {
        let list = that.bitList[0].bitList;
        let currencyLen = tokenList.length;
        let localList = [];
        for (let i = 0; i < currencyLen; i++) {
          let localItem = {};
          localItem.isOpen = false;
          for (let j = 0; j < list.length; j++) {
            if (list[j].token == tokenList[i].token) {
              localItem.isOpen = list[j].isOpen;
              break;
            }
          }
          localItem.token = tokenList[i].token;
          localList.push(localItem);
        }
        that.bitList[0].bitList = localList;

        for (let i = 0, len = tokenList.length; i < len; i++) {
          if (localList[i].isOpen) {
            for (let j = 0, len = tokenList.length; j < len; j++) {
              if (tokenList[j].token == localList[i].token) {
                let homeItem = {};
                let decimals = await that.getErcDecimals(tokenList[j].contract);
                let oldBalance = await that.getErcBalance(
                  tokenList[j].contract
                );
                let val = Math.pow(10, decimals);
                let balance = (oldBalance / val).toFixed(3);
                homeItem.token = tokenList[j].token;
                homeItem.name = tokenList[j].name;
                homeItem.sort = tokenList[j].sort;
                homeItem.contract = tokenList[j].contract;
                homeItem.balance = balance;
                homeItem.icon = tokenList[j].icon;
                homeList.push(homeItem);
                break;
              }
            }
          }
        }
      }
      that.homeList = homeList.sort(that.sortTokenList("sort"));
      that.$nextTick(() => {
        that.scroll = new BScroll(that.$refs.bitList, {
          click: true
        });
      });
      if (that.loadingTop) {
        that.loadingTop = false;
      }
    },
    getErcDecimals(contractAddress) {
      let that = this;
      let provider = that.ethers.providers.getDefaultProvider(that.provider);
      let contract = new that.ethers.Contract(contractAddress, abi, provider);
      return new Promise((resolve, reject) => {
        contract.decimals().then(function(decimals) {
          let val = decimals;
          resolve(val);
        });
      });
    },
    getErcBalance(contractAddress) {
      let that = this;
      let provider = that.ethers.providers.getDefaultProvider(that.provider);
      let contract = new that.ethers.Contract(contractAddress, abi, provider);
      return new Promise((resolve, reject) => {
        contract.balanceOf(that.address).then(function(balance) {
          let bal = balance.toString();
          resolve(bal);
        });
      });
    },
    addBit() {
      this.$router.push({ name: "addBit" });
    },
    getCurrencyList() {
      let that = this;
      return new Promise((resolve, reject) => {
        that.$axios
          .get(that.Api + that.currencyList, {
            params: {
              rand: new Date().getTime()
            }
          })
          .then(function(res) {
            resolve(res.data);
          })
          .catch(function(error) {
            console.log(error);
          });
      });
    },
    sortTokenList(property) {
      return function(obj1, obj2) {
        let value1 = obj1[property];
        let value2 = obj2[property];
        return value1 - value2; // 升序
      };
    },
    confirmPassword(from) {
      let that = this;
      that.leftDrawer = false;
      that.passwordConfirmPop = true;
      if (from === 0) {
        if (that.isFromWhere !== 0) {
          that.isFromWhere = 0;
        }
      } else if (from === 1) {
        if (that.isFromWhere !== 1) {
          that.isFromWhere = 1;
        }
      }
    },
    testPlace() {
      let that = this;
      // let privateKey = that.bitList[0].wallet.privateKey;
      // let provider = new that.ethers.providers.EtherscanProvider(that.provider);
      let provider = that.ethers.providers.getDefaultProvider(that.provider);
      // let wallet = new that.ethers.Wallet(privateKey, provider);
      that.$axios
        .get(that.netAddress, {
          params: {
            module: "account",
            action: "txlist",
            address: that.myAddress,
            startblock: 0,
            endblock: "pending",
            page: that.pageNumber,
            offset: that.pageSize,
            sort: "desc",
            apikey: that.ApiKeyToken
          }
        })
        .then(function(res) {
          

        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  computed: {
    ...mapState(["balance"])
  },
  components: {
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    Popup
  }
};
</script>

<style lang="less" scoped>
@import "./home.less";
.swipe-enter-active,
.swipe-leave-active {
  transition: opacity 0.5s;
}
.swipe-enter, .swipe-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
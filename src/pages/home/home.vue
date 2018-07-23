<template>
  <div class="home">
        <div class="wavesBox fadeInDown animated">
            <div class="box-bg">
            </div>
            <div class="view">
              <img @click="openMenu" src="./more.png" class="menu">
              <img @click="goScan" src="./scan.png" class="scan">
              <img class="logo" src="../../assets/images/default.png">
              <p class="name">{{name}}</p>
              <p class="code">{{address}}</p>
              <img class="qc" @click="goTab" src="../../assets/images/qc.svg">
              <div class="add" @click="addBit">
                +
              </div>
              <!-- <div class="money"><span>总资产($)</span><span>&asymp;</span><span>{{balance}}</span></div> -->
            </div>
        </div>
        <div class="bitList fadeInUp animated">
          <swipeout>
            <swipeout-item :key="index" v-for="(item,index) in erc20BalanceList" @on-close="handleEvents('on-close')" @on-open="handleEvents('on-open')" transition-mode="follow">
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
              <div class="list-item2 item" v-ripple slot="content">
                <p class="name">{{item.token}}</p>
                <div class="logo">
                  <img src="../../assets/images/logo.png">
                </div>
                <div class="money">
                  <p>{{item.balance}} {{item.token.toLowerCase()}}</p>
                  <!-- <p>-</p> -->
                </div>
              </div>
            </swipeout-item>
          </swipeout>
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
        <v-navigation-drawer class="leftDrawer" v-model="leftDrawer" fixed temporary>
          <div class="leftView">
            <div class="head">
              <img class="avatar" src="../../assets/images/default.png"> 
              <p>{{name}}</p>
              <p>{{address}}</p>
            </div>
            <div class="view-list">
              <div class="view-item" v-ripple>
                <img src="./rename.png">
                <span>编辑钱包名称</span>
              </div>
              <div class="view-item" v-ripple>
                <img src="./password.png">
                <span>钱包密码修改</span>
              </div>
              <div class="view-item" v-ripple>
                <img src="./export.png">
                <span>导出私钥</span>
              </div>
              <div class="view-item" v-ripple>
                <img src="./keystore.png">
                <span>导出KeyStore</span>
              </div>
            </div>
          </div>
        </v-navigation-drawer>
  </div>
</template>

<script>
import {
  Swiper,
  SwiperItem,
  Swipeout,
  SwipeoutItem,
  SwipeoutButton,
  Popup
} from "vux";
import { mapState } from "vuex";
import {
  getStore,
  generateQRtxt,
  transferEth,
  generateData,
  getErc20Balance,
  setStore
} from "@/config/utils";
import abi from "@/config/abi";
import currencyList from "@/config/currencyList";
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
      balance_gtk: 0,
      erc20BalanceList: [],
      token: "ETH",
      bitList: []
    };
  },
  mounted() {
    let that = this;
    that.$store.commit("SET_TAB", 0);
    let walletList = JSON.parse(getStore("walletList"));
    that.address = walletList[0].wallet.address;
    that.name = walletList[0].details.walletName;
    that.getEthBalance("rinkeby");
    that.getGTKBalance();
    that.getErcBalance("rinkeby");
    // let provider = that.ethers.providers.getDefaultProvider("rinkeby");

    // var provider = new that.ethers.providers.EtherscanProvider("rinkeby");
    // provider.getHistory(that.address).then(function(history) {
    //   console.log(history);
    // });

    // let provider = that.ethers.providers.getDefaultProvider("homestead");

    // provider.getTransactionCount(that.address).then(function(transactionCount) {
    //   console.log("Total Transactions Ever Send: " + transactionCount);
    // });

    // 获取燃油价格
    // provider.getGasPrice().then(function(gasPrice) {
    //   let gasPriceString = gasPrice.toString();

    //   console.log("Current gas price: " + gasPriceString);
    // });

    // 获取erc20 token 余额
    // let token = "0x78A413Dc24E7e8cb41f66D7f1e2CB400bE012dbc";
    // getErc20Balance(token, this.address).then(function(result) {
    //   let balance = result.toNumber() / 100000000;
    //   console.log(balance);
    // });

    // 生成交易 erc20 token 所需data
    // let address = "0x512d7759bc92018928149f082dfe9EF74FEB2EA4";
    // let money = "500";
    // let data = generateData(address, money);
    // console.log(data);

    //交易 eth
    // let targetAddress = "0x512d7759bc92018928149f082dfe9EF74FEB2EA4";
    // let amount = "0.1";
    // transferEth(privateKey, "rinkeby", targetAddress, amount).then(function(
    //   hx
    // ) {
    //   console.log("交易成功: ", hx);
    // });

    // let provider1 = new this.ethers.providers.EtherscanProvider();
    // provider1.getEtherPrice().then(function(price) {
    //   console.log("Ether price in USD: " + price);
    // });
  },
  beforeDestroy() {
    let that = this;
    that.bitList[0].isFirstIn = true;
    setStore("walletList", that.bitList);
  },
  methods: {
    onButtonClick() {
      this.scanShow = true;
    },
    handleEvents(type) {
      // console.log("event: ", type);
    },
    goTab() {
      this.$router.push({ name: "transaction" });
    },
    cancelShow() {
      this.scanShow = false;
    },
    goScan() {
      this.$router.push({ name: "scan" });
    },
    openMenu() {
      this.leftDrawer = true;
    },
    showScan(token) {
      this.token = token;
      if (token == "ETH") {
        this.QRval = generateQRtxt(0, "ETH");
      }
      if (token == "GTK") {
        this.QRval = generateQRtxt(0, "GTK");
      }
      this.scanShow = true;
    },
    transfer(token) {
      if (token == "ETH") {
        let transfer = {
          address: "",
          amount: 0,
          token: "ETH"
        };
        this.$store.commit("SET_TRANSFER", transfer);
      }
      if (token == "GTK") {
        let transfer = {
          address: "",
          amount: 0,
          token: "GTK"
        };
        this.$store.commit("SET_TRANSFER", transfer);
      }
      this.$router.push({ name: "transfer" });
    },
    getEthBalance(providerName) {
      let that = this;
      let provider = that.ethers.providers.getDefaultProvider(providerName);
      provider.getBalance(that.address).then(function(balance) {
        let etherString = that.ethers.utils.formatEther(balance);
        that.$store.commit("SET_BALANCE", etherString);
        that.balance_eth = etherString;
        console.log("Balance: " + etherString);
      });
    },
    getGTKBalance() {
      let that = this;
      let provider = that.ethers.providers.getDefaultProvider("rinkeby");
      let token = "0x78A413Dc24E7e8cb41f66D7f1e2CB400bE012dbc";
      let contract = new that.ethers.Contract(token, abi, provider);
      contract.balanceOf(that.address).then(function(balance) {
        that.balance_gtk = balance.toNumber() / 100000000;
      });
    },
    getErcBalance(providerName) {
      let that = this;
      that.bitList = JSON.parse(getStore("walletList"));
      let isFirstIn = that.bitList[0].isFirstIn;
      let bitList = that.bitList[0].bitList;
      let provider = that.ethers.providers.getDefaultProvider(providerName);
      for (let i = 0, len = currencyList.length; i < len; i++) {
        if (i === 0) {
          provider.getBalance(that.address).then(function(balance) {
            let item = {};
            let etherString = that.ethers.utils.formatEther(balance);
            item.balance = etherString;
            item.token = currencyList[i].token;
            that.$store.commit("SET_BALANCE", etherString);
            that.erc20BalanceList.push(item);
          });
        } else {
          // console.log(that.erc20BalanceList[i]);
          let token = currencyList[i].contract;
          let contract = new that.ethers.Contract(token, abi, provider);
          let item = {};
          contract.balanceOf(that.address).then(function(balance) {
            let item = {};
            let bal = (balance.toNumber() / 100000000).toFixed(3);
            // console.log(bal);
            if (!isFirstIn) {
              if (bal > 0) {
                item.balance = bal;
                item.token = currencyList[i].token;
                that.bitList[0].bitList[i].isOpen = true;
                that.erc20BalanceList.push(item);
              }
            } else {
              console.log(bitList[i - 1].isOpen);
              if (bitList[i - 1].isOpen) {
                item.balance = 0.0;
                item.token = currencyList[i].token;
                that.erc20BalanceList.push(item);
              }
            }
          });
        }
      }
      // console.log(that.bitList);
    },
    addBit() {
      this.$router.push({ name: "addBit" });
    }
  },
  computed: {
    ...mapState(["balance"])
  },
  components: {
    Swiper,
    SwiperItem,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    Popup
  }
};
</script>

<style lang="less" scoped>
@import "./home.less";
</style>
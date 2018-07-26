<template>
  <div class="home">
        <div class="wavesBox fadeInDown animated">
            <div class="box-bg">
            </div>
            <div v-ripple class="view">
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
            <swipeout-item class="moveItem flipInX animated" transition-mode="follow">
              <div slot="right-menu">
                <swipeout-button class="transaction" @click.native="transfer('ETH')">
                  <img src="./transaction.png">
                  <p>转账</p>
                </swipeout-button>
                <swipeout-button class="receipt" @click.native="showScan('ETH')">
                  <img src="./shoukuan.png">
                  <p>收款</p>
                </swipeout-button>
              </div>
              <div @click="goDetails('ETH')" class="list-item2 item" v-ripple slot="content">
                <p class="name">ETH</p>
                <div class="logo">
                  <img src="../../assets/images/logo.png">
                </div>
                <div class="money">
                  <p>&asymp; {{balance_eth}} eth</p>
                </div>
              </div>
            </swipeout-item>
            <swipeout-item class="moveItem flipInX animated" :key="index" v-for="(item,index) in erc20BalanceList" transition-mode="follow">
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
              <div @click="goDetails(item.token)" class="list-item2 item" v-ripple slot="content">
                <p class="name">{{item.token}}</p>
                <div class="logo">
                  <img src="../../assets/images/logo.png">
                </div>
                <div class="money">
                  <p>&asymp; {{item.balance}} {{item.token?item.token.toLowerCase():''}}</p>
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
            <div v-ripple class="head">
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
              <div class="view-item" v-ripple>
                <img src="./sign.png">
                <span>通证发行</span>
              </div>
              <div class="view-item" v-ripple>
                <img src="./buyeth.png">
                <span>ETH购买</span>
              </div>
            </div>
          </div>
        </v-navigation-drawer>
  </div>
</template>

<script>
import { Swipeout, SwipeoutItem, SwipeoutButton, Popup } from "vux";
import { mapState } from "vuex";
import { getStore, generateQRtxt, setStore, objIsNull } from "@/config/utils";
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
      erc20BalanceList: [],
      token: "ETH",
      bitList: [],
      loadingStaus: false
    };
  },
  mounted() {
    let that = this;
    that.$store.commit("SET_TAB", 0);
    that.bitList = JSON.parse(getStore("walletList"));
    that.address = that.bitList[0].wallet.address;
    that.name = that.bitList[0].details.walletName;
    that.getEthBalance(that.provider);
    that.getErcBalance(that.provider);
  },
  beforeDestroy() {
    let that = this;
    that.bitList[0].isFirstIn = false;
    setStore("walletList", that.bitList);
  },
  methods: {
    goDetails(token) {
      let reToken = token.toUpperCase();
      this.$router.push({
        path: "bitDetails",
        query: {
          token: reToken
        }
      });
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
      this.$router.push({ name: "scan" });
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
    getEthBalance(providerName) {
      let that = this;
      let provider = that.ethers.providers.getDefaultProvider(providerName);
      provider.getBalance(that.address).then(function(balance) {
        let etherString = that.ethers.utils.formatEther(balance);
        console.log("未留小数" + etherString);
        that.balance_eth = parseFloat(etherString).toFixed(3);
        console.log("ETH Balance: " + that.balance_eth);
        that.$store.commit("SET_BALANCE", that.balance_eth);
      });
    },
    getErcBalance(providerName) {
      let that = this;
      let provider = that.ethers.providers.getDefaultProvider(providerName);
      let isFirstIn = that.bitList[0].isFirstIn;
      let bitList = [];
      for (let i = 0, len = currencyList.length; i < len; i++) {
        let token = currencyList[i].contract;
        let contract = new that.ethers.Contract(token, abi, provider);
        contract.balanceOf(that.address).then(function(balance) {
          let bal = (balance.toNumber() / 100000000).toFixed(3);
          console.log(currencyList[i].token + "余额：" + bal);
          let item = {};
          let bitItem = {};
          bitItem.token = currencyList[i].token;
          if (isFirstIn) {
            if (bal > 0) {
              bitItem.isOpen = true;
              item.balance = bal;
              item.token = currencyList[i].token;
            } else {
              bitItem.isOpen = false;
            }
            bitList.push(bitItem);
            that.bitList[0].bitList = bitList;
          } else {
            if (!objIsNull(that.bitList[0].bitList)) {
              if (
                !objIsNull(that.bitList[0].bitList[i]) &&
                that.bitList[0].bitList[i].isOpen
              ) {
                if (bal > 0) {
                  item.balance = bal;
                  item.token = currencyList[i].token;
                } else {
                  item.balance = "0.000";
                  item.token = currencyList[i].token;
                }
              }
            }
          }
          if (Object.keys(item).length != 0) {
            that.erc20BalanceList.push(item);
          }
        });
      }
    },
    addBit() {
      this.$router.push({ name: "addBit" });
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
</style>
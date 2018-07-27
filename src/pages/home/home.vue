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
          <div class="box" ref="bitList">
              <swipeout>
                <div class="pullDown">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 500 500" xml:space="preserve">
                    <g>
                      <path class="logoLine" fill-rule="evenodd" clip-rule="evenodd" fill="none" d="M172.6,249v20.3c-3.5,3.1-7.2,5.4-11,7c-3.8,1.6-7.8,2.3-11.8,2.3c-9,0-16.2-2.9-21.8-8.7c-5.6-5.8-8.3-13.4-8.3-22.9
                        c0-9,2.8-16.5,8.4-22.5s12.5-9,20.8-9c5,0,9.4,1,13.1,3.1s6.8,5.2,9.2,9.3l-3.6,2.5c-1.9-3.7-4.2-6.4-6.9-8.2
                        c-2.7-1.8-5.9-2.7-9.5-2.7c-6,0-10.8,2.5-14.3,7.5c-3.5,5-5.3,11.8-5.3,20.4c0,8.3,1.7,14.7,5.1,19.3c3.4,4.6,8.1,6.9,14.1,6.9
                        c2.3,0,4.5-0.4,6.6-1.1c2-0.7,3.8-1.8,5.2-3.2V249H172.6z"/>
                      <path class="logoLine" fill-rule="evenodd" clip-rule="evenodd" fill="none" d="M183.4,244.8c0-2.9,0.5-4.9,1.4-5.8c0.9-0.9,2.9-1.4,6-1.4h18.8v3.4h-13.5c-1.6,0-2.6,0.2-3.2,0.7
                        c-0.5,0.5-0.8,1.3-0.8,2.5v10h14.3v3.9h-14.3v12.6c0,1.2,0.3,2,0.8,2.5c0.5,0.4,1.8,0.7,3.8,0.7h13.3v3.4h-20.7
                        c-2.2,0-3.8-0.5-4.7-1.4c-0.9-0.9-1.3-2.8-1.3-5.7V244.8z"/>
                      <path class="logoLine" fill-rule="evenodd" clip-rule="evenodd" fill="none" d="M219.4,244.8c0-2.9,0.5-4.9,1.4-5.8c0.9-0.9,2.9-1.4,6-1.4h18.8v3.4h-13.5c-1.6,0-2.7,0.2-3.2,0.7
                        c-0.5,0.5-0.8,1.3-0.8,2.5v10h14.3v3.9h-14.3v12.6c0,1.2,0.3,2,0.8,2.5c0.5,0.4,1.8,0.7,3.8,0.7h13.3v3.4h-20.7
                        c-2.2,0-3.8-0.5-4.7-1.4c-0.9-0.9-1.3-2.8-1.3-5.7V244.8z"/>
                      <path class="logoLine" fill-rule="evenodd" clip-rule="evenodd" fill="none" d="M276.6,269.5c-1,3.7-2.1,6.1-3.2,7.2c-1.1,1.2-2.6,1.7-4.5,1.7c-1.9,0-3.5-0.7-4.7-2s-2.3-3.6-3.2-6.9l-9.4-31.9h9l10,34.4
                        c0.1,0.3,0.2,0.5,0.5,0.7c0.2,0.2,0.4,0.3,0.7,0.3c0.2,0,0.4-0.1,0.6-0.3c0.2-0.1,0.3-0.4,0.4-0.6l3.9-14l-6-20.5h9l10,34.4
                        c0.1,0.3,0.2,0.5,0.4,0.7c0.2,0.2,0.4,0.2,0.6,0.2c0.2,0,0.5-0.1,0.7-0.3c0.2-0.2,0.4-0.4,0.5-0.7l10-34.4h3.6l-9.3,31.8
                        c-1,3.4-2.1,5.7-3.2,7s-2.7,2-4.7,2c-1.9,0-3.5-0.6-4.7-1.9c-1.2-1.3-2.3-3.6-3.3-7l-1.7-5.5L276.6,269.5z"/>
                      <path class="logoLine" fill-rule="evenodd" clip-rule="evenodd" fill="none" d="M312.8,244.8c0-2.9,0.5-4.9,1.4-5.8c0.9-0.9,2.9-1.4,6-1.4H339v3.4h-13.5c-1.6,0-2.7,0.2-3.2,0.7c-0.5,0.5-0.8,1.3-0.8,2.5
                        v10h14.3v3.9h-14.3v12.6c0,1.2,0.3,2,0.8,2.5c0.5,0.4,1.8,0.7,3.8,0.7h13.3v3.4h-20.7c-2.2,0-3.8-0.5-4.7-1.4
                        c-0.9-0.9-1.3-2.8-1.3-5.7V244.8z"/>
                      <path class="logoLine" fill-rule="evenodd" clip-rule="evenodd" fill="none" d="M357.5,277.2h-8.8v-39.5h15.9c4.9,0,8.7,0.9,11.2,2.8c2.6,1.9,3.8,4.6,3.8,8.1c0,2.6-0.8,4.7-2.3,6.3
                        c-1.5,1.7-3.6,2.6-6.3,3l10.2,19.3h-10.5l-9.4-19.7c3.2-0.1,5.5-0.7,7-2c1.5-1.3,2.2-3.2,2.2-5.9c0-2.9-0.7-5.1-2.2-6.5
                        c-1.5-1.4-3.7-2.1-6.8-2.1h-4.1V277.2z"/>
                    </g>
                  </svg>
                </div>
                <swipeout-item v-for="(n,index) in 10" :key="index+50" class="moveItem flipInX animated" transition-mode="follow">
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
                      <p>&asymp; {{balance_eth}} ether</p>
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
              <img src="./left-header.png" class="left-bg">
              <div class="left-box">
                  <img class="avatar" src="../../assets/images/default.png"> 
                  <p>{{name}}</p>
                  <p>{{address}}</p>
              </div>
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
import BScroll from "better-scroll";
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
    that.$nextTick(() => {
      that.scroll = new BScroll(that.$refs.bitList, {
        click: true,
        pullDownRefresh: {
          threshold: 50
        }
      });
      that.scroll.on("pullingDown", () => {
        console.log("下拉");
      });
    });
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
      let target = event.currentTarget;
      target.classList.add("scanClick");
      setTimeout(() => {
        this.$router.push({ name: "scan" });
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
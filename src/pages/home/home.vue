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
              <div class="money"><span>总资产($)</span><span>&asymp;</span><span>{{balance}}</span></div>
            </div>
        </div>
        <div class="bitList fadeInUp animated">
          <swipeout>
            <swipeout-item @on-close="handleEvents('on-close')" @on-open="handleEvents('on-open')" transition-mode="follow">
              <div slot="right-menu">
                <swipeout-button class="transaction" @click.native="transfer">
                  <img src="./transaction.png">
                  <p>转账</p>
                </swipeout-button>
                <swipeout-button class="receipt" @click.native="showScan">
                  <img src="./shoukuan.png">
                  <p>收款</p>
                </swipeout-button>
              </div>
              <div class="list-item2 item" v-ripple slot="content">
                <p class="name">ETH</p>
                <div class="logo">
                  <img src="../../assets/images/logo.png">
                </div>
                <div class="money">
                  <p>0.00</p>
                  <p>-</p>
                </div>
              </div>
            </swipeout-item>
            <swipeout-item @on-close="handleEvents('on-close')" @on-open="handleEvents('on-open')" transition-mode="follow">
              <div slot="right-menu">
                <swipeout-button class="transaction" @click.native="transfer">
                  <img src="./transaction.png">
                  <p>转账</p>
                </swipeout-button>
                <swipeout-button class="receipt" @click.native="showScan(1)">
                  <img src="./shoukuan.png">
                  <p>收款</p>
                </swipeout-button>
              </div>
              <div class="list-item3 item" v-ripple slot="content">
                <p class="name">GTH</p>
                <div class="logo">
                  <img src="../../assets/images/logo.png">
                </div>
                <div class="money">
                  <p>0.00</p>
                  <p>-</p>
                </div>
              </div>
            </swipeout-item>
          </swipeout>
        </div>
        <popup hide-on-deactivated is-transparent v-model="scanShow" position="bottom">
          <div class="scanView">
            <div class="top">
              <span>ETH转账</span>
              <span @click="cancelShow">取消</span>
            </div>
            <qrcode class="qrcode" :value="QRval" tag="img" :options="{ size: 200 }"></qrcode>
            <p class="tip">(正在使用ETH货币进行收款)</p>
          </div>
        </popup>
        <v-navigation-drawer v-model="leftDrawer" fixed dark temporary>
          1
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
import { getStore, generateQRtxt } from "@/config/utils";
export default {
  name: "home",
  data() {
    return {
      address: "",
      name: "",
      scanShow: false,
      QRval: "GeeWer",
      leftDrawer: false
    };
  },
  created() {
    let that = this;
    let walletList = JSON.parse(getStore("walletList"));
    that.address = walletList[0].wallet.address;
    that.name = walletList[0].details.walletName;
    let provider = that.ethers.providers.getDefaultProvider("rinkeby");
    // let provider = that.ethers.providers.getDefaultProvider("homestead");
    provider.getBalance(that.address).then(function(balance) {
      let etherString = that.ethers.utils.formatEther(balance);
      that.$store.commit("SET_BALANCE", etherString);
      console.log("Balance: " + etherString);
    });
    provider.getTransactionCount(that.address).then(function(transactionCount) {
      console.log("Total Transactions Ever Send: " + transactionCount);
    });

    provider.getGasPrice().then(function(gasPrice) {
      let gasPriceString = gasPrice.toString();

      console.log("Current gas price: " + gasPriceString);
    });
  },
  mounted() {
    this.$store.commit("SET_TAB", 0);
    console.log(this.$router.options);
  },
  methods: {
    onButtonClick() {
      this.scanShow = true;
    },
    handleEvents(type) {
      console.log("event: ", type);
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
    showScan(index) {
      if (index === 1) {
        this.QRval = generateQRtxt(100, "GTH");
      }
      this.scanShow = true;
    },
    transfer() {
      this.$router.replace({ name: "transfer" });
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
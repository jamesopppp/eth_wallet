<template>
  <div class="home">
        <div class="wavesBox fadeInDown animated">
            <div class="box-bg">
            </div>
            <div class="view">
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
                <swipeout-button class="transaction" @click.native="onButtonClick()">
                  <img src="./transaction.png">
                  <p>转账</p>
                </swipeout-button>
                <swipeout-button class="receipt" @click.native="onButtonClick()">
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
          </swipeout>
        </div>
  </div>
</template>

<script>
import {
  Swiper,
  SwiperItem,
  Swipeout,
  SwipeoutItem,
  SwipeoutButton
} from "vux";
import { mapState } from "vuex";
import { getStore } from "@/config/utils";
export default {
  name: "home",
  data() {
    return {
      address: "",
      name: ""
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
  },
  methods: {
    onButtonClick() {
      this.$router.push({ name: "scan" });
    },
    handleEvents(type) {
      console.log("event: ", type);
    },
    goTab() {
      this.$router.push({ name: "transaction" });
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
    SwipeoutButton
  }
};
</script>

<style lang="less" scoped>
@import "./home.less";
</style>
<template>
  <div class="home">
    <swiper :show-dots="false" @on-index-change="onSwiperItemIndexChange" v-model="swiperItemIndex">
      <swiper-item>
        <div class="wavesBox fadeInDown animated">
            <div class="box-bg">
            </div>
            <div class="view">
              <img class="logo" src="../../assets/images/default.png">
              <p class="name">James</p>
              <p class="code">{{address}}</p>
              <img class="qc" @click="goTab" src="../../assets/images/qc.svg">
              <div class="money"><span>总资产($)</span><span>&asymp;</span><span>{{balance}}</span></div>
            </div>
        </div>
        <div class="bitList fadeInUp animated">
          <div class="list-item" v-ripple>
            <p class="name">HLC</p>
            <div class="logo">
              <img src="../../assets/images/logo.png">
            </div>
            <div class="money">
              <p>0.00</p>
              <p>&asymp;$0</p>
            </div>
          </div>
          <div class="list-item" v-ripple>
            <p class="name">ETH</p>
            <div class="logo">
              <img src="../../assets/images/logo.png">
            </div>
            <div class="money">
              <p>0.00</p>
              <p>-</p>
            </div>
          </div>
          <div class="list-item" v-ripple>
            <p class="name">LXT</p>
            <div class="logo">
              <img src="../../assets/images/logo.png">
            </div>
            <div class="money">
              <p>0.00</p>
              <p>-</p>
            </div>
          </div>
          <div class="list-item" v-ripple>
            <p class="name">BCX</p>
            <div class="logo">
              <img src="../../assets/images/logo.png">
            </div>
            <div class="money">
              <p>0.00</p>
              <p>&asymp;$0</p>
            </div>
          </div>
        </div>
      </swiper-item>
      <swiper-item>
        2
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperItem } from "vux";
import { mapState } from "vuex";
import { getStore } from "@/config/utils";
export default {
  name: "home",
  data() {
    return {
      address: "",
      swiperItemIndex: 0
    };
  },
  watch: {
    homeSwipt(val) {
      console.log(this.homeSwipt);
    }
  },
  created() {
    let that = this;
    let wallet = JSON.parse(getStore("wallet"));
    that.address = wallet.address;
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
    goTab() {
      this.$router.push({ name: "transaction" });
    },
    onSwiperItemIndexChange(index) {
      console.log("demo item change", index);
    }
  },
  computed: {
    ...mapState(["balance"])
  },
  components: {
    Swiper,
    SwiperItem
  }
};
</script>

<style lang="less" scoped>
@import "./home.less";
</style>
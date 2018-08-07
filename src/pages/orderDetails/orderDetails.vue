<template>
  <div class="orderDetails">
      <v-header title="交易记录"></v-header>
      <div class="orderDetails-header">
      </div>
      <div class="orderDetails-view fadeInUpBig animated">
          <img src="./success.png">
          <div class="amount"><span>{{amount}}</span> <span>{{token}}</span></div>
          <div class="form">
              <div class="form-item">
                  <p>交易记录</p>
                  <p>{{amount}} {{token}}</p>
              </div>
              <div class="form-item">
                  <p>发款方</p>
                  <p>{{from}}</p>
              </div>
              <div class="form-item">
                  <p>收款方</p>
                  <p>{{to}}</p>
              </div>
              <div class="form-item">
                  <p>矿工费用</p>
                  <p>{{gasAmount}} ether</p>
              </div>
          </div>
          <p class="numberTitle">交易号: <span>(点击查询)</span></p>
          <div class="orderNumber"><i class="iconfont icon-sousuo"></i><p @click="goEthscan">{{orderNumber}}</p></div>
          <div class="transfromItem">
              <p>区块</p>
              <p>{{blockNumber}}</p>
          </div>
          <div class="transfromItem">
              <p>交易时间</p>
              <p>{{transactionTime}}</p>
          </div>
      </div>
  </div>
</template>

<script>
import {
  getStore,
  objIsNull,
  formartTimeStamp,
  formartTranstionData
} from "@/config/utils";
import vHeader from "@/components/common/header-bar/header-bar";
export default {
  data() {
    return {
      dataDetails: {},
      amount: 0,
      token: "ether",
      from: "",
      to: "",
      gasAmount: 0,
      orderNumber: "",
      blockNumber: 0,
      transactionTime: "",
      decimals: 8
    };
  },
  created() {
    let that = this;
    that.dataDetails = that.$route.query.data;
    that.decimals = that.$route.query.decimals;
    console.log(that.dataDetails);
    if (that.dataDetails.input.toString() === "0x") {
      console.log("ETH订单");
    } else {
      that.token = that.dataDetails.tokenName;
    }
    that.amount = that.getTransferAmount(
      that.dataDetails.value,
      that.dataDetails.input
    );
    that.from = that.dataDetails.from;
    that.to = that.dataDetails.to;
    that.gasAmount = that.ethers.utils.formatEther(
      that.dataDetails.gasPrice * that.dataDetails.gasUsed
    );
    that.orderNumber = that.dataDetails.hash;
    that.blockNumber = that.dataDetails.blockNumber;
    that.transactionTime = formartTimeStamp(that.dataDetails.timeStamp);
  },
  mounted() {},
  methods: {
    getTransferAmount(value, input) {
      let amount = 0;
      if (input.toString() === "0x") {
        amount = parseFloat(this.ethers.utils.formatUnits(value));
      } else {
        amount = formartTranstionData(input, this.decimals);
      }
      return amount;
    },
    goEthscan() {
      console.log("open");
      if (this.provider.toString() === "homestead") {
        window.location.href =
          "https://etherscan.io/tx/" + this.dataDetails.hash;
      }
      if (this.provider.toString() === "rinkeby") {
        window.location.href =
          "https://rinkeby.etherscan.io/tx/" + this.dataDetails.hash;
      }
    }
  },
  components: {
    vHeader
  },
  computed: {},
  props: {}
};
</script>
<style lang="less" scoped>
@import "./orderDetails.less";
</style>
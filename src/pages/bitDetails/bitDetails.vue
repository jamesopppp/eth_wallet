<template>
  <div class="bitDetails">
      <v-header title="交易记录"></v-header>
      <div class="bitDetails-header">
          <div class="bit-message">
              <span>{{token}}</span>
              <span>{{amount}}</span>
          </div>
      </div>
      <div class="bitDetails-view">
          <p class="list-title">交易记录</p>
          <div class="list-view">
              <div class="list-item" :key="item.nonce" v-for="(item,index) in transformList">
                  <img src="../../assets/images/default.png">
                  <div class="content">
                      <span>0x8as898s8d8as8d77as7d77asasdasdasdasdd</span>
                      <span>12日前</span>
                  </div>
                  <span class="amount">+10.000 GTK</span>
              </div>
              <p class="loadMore">加载更多</p>
          </div>
      </div>
      <div class="bottom-bar">
          <div v-ripple @click="goTransfer">
              <img src="./transfer.png">
              <span>转账</span>
          </div>
          <div v-ripple @click="showScan">
              <img src="./receipt.png">
              <span>收款</span>
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
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Popup } from "vux";
import { getStore, generateQRtxt, objIsNull } from "@/config/utils";
import vHeader from "@/components/common/header-bar/header-bar";
import currencyList from "@/config/currencyList";
import abi from "@/config/abi";
export default {
  data() {
    return {
      scanShow: false,
      QRval: "GeeWer",
      token: "ETH",
      amount: 0,
      contractAddress: "0x",
      myAddress: "",
      pageNumber: 1,
      pageSize: 19,
      transformList: {}
    };
  },
  created() {
    let that = this;
    let walletList = JSON.parse(getStore("walletList"));
    that.myAddress = walletList[0].wallet.address;
    if (!objIsNull(that.$route.query.token)) {
      that.token = that.$route.query.token;
      console.log("当前token: ", that.token);
    }
    if (that.token != "ETH") {
      that.getBalance();
      that.getErcRecord();
    } else {
      that.amount = that.balance;
    }
  },
  mounted() {},
  methods: {
    getBalance() {
      let that = this;
      for (let i = 0, len = currencyList.length; i < len; i++) {
        if (that.token == currencyList[i].token) {
          that.contractAddress = currencyList[i].contract;
          break;
        }
      }
      let walletList = JSON.parse(getStore("walletList"));
      let address = walletList[0].wallet.address;
      let provider = that.ethers.providers.getDefaultProvider(that.provider);
      let contract = new that.ethers.Contract(
        that.contractAddress,
        abi,
        provider
      );
      contract.balanceOf(address).then(function(balance) {
        let ercBalance = balance.toNumber() / 100000000;
        that.amount = ercBalance.toFixed(3);
        console.log(that.token + "余额: " + ercBalance);
      });
    },
    cancelShow() {
      this.scanShow = false;
    },
    showScan() {
      this.QRval = generateQRtxt(0, this.token);
      this.scanShow = true;
    },
    goTransfer() {
      let transfer = {
        address: "",
        amount: 0,
        token: this.token
      };
      this.$store.commit("SET_TRANSFER", transfer);
      this.$router.push({ name: "transfer" });
    },
    getErcRecord() {
      let that = this;
      that.$axios
        .get("http://api-rinkeby.etherscan.io/api", {
          params: {
            module: "account",
            action: "tokentx",
            contractaddress: that.contractAddress,
            page: that.pageNumber,
            offset: that.pageSize,
            sort: "des",
            apikey: that.ApiKeyToken
          }
        })
        .then(function(res) {
          console.log(res);
          if (res.status == 200) {
            that.transformList = res.data.result;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  components: {
    vHeader,
    Popup
  },
  computed: {
    ...mapState(["balance"])
  },
  props: {}
};
</script>
<style lang="less" scoped>
@import "./bitDetails.less";
</style>
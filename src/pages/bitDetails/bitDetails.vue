<template>
  <div class="bitDetails">
      <v-header title="交易记录"></v-header>
      <div class="bitDetails-header fadeIn animated">
          <div class="bit-message">
              <span>{{token}}</span>
              <span>{{amount}}</span>
          </div>
      </div>
      <div class="bitDetails-view">
          <p class="list-title">交易记录</p>
          <div class="list-view">
              <div @click="goDetails(item)" v-ripple class="list-item fadeInUp animated" :key="item.hash" v-for="item in transformList">
                  <img src="../../assets/images/default.png">
                  <div class="content">
                      <span>{{item.hash}}</span>
                      <span>{{getTime(item.timeStamp)}}</span>
                  </div>
                  <span class="amount">{{getAmountStatus(item.from)}} {{getTransferAmount(item.value,item.input)}} {{token=='ETH'?'ether':token}}</span>
              </div>
              <p v-show="loadOver" class="loadMore">记录已加载完毕</p>
              <p v-show="noRecord" class="loadMore">还没有交易记录哟~</p>
              <p @click="loadMoreList" v-show="loadMore" class="loadMore">加载更多</p>
              <v-progress-circular v-show="loading" class="circular" indeterminate></v-progress-circular>
          </div>
      </div>
      <div class="bottom-bar fadeInUp animated">
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
import {
  getStore,
  generateQRtxt,
  objIsNull,
  formartTimeStamp,
  formartTranstionData
} from "@/config/utils";
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
      pageSize: 8,
      transformList: [],
      loading: false,
      loadMore: false,
      noRecord: false,
      loadOver: false,
      netAddress: ""
    };
  },
  created() {
    let that = this;
    if (that.provider.toString() === "homestead") {
      that.netAddress = "http://api.etherscan.io/api";
    }
    if (this.provider.toString() === "rinkeby") {
      that.netAddress = "http://api-rinkeby.etherscan.io/api";
    }
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
      that.getAllRecord();
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
    getTime(timeStamp) {
      let date = formartTimeStamp(timeStamp);
      return date;
    },
    loadMoreList() {
      if (this.token == "ETH") {
        this.getAllRecord();
      } else {
        this.getErcRecord();
      }
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
    getAllRecord() {
      let that = this;
      that.loadMore = false;
      that.loading = true;
      that.pageSize = 20;
      that.$axios
        .get(that.netAddress, {
          params: {
            module: "account",
            action: "txlist",
            address: that.myAddress,
            startblock: 0,
            endblock: "latest",
            page: that.pageNumber,
            offset: that.pageSize,
            sort: "desc",
            apikey: that.ApiKeyToken
          }
        })
        .then(function(res) {
          console.log("ETH交易请求成功,当前pageNumber: " + that.pageNumber);
          console.log("交易result: ", res);
          setTimeout(() => {
            if (res.status == 200) {
              let data = res.data.result;
              let totalList = [];
              if (data.length != 0) {
                for (let i = 0, len = data.length; i < len; i++) {
                  if (data[i].value != 0) {
                    totalList.push(data[i]);
                  }
                }
                that.transformList = that.transformList.concat(totalList);
                that.loading = false;
                that.loadMore = true;
              } else {
                that.loading = false;
                if (that.transformList.length === 0) {
                  that.noRecord = true;
                } else {
                  that.loadOver = true;
                }
              }
              that.pageNumber++;
              console.log("筛选后result: ", totalList);
            }
          }, 1000);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getErcRecord() {
      let that = this;
      that.pageSize = 10;
      that.loadMore = false;
      that.loading = true;
      that.$axios
        .get(that.netAddress, {
          params: {
            module: "account",
            action: "tokentx",
            contractaddress: that.contractAddress,
            address: that.myAddress,
            page: that.pageNumber,
            offset: that.pageSize,
            sort: "desc",
            apikey: that.ApiKeyToken
          }
        })
        .then(function(res) {
          console.log("erc20交易请求成功,当前pageNumber: " + that.pageNumber);
          console.log("交易result: ", res);
          setTimeout(() => {
            if (res.status == 200) {
              let data = res.data.result;
              let totalList = [];
              if (data.length != 0) {
                that.transformList = that.transformList.concat(data);
                that.loading = false;
                that.loadMore = true;
              } else {
                that.loading = false;
                if (that.transformList.length === 0) {
                  that.noRecord = true;
                } else {
                  that.loadOver = true;
                }
              }
              that.pageNumber++;
              console.log("筛选后result: ", data);
            }
          }, 1000);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getTransferAmount(value, input) {
      let amount = 0;
      if (input.toString() === "0x") {
        amount = parseFloat(this.ethers.utils.formatUnits(value)).toFixed(3);
      } else {
        amount = formartTranstionData(input);
      }
      return amount;
    },
    getAmountStatus(address) {
      let status = "+";
      if (
        address.toString().toLowerCase() ===
        this.myAddress.toString().toLowerCase()
      ) {
        status = "-";
      }
      return status;
    },
    goDetails(item) {
      this.$router.push({ path: "orderDetails", query: { data: item } });
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
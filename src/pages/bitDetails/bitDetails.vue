<template>
  <div class="bitDetails" v-touch="{down: () => swipe('down')}">
      <v-header title="交易记录"></v-header>
      <div class="bitDetails-header fadeIn animated">
          <div class="bit-message">
              <span>{{token}}</span>
              <span>{{newAmount}}</span>
          </div>
          <transition name="swipe">
            <v-progress-circular v-show="loadingTop" class="circular" indeterminate></v-progress-circular>
          </transition>
      </div>
      <div class="bitDetails-view">
          <p class="list-title">交易记录</p>
          <div class="list-view" ref="itemView">
              <div @click="goDetails(item)" v-ripple class="list-item fadeInUp animated" :key="'geewer'+index+item.hash" v-for="(item,index) in transformList">
                  <img src="../../assets/images/default.png">
                  <div class="content">
                      <span>{{item.hash}}</span>
                      <span>{{getTime(item.timeStamp)}}</span>
                  </div>
                  <span class="amount">{{getAmountStatus(item.from)}} {{getTransferAmount(item.value,item.input)}} {{token=='ETH'?'ether':token}}</span>
              </div>
              <p v-show="loadOver" class="loadMore fadeInUp animated">记录已加载完毕</p>
              <p v-show="noRecord" class="loadMore fadeInUp animated">还没有交易记录哟~</p>
              <p @click="loadMoreList" v-show="loadMore" class="loadMore fadeInUp animated">加载更多</p>
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
      loadMore: false,
      noRecord: false,
      loadOver: false,
      netAddress: "",
      loadingTop: false,
      newAmount: 0,
      decimals: 8
    };
  },
  watch: {
    amount: function(newValue, oldValue) {
      var vm = this;
      function animate() {
        if (TWEEN.update()) {
          requestAnimationFrame(animate);
        }
      }
      new TWEEN.Tween({ tweeningNumber: oldValue })
        .easing(TWEEN.Easing.Quadratic.Out)
        .to({ tweeningNumber: newValue }, 2000)
        .onUpdate(function() {
          vm.newAmount = this.tweeningNumber.toFixed(3);
        })
        .start();
      animate();
    }
  },
  created() {
    let that = this;
    if (that.provider.toString() === "homestead") {
      that.netAddress = "http://api.etherscan.io/api";
    }
    if (that.provider.toString() === "rinkeby") {
      that.netAddress = "http://api-rinkeby.etherscan.io/api";
    }
    let walletList = JSON.parse(getStore("walletList"));
    that.myAddress = walletList[0].wallet.address;
    if (!objIsNull(that.$route.query.token)) {
      that.token = that.$route.query.token;
      that.contractAddress = that.$route.query.contract;
      console.log("当前token: ", that.token);
      console.log("当前contract: ", that.contractAddress);
    }
    if (that.token != "ETH") {
      let provider = that.ethers.providers.getDefaultProvider(that.provider);
      let contract = new that.ethers.Contract(
        that.contractAddress,
        abi,
        provider
      );
      contract.decimals().then(function(decimals) {
        that.decimals = decimals;
        that.getBalance();
        that.getErcRecord();
      });
    } else {
      that.amount = that.balance;
      that.getAllRecord();
    }
  },
  mounted() {},
  methods: {
    swipe() {
      let that = this;
      let val = that.$refs.itemView.scrollTop;
      if (val === 0) {
        if (!that.loadingTop) {
          that.pageNumber = 1;
          that.transformList = [];
          that.loadMore = false;
          that.noRecord = false;
          that.loadOver = false;
          if (that.token != "ETH") {
            that.getBalance();
            that.getErcRecord();
          } else {
            that.amount = that.balance;
            that.getAllRecord();
          }
        }
      }
    },
    async getBalance() {
      let that = this;
      let walletList = JSON.parse(getStore("walletList"));
      let address = walletList[0].wallet.address;
      let provider = that.ethers.providers.getDefaultProvider(that.provider);
      let contract = new that.ethers.Contract(
        that.contractAddress,
        abi,
        provider
      );
      contract.balanceOf(address).then(function(balance) {
        let ercBalance = balance.toString() / Math.pow(10, that.decimals);
        that.amount = ercBalance.toFixed(3);
        console.log(that.token + "余额: " + ercBalance);
      });
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
      that.loadingTop = true;
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
              that.pageNumber++;
              if (data.length != 0) {
                for (let i = 0, len = data.length; i < len; i++) {
                  if (data[i].value != 0) {
                    totalList.push(data[i]);
                  }
                }
                that.transformList = that.transformList.concat(totalList);
                that.loadMore = true;
                if (that.transformList.length < 8) {
                  that.getAllRecord();
                }
              } else {
                if (that.transformList.length === 0) {
                  that.noRecord = true;
                } else {
                  that.loadOver = true;
                }
              }
              console.log("筛选后result: ", totalList);
            }
            that.loadingTop = false;
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
      that.loadingTop = true;
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
              that.pageNumber++;
              if (data.length != 0) {
                that.transformList = that.transformList.concat(data);
                that.loadMore = true;
                if (data.length < 8) {
                  that.getErcRecord();
                }
              } else {
                if (that.transformList.length === 0) {
                  that.noRecord = true;
                } else {
                  that.loadOver = true;
                }
              }
              console.log("筛选后result: ", data);
            }
            that.loadingTop = false;
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
        amount = formartTranstionData(input, this.decimals);
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
      this.$router.push({
        path: "orderDetails",
        query: { data: item, decimals: this.decimals }
      });
    },
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
.swipe-enter-active,
.swipe-leave-active {
  transition: opacity 0.5s;
}
.swipe-enter, .swipe-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
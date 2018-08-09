<template>
  <div class="transfer">
      <v-header :title="token+'转账'" @goScan="goScan" :way="1" scan></v-header>
      <div class="transfer-view">
          <div class="transfer-from">
              <div class="one-line">
                  <span>收款人钱包地址</span>
                  <img @click="goContact" src="./people.png">
              </div>
              <div class="address">
                <input v-model="address" type="text" placeholder="钱包地址">
              </div>
              <div class="two-line">
                  <div>
                      <p>转账金额</p>
                      <input v-model="amount" type="text" placeholder="金额">
                  </div>
                  <div>
                      <p>备注</p>
                      <input type="text" placeholder="备注">
                  </div>
              </div>
              <div class="payTitle">
                  <span>矿工费用</span>
                  <img src="./help.png">
              </div>
              <v-slider height="60" :min="minVal" :max="maxVal" inverse-label v-model="sliderVal"></v-slider>
              <div class="slider-tip">
                  <span>慢</span>
                  <span>{{computSliderVal}} ether</span>
                  <span>快</span>
              </div>
          </div>
          <v-btn @click="submit" class="next">提交</v-btn>
      </div>
      <v-dialog content-class="transfer-success-pop" persistent max-width="220" v-model="submitPop">
          <img src="./logo.png">
          <p class="transfer-success-title">提交成功</p>
          <p class="transfer-success-content">转账申请已提交,请留意账户变动</p>
          <v-btn @click="submitTransfer" class="transfer-success-know">我知道了</v-btn>
      </v-dialog>
      <v-snackbar :timeout="1500" auto-height color="info" bottom v-model="toast">
        {{ text }}
        <v-btn dark flat @click="toast = false">
          关闭
        </v-btn>
      </v-snackbar>
      <popup hide-on-deactivated is-transparent v-model="readyPay" position="bottom">
          <div class="readyPayView">
            <div class="top">
              <span>支付详情</span>
              <span @click="readyPay=false">取消</span>
            </div>
            <div class="list">
              <div class="item">
                <span class="name">订单类型</span>
                <span class="text">转账</span>
              </div>
              <div class="item">
                <span class="name">转入地址</span>
                <span class="address">{{address}}</span>
              </div>
              <div class="item">
                <span class="name">付款钱包</span>
                <span class="address">{{myAddress}}</span>
              </div>
              <div class="item">
                <span class="name">矿工费</span>
                <div class="payMoney">
                  <p>{{computSliderVal}} ETH</p>
                  <p>Gas(25200) * Gas Price({{sliderVal.toFixed(2)}} gwei)</p>
                </div>
              </div>
              <div class="item">
                <span class="name">金额</span>
                <span class="money">{{amount}} {{token}}</span>
              </div>
            </div>
            <v-btn :disabled="loading" :loading="loading" @click="confirmPay" class="confirm">确认</v-btn>
          </div>
      </popup>
  </div>
</template>

<script>
import { Popup } from "vux";
import { objIsNull, transferEth, generateData, getStore } from "@/config/utils";
import { mapState } from "vuex";
import abi from "@/config/abi";
import vHeader from "@/components/common/header-bar/header-bar";
export default {
  data() {
    return {
      maxVal: 100,
      minVal: 1,
      sliderVal: 0,
      address: "",
      myAddress: "",
      amount: 0,
      token: "ETH",
      submitPop: false,
      toast: false,
      text: "",
      loading: false,
      ercBalance: 0,
      contractAddress: "",
      computSliderVal: 0,
      costPrice: 0,
      readyPay: false,
      willPay: 0,
      balance: 0,
      tokenList: [],
      decimals: 8
    };
  },
  created() {
    let that = this;
    if (Object.keys(that.transfer).length > 1) {
      that.address = that.transfer.address;
      that.amount = that.transfer.amount;
      that.token = that.transfer.token.toUpperCase();
    } else if (Object.keys(that.transfer).length === 1) {
      that.address = that.transfer.address;
    }
    let walletList = JSON.parse(getStore("walletList"));
    that.myAddress = walletList[0].wallet.address;
    if (that.token != "ETH") {
      that.getBalance();
    }
    that.getPrice();
    that.getEthBalance();
  },
  watch: {
    sliderVal(val) {
      this.computSliderVal = (val / Math.pow(10, 9) * 25200).toFixed(8);
      this.costPrice = this.ethers.utils.bigNumberify(val * Math.pow(10, 9));
    }
  },
  methods: {
    submitTransfer() {
      this.$router.push({ name: "home" });
    },
    goContact() {
      this.$router.push({ path: "contact", query: { select: 1 } });
    },
    goScan(way) {
      this.$router.push({ path: "scan", query: { way: way } });
    },
    getCurrencyList() {
      let that = this;
      return new Promise((resolve, reject) => {
        that.$axios
          .get(that.Api + that.currencyList, {
            params: {
              rand: new Date().getTime()
            }
          })
          .then(function(res) {
            resolve(res.data);
          })
          .catch(function(error) {
            console.log(error);
          });
      });
    },
    getEthBalance() {
      let that = this;
      let provider = that.ethers.providers.getDefaultProvider(that.provider);
      provider.getBalance(that.myAddress).then(function(balance) {
        that.balance = balance;
      });
    },
    async getBalance() {
      let that = this;
      let tokenData = await that.getCurrencyList();
      that.tokenList = tokenData.tokenList;
      for (let i = 0, len = that.tokenList.length; i < len; i++) {
        if (that.token == that.tokenList[i].token) {
          that.contractAddress = that.tokenList[i].contract;
          break;
        }
      }

      let provider = that.ethers.providers.getDefaultProvider(that.provider);
      let contract = new that.ethers.Contract(
        that.contractAddress,
        abi,
        provider
      );
      contract.decimals().then(function(decimals) {
        that.decimals = decimals;
        contract.balanceOf(that.myAddress).then(function(balance) {
          let power = that.ethers.utils.bigNumberify(Math.pow(10, 10));
          that.ercBalance = balance.mul(power);
          console.log(
            that.token +
              "余额: " +
              balance.toString() / Math.pow(10, that.decimals)
          );
        });
      });
    },
    getPrice() {
      let that = this;
      that.sliderVal = 5.68;
      that.costPrice = that.ethers.utils.formatEther(5.68 * Math.pow(10, 9));

      let provider = that.ethers.providers.getDefaultProvider(that.provider);
      provider.getGasPrice().then(function(gasPrice) {
        // gasPrice is a BigNumber; convert it to a decimal string
        let gasPriceString = gasPrice.toString();

        console.log("Current gas price: " + gasPriceString);
      });
    },
    confirmPay() {
      let that = this;
      let walletList = JSON.parse(getStore("walletList"));
      let privateKey = walletList[0].wallet.privateKey;
      let wallet = new that.ethers.Wallet(privateKey);
      let trData, transaction;
      wallet.provider = that.ethers.providers.getDefaultProvider(that.provider);
      if (that.token == "ETH") {
        console.log("ETH交易");
        transaction = {
          // gasLimit: 200000,
          to: that.address,
          data: "0x",
          gasPrice: that.costPrice,
          value: that.ethers.utils.parseEther(that.amount)
        };
        that.loading = true;
        wallet.estimateGas(transaction).then(function(gasEstimate) {
          transaction.gasLimit = gasEstimate;
          that.willPay = gasEstimate.mul(that.costPrice);
          let willAmount = that.ethers.utils.parseUnits(that.amount);
          if (that.balance.sub(that.willPay).lt(willAmount)) {
            console.log("不够余额发起支付");
            that.loading = false;
            that.readyPay = false;
            that.text = "ETH 余额不足";
            that.toast = true;
            return;
          } else {
            wallet.sendTransaction(transaction).then(function(transactionHash) {
              console.log("交易成功");
              console.log(
                "交易gasLimit: " + transactionHash.gasLimit.toNumber()
              );
              console.log(
                "交易gasPrice: " + transactionHash.gasPrice.toNumber()
              );
              that.readyPay = false;
              that.loading = false;
              that.submitPop = true;
            });
          }
        });
      } else {
        console.log(that.token + "交易");
        trData = generateData(that.address, that.amount, that.decimals);
        transaction = {
          data: trData,
          to: that.contractAddress,
          gasPrice: that.costPrice
        };
        that.loading = true;
        let willAmount = that.ethers.utils.parseUnits(that.amount);
        if (that.ercBalance.lt(willAmount)) {
          console.log("不够余额发起支付");
          that.loading = false;
          that.readyPay = false;
          that.text = that.token + " 余额不足";
          that.toast = true;
          return;
        }
        wallet.estimateGas(transaction).then(function(gasEstimate) {
          transaction.gasLimit = gasEstimate;
          that.willPay = gasEstimate.mul(that.costPrice);
          if (that.balance.lt(that.willPay)) {
            console.log("不够余额发起支付");
            that.loading = false;
            that.readyPay = false;
            that.text = "ETH 余额不足";
            that.toast = true;
            return;
          } else {
            wallet.sendTransaction(transaction).then(function(transactionHash) {
              console.log("交易成功");
              console.log(transactionHash);
              let provider = that.ethers.providers.getDefaultProvider(
                that.provider
              );
              provider
                .getTransaction(transactionHash.hash)
                .then(function(transaction) {
                  console.log(transaction);
                });
              that.readyPay = false;
              that.loading = false;
              that.submitPop = true;
            });
          }
        });
      }
    },
    submit() {
      let that = this;
      let re = /^\d+(\.\d+)?$/;
      if (objIsNull(that.address)) {
        that.text = "请输入钱包地址";
        that.toast = true;
        return;
      }
      try {
        that.address = that.ethers.utils.getAddress(that.address);
      } catch (e) {
        that.text = "钱包地址输入错误";
        that.toast = true;
        return;
      }
      if (
        that.address.toLowerCase().toString() ===
        that.myAddress.toLowerCase().toString()
      ) {
        that.text = "收款人钱包地址不能是本人";
        that.toast = true;
        return;
      }
      if (objIsNull(that.amount) || that.amount == 0) {
        that.text = "请输入转账金额";
        that.toast = true;
        return;
      }
      if (!re.test(that.amount)) {
        that.text = "转账金额格式不正确";
        that.toast = true;
        return;
      }
      if (that.isOverNumber(that.amount)) {
        that.text = "转账金额最多18位小数";
        that.toast = true;
        return;
      }
      that.readyPay = true;
    },
    isOverNumber(num) {
      let len = 0,
        flag = false;
      if (num.indexOf(".") !== -1) {
        len = num.split(".")[1].length;
      }
      if (len > 18) {
        flag = true;
      }
      return flag;
    }
  },
  components: {
    vHeader,
    Popup
  },
  computed: {
    ...mapState(["transfer"])
  },
  props: {}
};
</script>
<style lang="less" scoped>
@import "./transfer.less";
</style>
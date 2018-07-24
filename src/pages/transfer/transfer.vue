<template>
  <div class="transfer">
      <v-header :title="token+'转账'" scan></v-header>
      <div class="transfer-view">
          <div class="transfer-from">
              <div class="one-line">
                  <span>收款人钱包地址</span>
                  <img src="./people.png">
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
              <v-slider :min="minVal" :max="maxVal" inverse-label v-model="sliderVal"></v-slider>
              <div class="slider-tip">
                  <span>慢</span>
                  <span>{{computSliderVal}} ether</span>
                  <span>快</span>
              </div>
          </div>
          <v-btn :disabled="loading" :loading="loading"  @click="submit" class="next">提交</v-btn>
      </div>
      <v-dialog content-class="transfer-success-pop" persistent max-width="220" v-model="submitPop">
          <img src="./logo.png">
          <p class="transfer-success-title">提交成功</p>
          <p class="transfer-success-content">转账申请已提交,请留意账户变动</p>
          <v-btn @click="submitPop=false" class="transfer-success-know">我知道了</v-btn>
      </v-dialog>
      <v-snackbar :timeout="1500" auto-height color="info" bottom v-model="toast">
        {{ text }}
        <v-btn dark flat @click="toast = false">
          关闭
        </v-btn>
      </v-snackbar>
  </div>
</template>

<script>
import { objIsNull, transferEth, generateData, getStore } from "@/config/utils";
import { mapState } from "vuex";
import abi from "@/config/abi";
import currencyList from "@/config/currencyList";
import vHeader from "@/components/common/header-bar/header-bar";
import { createECDH } from "crypto";
export default {
  data() {
    return {
      maxVal: 100,
      minVal: 1,
      sliderVal: 0,
      address: "",
      amount: 0,
      token: "ETH",
      submitPop: false,
      toast: false,
      text: "",
      loading: false,
      ercBalance: 0,
      contractAddress: "",
      computSliderVal: 0,
      costPrice: 0
    };
  },
  created() {
    let that = this;
    if (Object.keys(that.transfer).length != 0) {
      that.address = that.transfer.address;
      that.amount = that.transfer.amount;
      that.token = that.transfer.token.toUpperCase();
    }

    if (that.token != "ETH") {
      that.getBalance();
    }
    that.getPrice();
  },
  beforeDestroy() {
    this.$store.commit("SET_TRANSFER", {});
  },
  watch: {
    sliderVal(val) {
      this.computSliderVal = (val / Math.pow(10, 9) * 25200).toFixed(8);
      this.costPrice = this.ethers.utils.bigNumberify(val * Math.pow(10, 9));
      console.log(val * Math.pow(10, 9));
    }
  },
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
        that.ercBalance = balance.toNumber() / 100000000;
        console.log(that.token + "余额: " + that.ercBalance);
      });
    },
    getPrice() {
      let that = this;
      that.sliderVal = 5.68;
      that.costPrice = that.ethers.utils.formatEther(5.68 * Math.pow(10, 9));

      let provider = that.ethers.providers.getDefaultProvider();
      provider.getGasPrice().then(function(gasPrice) {
        // gasPrice is a BigNumber; convert it to a decimal string
        let gasPriceString = gasPrice.toString();

        console.log("Current gas price: " + gasPriceString);
      });
    },
    submit() {
      let that = this;
      if (objIsNull(that.address)) {
        that.text = "请输入钱包地址";
        that.toast = true;
        return;
      }
      if (objIsNull(that.amount) || that.amount == 0) {
        that.text = "请输入转账金额";
        that.toast = true;
        return;
      }
      let walletList = JSON.parse(getStore("walletList"));
      let privateKey = walletList[0].wallet.privateKey;
      let address = walletList[0].wallet.address;
      if (that.token == "ETH") {
        if (that.amount > that.balance) {
          that.text = "ETH余额不足";
          that.toast = true;
          return;
        } else {
          let wallet = new ethers.Wallet(privateKey);
          wallet.provider = ethers.providers.getDefaultProvider(that.provider);
          let transaction = {
            gasLimit: 25200,
            to: that.address,
            data: "0x",
            gasPrice: that.costPrice,
            value: ethers.utils.parseEther(amount)
          };
          that.loading = true;
          wallet.sendTransaction(transaction).then(function(transactionHash) {
            console.log("交易成功");
            console.log("交易gasLimit: " + transactionHash.gasLimit.toNumber());
            console.log("交易gasPrice: " + transactionHash.gasPrice.toNumber());
            that.loading = false;
            that.submitPop = true;
          });
        }
      } else {
        if (that.amount > that.ercBalance) {
          that.text = that.token + " 余额不足";
          that.toast = true;
          return;
        } else {
          var wallet = new that.ethers.Wallet(privateKey);
          wallet.provider = that.ethers.providers.getDefaultProvider(
            that.provider
          );
          let trData = generateData(that.address, that.amount);
          var transaction = {
            data: trData,
            to: that.contractAddress,
            gasLimit: 25200,
            gasPrice: that.costPrice
          };
          that.loading = true;

          var sendTransactionPromise = wallet.sendTransaction(transaction);

          sendTransactionPromise.then(function(transactionHash) {
            console.log("交易成功");
            console.log("交易gasLimit: " + transactionHash.gasLimit.toNumber());
            console.log("交易gasPrice: " + transactionHash.gasPrice.toNumber());
            that.loading = false;
            that.submitPop = true;
          });
        }
      }
    }
  },
  components: {
    vHeader
  },
  computed: {
    ...mapState(["transfer", "balance"])
  },
  props: {}
};
</script>
<style lang="less" scoped>
@import "./transfer.less";
</style>
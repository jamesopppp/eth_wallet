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
                  <span>{{sliderVal}} ether</span>
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
import vHeader from "@/components/common/header-bar/header-bar";
export default {
  data() {
    return {
      maxVal: 10,
      minVal: 0,
      sliderVal: 0,
      address: "",
      amount: 0,
      token: "ETH",
      submitPop: false,
      toast: false,
      text: "",
      loading: false,
      balance_gtk: 0
    };
  },
  created() {
    let that = this;
    if (Object.keys(that.transfer).length != 0) {
      that.address = that.transfer.address;
      that.amount = that.transfer.amount;
      that.token = that.transfer.token;
    }

    let walletList = JSON.parse(getStore("walletList"));
    let address = walletList[0].wallet.address;
    let provider = that.ethers.providers.getDefaultProvider("rinkeby");
    let token = "0x78A413Dc24E7e8cb41f66D7f1e2CB400bE012dbc";
    let contract = new that.ethers.Contract(token, abi, provider);
    contract.balanceOf(address).then(function(balance) {
      that.balance_gtk = balance.toNumber() / 100000000;
      console.log(that.balance_gtk);
    });
  },
  mounted() {},
  beforeDestroy() {
    this.$store.commit("SET_TRANSFER", {});
  },
  methods: {
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
      let providerName = "rinkeby";
      let address = walletList[0].wallet.address;
      if (that.token == "ETH") {
        if (that.amount > that.balance) {
          that.text = "ETH余额不足";
          that.toast = true;
          return;
        } else {
          that.loading = true;
          transferEth(privateKey, providerName, that.address, that.amount).then(
            function(res) {
              that.loading = false;
              that.submitPop = true;
              console.log(res);
            }
          );
        }
      }
      if (that.token == "GTK") {
        if (that.amount > that.balance_gtk) {
          that.text = "GTK余额不足";
          that.toast = true;
          return;
        } else {
          var wallet = new that.ethers.Wallet(privateKey);
          wallet.provider = that.ethers.providers.getDefaultProvider("rinkeby");
          let trData = generateData(that.address, that.amount);
          console.log(trData);
          var transaction = {
            data: trData,
            to: "0x78A413Dc24E7e8cb41f66D7f1e2CB400bE012dbc"
          };

          var estimateGasPromise = wallet.estimateGas(transaction);
          that.loading = true;
          var sendTransactionPromise = wallet.sendTransaction(transaction);

          sendTransactionPromise.then(function(transactionHash) {
            console.log(transactionHash);
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
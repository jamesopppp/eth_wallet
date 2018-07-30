<template>
  <div class="transaction" data-app="true">
      <div class="qr-view fadeInUp animated">
        <img class="avatars bounceIn animated" src="../../assets/images/logo-white.png">
        <qrcode class="qrcode" :value="address" tag="img" :options="{ size: 200 }"></qrcode>
        <p class="ethCode">{{showAddress}}</p>
        <v-btn class="copy" v-clipboard:copy="showAddress"
      v-clipboard:success="onCopy"
      v-clipboard:error="onError">复制收款地址</v-btn>
      </div>
      <v-dialog width="200" v-model="showTip">
        <div class="copy-view">
          <img src="../../assets/images/success.svg">
          <p>复制成功</p>
        </div>
      </v-dialog>
  </div>
</template>

<script>
import { getStore, generateQRtxt } from "@/config/utils";
export default {
  name: "transaction",
  data() {
    return {
      showTip: false,
      address: "",
      showAddress: ""
    };
  },
  created() {
    let walletList = JSON.parse(getStore("walletList"));
    let address = walletList[0].wallet.address;
    let scanTxt = generateQRtxt(0, "ETH");
    this.address = scanTxt;
    this.showAddress = address;
    console.log(scanTxt);
  },
  mounted() {
    this.$store.commit("SET_TAB", 1);
  },
  methods: {
    onCopy() {
      if (!this.showTip) {
        this.showTip = true;
        setTimeout(() => {
          this.showTip = false;
        }, 800);
      }
    },
    onError() {
      alert("failed");
    }
  },
  computed: {}
};
</script>

<style lang="less" scoped>
@import "./transaction.less";
</style>
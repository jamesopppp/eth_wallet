<template>
  <div id="app">
      <router-view />
      <v-bottom-nav v-show="tab===0||tab===1||tab===2"/>
  </div>
</template>

<script>
import { mapState } from "vuex";
import vBottomNav from "./components/common/bottom-nav/bottom-nav";
export default {
  name: "App",
  data() {
    return {
      bottomNav: "recent"
    };
  },
  created() {
    let words = this.bip39.generateMnemonic(
      128,
      null,
      this.bip39.wordlists.chinese_simplified
    );
    let seed = this.bip39.mnemonicToSeed(words);
    let root = this.ethers.HDNode.fromSeed(seed);
    var key1 = root.derivePath("m/44'/60'/0'/0/0");
    let privateKey = key1.privateKey;
    let wallet = new this.ethers.Wallet(privateKey);
    this.$store.commit("SET_ADDRESS", wallet.address);
  },
  computed: {
    ...mapState(["tab"])
  },
  components: {
    vBottomNav
  }
};
</script>

<style lang="less">
html,
body {
  height: 100vh;
  overflow: hidden;
}
#app {
  font-family: normal, "Microsoft YaHei", Arial, Helvetica, sans-serif, "宋体";
}
</style>

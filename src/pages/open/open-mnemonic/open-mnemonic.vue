<template>
  <div id="open-mnemonic">
      <v-header title="备份助记词"></v-header>
      <div class="view fadeInUp animated">
          <p class="mnemonic-title">抄写下你的钱包助记词</p>
          <p class="mnemonic-content">
              助记词用于恢复钱包或重置钱包密码,将它准确的抄写到纸上,并存放在只有你知道的安全地方。
          </p>
          <div class="mnemonic-box">
              <span v-for="(item,index) in wordsList" :key="index">{{item}}</span>
          </div>
          <v-btn @click="goNext" class="create">下一步</v-btn>
          <div v-show="showTip" class="dialog-shadow"></div>
      </div>
      <v-dialog content-class="backup-mnemonic-pop" persistent max-width="220" v-model="showTip">
          <img src="../camera.png">
          <p class="backup-mnemonic-title">请勿截图</p>
          <p class="backup-mnemonic-content">如果有人获取你的助记词将直接获取你的资产！请抄写下助记词并存放在安全的地方。</p>
          <v-btn @click="know" class="backup-mnemonic-know">我知道了</v-btn>
      </v-dialog>
  </div>
</template>

<script>
import { getStore, objIsNull } from "@/config/utils";
import vHeader from "@/components/common/header-bar/header-bar";
export default {
  data() {
    return {
      checkbox: true,
      showTip: true,
      wordsList: []
    };
  },
  created() {},
  mounted() {
    let mnemonic = getStore("mnemonic");
    if (!objIsNull(mnemonic)) {
      this.wordsList = mnemonic.split(" ");
    }
  },
  methods: {
    goNext() {
      this.$router.push({
        path: "open-confirm",
        query: {
          ...this.$route.query
        }
      });
    },
    know() {
      this.showTip = false;
    }
  },
  components: {
    vHeader
  },
  props: {}
};
</script>
<style lang="less" scoped>
@import "./open-mnemonic.less";
</style>
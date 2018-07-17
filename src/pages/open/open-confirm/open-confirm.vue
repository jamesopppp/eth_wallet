<template>
  <div id="open-confirm">
      <v-header title="备份助记词"></v-header>
      <div class="view">
          <p class="confirm-title">确认你的钱包助记词</p>
          <p class="confirm-content">
              请按顺序点击助记词,以确认你的备份助记词正确。
          </p>
          <div class="confirm-box">
              <span @click="removeWord(index)" v-ripple v-for="(item,index) in selectList" :key="index">{{item}}</span>
          </div>
          <div class="select-box">
              <span @click="addWord(index)" v-ripple v-for="(item,index) in wordsList" :key="index">{{item}}</span>
          </div>
          <v-btn @click="checkWordList" class="create">确认</v-btn>
          <div v-show="failTip||successTip" class="dialog-shadow"></div>
      </div>
      <v-dialog hide-overlay content-class="backup-fail-pop" persistent max-width="220" v-model="failTip">
          <img src="../fail.png">
          <p class="backup-fail-title">备份失败</p>
          <p class="backup-fail-content">请检查你的助记词</p>
          <v-btn @click="failTip=false" class="backup-fail-know">返回检查</v-btn>
      </v-dialog>
      <v-dialog hide-overlay content-class="backup-success-pop" persistent max-width="240" v-model="successTip">
          <img src="../success.png">
          <p class="backup-success-title">备份成功</p>
          <p class="backup-success-content">你备份的助记词顺序验证正确,是否从积微资产移除该助记词?</p>
          <v-btn @click="confirm" class="backup-success-confirm">确认</v-btn>
          <v-btn @click="successTip=false" class="backup-success-cancel">取消</v-btn>
      </v-dialog>
  </div>
</template>

<script>
import { getStore, objIsNull } from "@/config/utils";
import vHeader from "@/components/common/header-bar/header-bar";
export default {
  data() {
    return {
      failTip: false,
      successTip: false,
      wordsList: [],
      selectList: [],
      initialList: []
    };
  },
  created() {},
  mounted() {
    let mnemonic = getStore("mnemonic");
    if (!objIsNull(mnemonic)) {
      let list = mnemonic.split(" ");
      this.initialList = mnemonic.split(" ");
      this.wordsList = this.shuffle(list);
    }
  },
  methods: {
    goNext() {
      this.$router.push({ name: "open-confirm" });
    },
    addWord(index) {
      let word = this.wordsList.splice(index, 1);
      this.selectList.push(word[0]);
    },
    removeWord(index) {
      let word = this.selectList.splice(index, 1);
      this.wordsList.push(word[0]);
    },
    confirm() {
      this.$router.push({ name: "home" });
    },
    checkWordList() {
      console.log(this.initialList);
      if (this.selectList.toString() === this.initialList.toString()) {
        this.successTip = true;
      } else {
        this.failTip = true;
      }
    },
    shuffle(arr) {
      let length = arr.length,
        randomIndex,
        temp;
      while (length) {
        randomIndex = Math.floor(Math.random() * length--);
        temp = arr[randomIndex];
        arr[randomIndex] = arr[length];
        arr[length] = temp;
      }
      return arr;
    }
  },
  components: {
    vHeader
  },
  props: {}
};
</script>
<style lang="less" scoped>
@import "./open-confirm.less";
</style>
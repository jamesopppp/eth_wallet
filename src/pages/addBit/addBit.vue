<template>
  <div class="addBit">
      <v-header title="添加新资产"></v-header>
      <div class="addBit-view">
          <div v-for="(item,index) in addList" :key="index" class="item">
              <img src="../../assets/images/default.png">
              <div class="content">
                  <span>{{item.token}}</span>
                  <p>{{item.contract}}</p>
              </div>
              <v-switch class="item-switch" @change="valChange(index)" :disabled="index===0" v-model="item.isOpen"></v-switch>
          </div>
      </div>
  </div>
</template>

<script>
import { getStore, setStore } from "@/config/utils";
import vHeader from "@/components/common/header-bar/header-bar";
import currencyList from "@/config/currencyList";
export default {
  data() {
    return {
      useList: currencyList,
      eth: true,
      bitList: [],
      addList: []
    };
  },
  mounted() {
    let that = this;
    let walletList = JSON.parse(getStore("walletList"));
    that.bitList = walletList[0].bitList;
    for (let i = 0, len = currencyList.length; i < len; i++) {
      let item = {};
      item.token = currencyList[i].token;
      item.contract = currencyList[i].contract;
      if (i === 0) {
        item.isOpen = true;
      } else {
        item.isOpen = that.bitList[i - 1].isOpen;
      }
      that.addList.push(item);
    }
  },
  methods: {
    valChange(index) {
      this.bitList[index - 1].isOpen = this.addList[index].isOpen;
    }
  },
  beforeDestroy() {
    let walletList = JSON.parse(getStore("walletList"));
    walletList[0].bitList = this.bitList;
    setStore("walletList", walletList);
  },
  components: {
    vHeader
  },
  props: {}
};
</script>
<style lang="less" scoped>
@import "./addBit.less";
</style>
<template>
  <div class="addBit">
      <v-header title="添加新资产"></v-header>
      <div class="addBit-view">
          <div class="item">
              <img src="../../assets/images/default.png">
              <div class="content">
                  <span>ETH</span>
                  <p>0x</p>
              </div>
              <v-switch class="item-switch" disabled v-model="eth"></v-switch>
          </div>
          <div v-for="(item,index) in addList" :key="index" class="item">
              <img src="../../assets/images/default.png">
              <div class="content">
                  <span>{{item.token}}</span>
                  <p>{{item.contract}}</p>
              </div>
              <v-switch class="item-switch" @change="valChange(index)" v-model="item.isOpen"></v-switch>
          </div>
      </div>
  </div>
</template>

<script>
import { getStore, setStore, objIsNull } from "@/config/utils";
import vHeader from "@/components/common/header-bar/header-bar";
import currencyList from "@/config/currencyList";
export default {
  data() {
    return {
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
      if (objIsNull(that.bitList[i])) {
        that.bitList[i].isOpen = false;
        that.bitList[i].token = currencyList[i].token;
        item.isOpen = false;
      } else {
        item.isOpen = that.bitList[i].isOpen;
      }
      that.addList.push(item);
    }
    console.log(that.addList);
  },
  methods: {
    valChange(index) {
      this.bitList[index].isOpen = this.addList[index].isOpen;
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
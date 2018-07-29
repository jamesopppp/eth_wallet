<template>
  <div class="addBit">
      <v-header title="添加新资产"></v-header>
      <div class="addBit-view">
          <div v-for="(item,index) in addList" :key="index" class="item fadeInUp animated">
              <img :src="item.icon">
              <div class="content">
                  <span>{{item.token}}</span>
                  <p>{{item.contract}}</p>
              </div>
              <v-switch :disabled="item.token=='ETH'" class="item-switch" @change="valChange(item,index)" v-model="item.isOpen"></v-switch>
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
    that.getAddList();
  },
  methods: {
    valChange(item, index) {
      for (let i = 0, len = this.bitList.length; i < len; i++) {
        if (item.token == this.bitList[i].token) {
          this.bitList[i].isOpen = this.addList[index].isOpen;
          break;
        }
      }
    },
    async getAddList() {
      let that = this;
      let tokenData = await that.getCurrencyList();
      let addList = [];
      console.log(tokenData);
      let tokenList = tokenData.tokenList;
      let ethItem = {};
      ethItem.isOpen = true;
      ethItem.token = "ETH";
      ethItem.name = "Ether";
      ethItem.contract = "0x";
      ethItem.sort = tokenData.ext.ethSort;
      ethItem.icon =
        "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1730342955,191148670&fm=27&gp=0.jpg";
      addList.push(ethItem);
      for (let i = 0, len = tokenList.length; i < len; i++) {
        let item = {};
        let bitItem = {};
        item.token = tokenList[i].token;
        item.name = tokenList[i].name;
        item.sort = tokenList[i].sort;
        item.contract = tokenList[i].contract;
        item.icon = tokenList[i].icon;
        if (objIsNull(that.bitList[i])) {
          bitItem.isOpen = false;
          bitItem.token = tokenList[i].token;
          that.bitList.push(bitItem);
          item.isOpen = false;
        } else {
          item.isOpen = that.bitList[i].isOpen;
        }
        addList.push(item);
      }
      that.addList = addList.sort(that.sortTokenList("sort"));
      console.log(that.addList);
    },
    getCurrencyList() {
      let that = this;
      return new Promise((resolve, reject) => {
        that.$axios
          .get("/api/geewer.json", {})
          .then(function(res) {
            resolve(res.data);
          })
          .catch(function(error) {
            console.log(error);
          });
      });
    },
    sortTokenList(property) {
      return function(obj1, obj2) {
        let value1 = obj1[property];
        let value2 = obj2[property];
        return value1 - value2; // 升序
      };
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
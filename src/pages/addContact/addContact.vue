<template>
  <div class="addContact">
      <v-header title="新建联系人"></v-header>
      <div class="addContact-banner">
          <img src="./banner.png">
      </div>
      <div class="addContact-view">
          <div class="addContact-item">
              <p class="item-title">联系人名称</p>
              <input type="text" placeholder="请输入联系人名称">
          </div>
          <div class="addContact-item">
              <p class="item-title">钱包地址</p>
              <input type="text" placeholder="请输入钱包地址">
              <img src="./scan.png"> 
          </div>
          <div class="addContact-item">
              <p class="item-title">手机号码</p>
              <input type="text" placeholder="请输入手机号码">
          </div>
          <div class="addContact-item">
              <p class="item-title">邮箱地址(选填)</p>
              <input type="text" placeholder="请输入邮箱地址 如geewer@163.com">
          </div>
          <v-btn class="saveContact">保存</v-btn>
      </div>
  </div>
</template>

<script>
import vHeader from "@/components/common/header-bar/header-bar";
export default {
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
  components: {
    vHeader
  },
  props: {}
};
</script>
<style lang="less" scoped>
@import "./addContact.less";
</style>
<template>
  <div id="open-create">
      <v-header title="创建钱包"></v-header>
      <div class="view">
          <p class="titile">钱包名称：</p>
          <input type="text" placeholder="请输入钱包名称">
          <p class="titile">密码：</p>
          <input class="passwordView" type="text" placeholder="请输入密码">
          <p class="titile">确认密码：</p>
          <input class="passwordView" type="text" placeholder="请重复输入密码">
          <p class="titile">密码提示：</p>
          <input type="text" placeholder="请输入密码提示信息(选填)">
          <div class="rulse">
              <div @click="checkbox=!checkbox" :class="!checkbox?'space':''" class="block" v-ripple>
                  <i class="iconfont icon-queren"></i>
              </div>
              <span>我已经仔细阅读并同意</span><span>《服务及隐私条款》</span>
          </div>
          <v-btn @click="goNext" :class="!checkbox?'noSelect':''" class="create">确认创建</v-btn>
          <span class="import">我有钱包,直接导入</span>
      </div>
  </div>
</template>

<script>
import vHeader from "@/components/common/header-bar/header-bar";
export default {
  data() {
    return {
      checkbox: true
    };
  },
  created() {},
  mounted() {},
  methods: {
    goNext() {
      this.$router.push({ name: "open-backup" });
    }
  },
  components: {
    vHeader
  },
  props: {}
};
</script>
<style lang="less" scoped>
@import "./open-create.less";
</style>
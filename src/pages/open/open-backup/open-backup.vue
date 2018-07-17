<template>
  <div id="open-backup">
      <v-header title="备份钱包"></v-header>
      <div class="view">
          <img class="lock" src="./lock.png">
          <p class="backup-title">最后一步：立即备份你的钱包</p>
          <p class="backup-content">备份钱包：导出[助记词]并抄写到安全的地方,千万不要保存到网络上。然后尝试转入、转出小额资产开始使用</p>
          <v-btn @click="goNext" class="create">备份钱包</v-btn>
          <span class="import">查看备份详细教程</span>
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
      this.$router.push({ name: "open-mnemonic" });
    }
  },
  components: {
    vHeader
  },
  props: {}
};
</script>
<style lang="less" scoped>
@import "./open-backup.less";
</style>
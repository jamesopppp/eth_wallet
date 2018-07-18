<template>
  <div id="open-create">
      <v-header title="创建钱包"></v-header>
      <div class="view">
          <p class="titile">钱包名称：</p>
          <input v-model="name" type="text" placeholder="请输入钱包名称">
          <p class="titile">密码：</p>
          <input v-model="password" class="passwordView" type="text" placeholder="请输入密码">
          <p class="titile">确认密码：</p>
          <input v-model="passwordAgain" class="passwordView" type="text" placeholder="请重复输入密码">
          <p class="titile">密码提示：</p>
          <input type="text" v-model="passwordMessage" placeholder="请输入密码提示信息(选填)">
          <div class="rulse">
              <div @click="checkbox=!checkbox" :class="!checkbox?'space':''" class="block" v-ripple>
                  <i class="iconfont icon-queren"></i>
              </div>
              <span>我已经仔细阅读并同意</span><span>《服务及隐私条款》</span>
          </div>
          <v-btn :disabled="createDialog" :loading="createDialog" @click="goNext" :class="!checkbox?'noSelect':''" class="create">确认创建</v-btn>
          <span class="import">我有钱包,直接导入</span>
          <v-snackbar :timeout="1500" auto-height color="info" bottom v-model="toast">
            {{ text }}
            <v-btn dark flat @click="toast = false">
              关闭
            </v-btn>
          </v-snackbar>
          <v-dialog v-model="createDialog" hide-overlay persistent width="300">
            <v-card color="primary" dark>
              <v-card-text>
                钱包创建中...
                <v-progress-linear indeterminate class="mb-0" color="white">
                </v-progress-linear>
              </v-card-text>
            </v-card>
          </v-dialog>
          <div class="shadow" v-show="createDialog"></div>
      </div>
  </div>
</template>

<script>
import { objIsNull, removeStore, getStore, createWallet } from "@/config/utils";
import vHeader from "@/components/common/header-bar/header-bar";
export default {
  data() {
    return {
      checkbox: true,
      name: "",
      password: "",
      passwordAgain: "",
      passwordMessage: "",
      toast: false,
      text: "Geewer",
      createDialog: false,
      proVal: 1
    };
  },
  created() {},
  mounted() {
    removeStore("mnemonic");
    removeStore("walletItem");
  },
  methods: {
    goNext() {
      if (!this.checkbox) {
        return;
      }
      if (objIsNull(this.name) || this.name.length >= 8) {
        this.text = "钱包名称输入格式不正确";
        this.toast = true;
        return;
      }
      if (objIsNull(this.password) || objIsNull(this.passwordAgain)) {
        this.text = "钱包密码不能为空";
        this.toast = true;
        return;
      }
      if (this.password.length > 15 || this.passwordAgain.length > 15) {
        this.text = "钱包密码长度超出限制";
        this.toast = true;
        return;
      }
      if (this.password !== this.passwordAgain) {
        this.text = "输入密码不相同,请检查密码";
        this.toast = true;
        return;
      }
      if (!objIsNull(this.passwordMessage)) {
        if (this.passwordMessage.length > 20) {
          this.text = "密码提示信息超出限制";
          this.toast = true;
          return;
        }
      }
      this.createDialog = true;
      setTimeout(() => {
        let wallet = JSON.parse(getStore("walletItem"));
        if (objIsNull(wallet)) {
          createWallet();
          setTimeout(() => {
            this.createDialog = false;
            this.$router.push({
              path: "open-backup",
              query: {
                walletName: this.name,
                walletPassword: this.password,
                walletMessage: this.passwordMessage
              }
            });
          }, 2000);
        }
      }, 500);
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
<template>
  <div class="exportKeystore">
      <v-header title="Keystore 导出"></v-header>
      <div class="exportKeystore-view">
          <!-- <div class="selectView">
              <div @click="selectTab(0)" :class="tab==0?'select':''">Keystore</div>
              <div @click="selectTab(1)" :class="tab==1?'select':''">二维码</div>
              <div :class="{'tab1':tab===0,'tab2':tab===1}" class="selectBlock"></div>
          </div> -->
          <div class="form">
              <p class="tipTitle">离线保存</p>
              <p class="content">请复制黏贴 Keystore文件到安全、离线的地方保存。切勿保存至邮箱、记事本，网盘、聊天工具等，非常危险!</p>
              <p class="tipTitle">请勿使用网络传输</p>
              <p class="content">请勿通过网络工具传输 Keystore文件，一旦被黑客获取将造成不可挽回的资产损失。建议离线设备通过扫二维码方式传输。</p>
              <p class="tipTitle">密码保险箱保存</p>
              <p class="content">如需在线保存，则建议使用安全等级更高的1 Password等密码保管软件保存 Keystore文件。</p>
          </div>
          <div class="keystoreView">
              <transition name="move">
                 <div class="loadingView" v-show="loadingKeystore">
                    <p>Keystore导出中 {{percent}} %</p>
                    <v-progress-circular class="circular" indeterminate></v-progress-circular>
                 </div>
              </transition>
              <transition name="move">
                 <span v-show="!loadingKeystore">{{keystore}}</span>
              </transition>
          </div>
          <v-tooltip v-model="showTip" top>
                <v-btn slot="activator" :class="loadingKeystore?'noSelect':''" :disabled="copying" :loading="copying" @click="goCopy" class="copy">复制 Keystore</v-btn>
                <span>Keystore 已复制</span>
          </v-tooltip>
      </div>
  </div>
</template>

<script>
import { getStore, objIsNull } from "@/config/utils";
import vHeader from "@/components/common/header-bar/header-bar";
export default {
  data() {
    return {
      tab: 0,
      copying: false,
      loadingKeystore: true,
      keystore: "",
      showTip: false,
      percent: 0
    };
  },
  created() {
    let that = this;
    let walletItem = JSON.parse(getStore("walletList"))[0];
    let password = walletItem.details.walletPassword;
    let privateKey = walletItem.wallet.privateKey;
    let wallet = new that.ethers.Wallet(privateKey);
    function callback(percent) {
      //   console.log("Encrypting: " + parseInt(percent * 100) + "% complete");
      that.percent = parseInt(percent * 100);
    }

    wallet.encrypt(password, callback).then(function(json) {
      // console.log(json);
      that.keystore = JSON.parse(
        JSON.stringify(json).replace(/Crypto/g, "crypto")
      );
      that.loadingKeystore = false;
    });
  },
  mounted() {},
  methods: {
    goCopy() {
      let that = this;
      that.copying = true;
      that.$copyText(that.keystore).then(
        function(e) {
          setTimeout(() => {
            that.copying = false;
            that.showTip = true;
            setTimeout(() => {
              that.showTip = false;
            }, 1000);
          }, 2000);
        },
        function(e) {
          that.copying = false;
          console.log(e);
        }
      );
    },
    selectTab(index) {
      if (index === 0) {
        if (this.tab !== 0) {
          this.tab = 0;
        }
      }
      if (index === 1) {
        if (this.tab !== 1) {
          this.tab = 1;
        }
      }
      if (index === 2) {
        if (this.tab !== 2) {
          this.tab = 2;
        }
      }
    }
  },
  components: {
    vHeader
  },
  props: {}
};
</script>
<style lang="less" scoped>
@import "./exportKeystore.less";
.move-enter-active,
.move-leave-active {
  transition: opacity 0.5s;
}
.move-enter, .move-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
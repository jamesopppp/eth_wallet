<template>
  <div class="contact">
      <v-header add :title="header"></v-header>
      <div class="contact-view">
          <div v-show="noContact">
            <div class="noContact">
                <img src="../../assets/images/logo-white.png">
            </div>
            <span class="noText">暂无联系人</span>
          </div>
          <div class="contact-list fadeInUp animated">
              <swipeout>
                <swipeout-item  :key="item.address" v-for="(item,index) in contactList" @on-close="closeMenu" @on-open="openMenu" v-ripple transition-mode="follow">
                  <div slot="right-menu">
                    <swipeout-button @click.native="delect(index)" class="delect">
                      <img src="./delect.png">
                      <p>删除</p>
                    </swipeout-button>
                    <swipeout-button @click.native="edit(index,item)" class="edit" >
                      <img src="./edit.png">
                      <p>编辑</p>
                    </swipeout-button>
                  </div>
                  <div @click="selectContact(item.address)" v-ripple slot="content">
                    <div class="contact-item">
                        <img class="content-logo" src="../../assets/images/logo-white.png">
                        <div class="content">
                            <span>{{item.name}}</span>
                            <span>{{item.address}}</span>
                        </div>
                        <i class="iconfont icon-xiangzuojiantou"></i> 
                        <div class="openStatus">
                          <img src="../../assets/images/logo-white.png">
                          <p>{{item.name}}</p>
                        </div>
                    </div>
                  </div>
                </swipeout-item>
              </swipeout>
          </div>
      </div>
      <div v-show="dialog" class="shadow"></div>
      <v-dialog content-class="delect-contact-pop" max-width="240" v-model="dialog">
          <img src="../../assets/images/wrong.svg">
          <p class="delect-contact-title">确定删除该联系人吗?</p>
          <p class="delect-contact-content">删除该联系人后将无法重新找回</p>
          <v-btn @click="delectConfirm" class="delect-contact-confirm">确认</v-btn>
          <v-btn @click="dialog=false" class="delect-contact-cancel">取消</v-btn>
      </v-dialog>
  </div>
</template>

<script>
import { getStore, objIsNull, setStore, removeStore } from "@/config/utils";
import { Swipeout, SwipeoutItem, SwipeoutButton } from "vux";
import vHeader from "@/components/common/header-bar/header-bar";
export default {
  data() {
    return {
      noContact: false,
      contactList: [],
      dialog: false,
      delectIndex: 0,
      select: false,
      header: "联系人"
    };
  },
  created() {
    let that = this;
    let wallet = JSON.parse(getStore("walletList"))[0];
    if (wallet.contacts) {
      if (wallet.contacts.length > 0) {
        that.contactList = wallet.contacts;
      } else {
        that.noContact = true;
      }
    } else {
      that.noContact = true;
    }
    let select = that.$route.query.select;
    if (!objIsNull(select)) {
      if (select === 1) {
        that.select = true;
        that.header = "选择联系人";
      }
    }
  },
  mounted() {},
  methods: {
    selectContact(address) {
      if (this.select) {
        this.$store.commit("SET_TRANSFER_ADDRESS", address);
        this.$router.go(-1);
      }
    },
    openMenu() {
      // let target = event.currentTarget;
      // if (target.className == "vux-swipeout-item") {
      //   let block = target.querySelector(".openStatus");
      //   block.classList.add("open");
      // }
    },
    closeMenu() {
      // console.log("close");
      // let target = event.currentTarget;
      // if (target.className.indexOf("vux-swipeout-content") !== -1) {
      //   let block = target.querySelector(".openStatus");
      //   block.classList.remove("open");
      // }
      // if (
      //   target.className.indexOf("delect") !== -1 ||
      //   target.className.indexOf("edit") !== -1
      // ) {
      //   let block = target.parentNode.parentNode.parentNode.querySelector(
      //     ".openStatus"
      //   );
      //   block.classList.remove("open");
      // }
    },
    delect(index) {
      let that = this;
      that.dialog = true;
      that.delectIndex = index;
    },
    delectConfirm() {
      let that = this;
      that.contactList.splice(that.delectIndex, 1);
      let walletList = JSON.parse(getStore("walletList"));
      let contacts = walletList[0].contacts;
      contacts.splice(that.delectIndex, 1);
      walletList[0].contacts = contacts;
      setStore("walletList", walletList);
      that.dialog = false;
      if (that.contactList.length === 0) {
        that.noContact = true;
      }
      console.log(that.contactList);
    },
    edit(index, item) {
      let that = this;
      that.$router.push({
        path: "addContact",
        query: { isAdd: 0, index: index, item: item }
      });
    }
  },
  components: {
    vHeader,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton
  },
  props: {}
};
</script>
<style lang="less" scoped>
@import "./contact.less";
</style>
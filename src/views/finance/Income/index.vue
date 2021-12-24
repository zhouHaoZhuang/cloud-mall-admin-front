<template>
  <div class="income">
    <h1>充值中心</h1>
    <ul>
      <li :class="{ buleTop: change == 'online' }" @click="change = 'online'">
        在线充值
      </li>
      <li :class="{ buleTop: change == 'record' }" @click="change = 'record'">
        在线充值记录
      </li>
      <li :class="{ buleTop: change == 'offline' }" @click="change = 'offline'">
        线下汇款
      </li>
      <li :class="{ buleTop: change == 'Inquire' }" @click="change = 'Inquire'">
        线下汇款查询
      </li>
    </ul>
    <div>
      <component :is="change" :change="changePage"></component>
    </div>
  </div>
</template>

<script>
import record from "./record/index.vue";
import online from "./online/index.vue";
import offline from "./offline/index.vue";
import Inquire from "./Inquire/index.vue";

export default {
  data() {
    return {
      change: "online"
    };
  },
  methods: {
    changePage(change) {
      this.change = change;
    }
  },
  components: {
    record,
    online,
    offline,
    Inquire
  }
};
</script>

<style lang="less" scoped>
.income {
  > h1 {
    font-size: 22px;
  }
  > ul {
    color: #4d4d4d;
    list-style: none;
    display: flex;
    padding: 0;
    background-color: #f0f3f5;
    > li {
      width: 132px;
      height: 38px;
      text-align: center;
      line-height: 34px;
      border-top: 3px solid transparent;
    }
    .buleTop {
      border-top: 3px solid #00aaff;
      background-color: #fff;
      border-left: 1px solid #eeeeee;
      border-right: 1px solid #eeeeee;
      color: #00aaff;
    }
  }
  > div {
    color: #000;
  }
}
</style>

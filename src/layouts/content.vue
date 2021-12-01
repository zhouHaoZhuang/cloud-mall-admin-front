<template>
  <router-view />
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo
    })
  },
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>

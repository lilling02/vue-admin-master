<template>
  <div class="dashboard-container">
    <card></card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import card from "./Card";

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(['name',]),
  },
  components: {
    card
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>

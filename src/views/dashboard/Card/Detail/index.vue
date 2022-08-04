<template>
  <div>
    <div class="card-header"><span>{{title}}</span>
      <svg t="1658947750056" class="icon" viewBox="0 0 1024 1024" version="1.1"
        xmlns="http://www.w3.org/2000/svg" p-id="2360" width="16" height="16">
        <path
          d="M512 981.312C253.888 981.312 42.688 770.112 42.688 512S253.888 42.688 512 42.688s469.312 211.2 469.312 469.312-211.2 469.312-469.312 469.312z m0-844.8c-206.528 0-375.488 168.96-375.488 375.488S305.472 887.488 512 887.488s375.488-168.96 375.488-375.488S718.528 136.512 512 136.512z"
          fill="#172B4D" p-id="2361"></path>
        <path
          d="M512 796.736a46.08 46.08 0 0 1-46.912-46.912V480.64A46.08 46.08 0 0 1 512 433.792a46.08 46.08 0 0 1 46.912 46.912v269.12a46.08 46.08 0 0 1-46.912 46.912zM512 364.928a46.08 46.08 0 0 1-46.912-46.912v-43.84A46.08 46.08 0 0 1 512 227.264a46.08 46.08 0 0 1 46.912 46.912v43.84A47.04 47.04 0 0 1 512 364.928z"
          fill="#172B4D" p-id="2362"></path>
      </svg>
    </div>
    <div class="card-container">{{count}}</div>
    <div class="card-charts">
      <slot name="charts"></slot>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'count']
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  color: #d9d9d9;
}
.card-container {
  font-size: 25px;
  padding: 10px 0px;
}
.card-charts {
  height: 40px;
}
.card-footer {
  border-top: 1px solid #eee;
  padding-top: 15px;
}
</style>
<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <!-- 第一个card -->
        <el-card>
          <div slot="header">
            <detail title="总销售额" count='$15422'>
              <template slot="charts">
                <span>周同比 56.67%</span>
              </template>
            </detail>
          </div>
          <div></div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <!-- 第二个card -->
        <el-card>
          <div slot="header">
            <detail title="访问量" count='88460'></detail>
          </div>
          <div></div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <!-- 第三个card -->
        <el-card>
          <div slot="header">
            <detail title="支付笔数" count='88460'></detail>
          </div>
          <div></div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <!-- 第四个card -->
        <el-card>
          <div slot="header">
            <detail title="运营活动效果" count='78%'></detail>
          </div>
          <div></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import detail from "./Detail";
export default {
  name: 'card',
  components: { detail }
}
</script>

<style scoped>

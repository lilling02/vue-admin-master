<template>
  <div>
    <!-- 
        inline:代表行内表单，表示一行可以放置多个表单元素
     -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category1Id"
          @change="handler1()"
          :disabled="show"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="(c1, index) in list1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category2Id"
          @change="handler2()"
          :disabled="show"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="(c2, index) in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category3Id"
          @change="handler3"
          :disabled="show"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="(c3, index) in list3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props: ["show"],
  data() {
    return {
      //用于存储一级分类数据的数组
      list1: [],
      //二级分类的数据
      list2: [],
      //三级分类的数据
      list3: [],
      //手机响应的一级耳机三级分类的id
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  methods: {
    //获取一级分类数据的方法
    async getCategory1List() {
      //获取以及分类的数据的请求不需要带参数
      let result = await this.$API.attr.reqCategory1List();
      if (result.code == 200) {
        this.list1 = result.data;
      }
    },
    //当一级分类select事件回调（当以及分类的option发生变化的时候获取响应的二级分类的数据）
    async handler1() {
      //清除数据
      this.list2 = [];
      this.list3 = [];
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
      const { category1Id } = this.cForm;
      //   this.$emit("getCategoryId", category1Id);
      let result = await this.$API.attr.reqCategory2List(category1Id);
      if (result.code == 200) {
        this.list2 = result.data;
      } else {
        console.error();
      }
    },
    //二级分类事件回调
    async handler2() {
      //清除数据
      this.list3 = [];
      this.cForm.category3Id = "";
      const { category2Id } = this.cForm;
      //   this.$emit("getCategoryId", category2Id);
      let result = await this.$API.attr.reqCategory3List(category2Id);
      if (result.code == 200) {
        this.list3 = result.data;
      }
    },
    //三级分类事件回调
    handler3() {
      const { category3Id } = this.cForm;
      this.$emit("getCategoryId", this.cForm);
    },
  },
  //组件挂载完毕：向服务器发请求，后去响应的一级分类的数据
  mounted() {
    this.getCategory1List();
  },
};
</script>

<style>
</style>
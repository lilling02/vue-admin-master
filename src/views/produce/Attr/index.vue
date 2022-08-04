<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="!isShowTable"
      ></CategorySelect>
    </el-card>
    <el-card style="margin: 20px 0px">
      <div v-show="isShowTable">
        <!-- 添加属性按钮 
            disabled控制按钮什么时候可以使用什么时候禁用
        -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!cForm.category3Id"
          @click="addAttr"
          >添加属性</el-button
        >

        <!-- 表格：展示平台属性 -->
        <el-table style="width: 100%" border="" :data="attrList">
          <el-table-column type="index" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row, index }">
              <!-- 此时row是attrList -->
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="index"
                style="margin: 0px 20px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="250" align="center">
            <template slot-scope="{ row, index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updataAttr(row)"
                >修改</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性或者修改属性的结构 -->
      <div v-show="isShowTable != true">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <!-- 属性值 -->
        <el-table
          style="width: 100%; margin: 20px 0px"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="prop"
            label="属性值名称"
          >
            <!-- row是attrInfo.attrValueList里的每一个元素 -->
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                v-if="row.flag"
                @blur="toLook(row, $index)"
                @keyup.enter.native="toLook(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: inline"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="prop"
            label="操作"
          >
            <template slot-scope="{ row, $index }">
              <!-- 
                这是点击删除后会出现的确认删除的气泡框 
                onConfirm ：悬着确定时候会触发的事件
                onCancel	：点击取消按钮时触发
              -->
              <el-popconfirm
                :title="`确定删除${row.valueName}吗？`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                  >删除</el-button
                >
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="addOrUpdataAttr"
          :disabled="
            attrInfo.attrValueList.length < 1 || attrInfo.attrName == ''
          "
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      //用于存储三级路由id的对象
      cForm: {},
      //接收平台属性的字段
      attrList: [],
      //   //控制编辑模式和查看模式的flag
      //   flag: true,
      //控制是否显示table
      isShowTable: true,
      //收集新增||修改属性使用的
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [
          //属性值，有多个 所以是数组
        ],
        categoryId: 0,
        categoryLevel: 3,
      },
      //这是控制显示确定删除属性值的气泡框的值
      visible: false,
    };
  },
  methods: {
    //子给父传数据用的回调
    getCategoryId(cForm) {
      // 获取三级联动的所有id
      this.cForm = cForm;
      //发请求获取品牌属性
      this.getAttrList();
    },
    //获取平台属性的数据
    async getAttrList() {
      // 准备三记录有id用于发请求
      let { category1Id, category2Id, category3Id } = this.cForm;
      // 发请求获取平台属性的数据
      let result = await this.$API.attr.reqAttrInfoList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    //添加属性值的回调
    addAttrValue() {
      //向我们是属性值 数组里面添加元素
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        flag: true, //flag用于给用户切换查看模式和编辑模式
      });
      //当新增一个属性的时候，应该input自动对焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    //点击添加属性的回调
    //收集三级分类Id
    addAttr() {
      //切换table显示隐藏
      this.isShowTable = !this.isShowTable;
      // 清除数据
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [
          //属性值，有多个 所以是数组
        ],
        categoryId: this.cForm.category3Id,
        categoryLevel: 3,
      };
    },
    //修改某一个属性
    updataAttr(row) {
      //由于数据结构当中存在复杂对象 需要深拷贝
      this.attrInfo = cloneDeep(row);
      this.isShowTable = !this.isShowTable;
      //在修改某一个属性的时候，将响应的属性值元素添加上flag这个标记
      this.attrInfo.attrValueList.forEach((item) => {
        //这样书写也可以给属性值添加flag自动，但是会发现视图不会跟着变化（因为flag不是响应式数据）
        //因为vue无法探测普通的新增property,这样书写的属性并非响应式属性
        // item.flag = false;
        // 正确写法
        this.$set(item, "flag", false);
      });
    },
    //失去焦点切换成查看模式的事件
    toLook(row, index) {
      //如果属性值为空不能做作为新的属性值，需要给用户提示，让他输入一个其他属性值
      if (row.valueName.trim() == "") {
        this.$message("请您输入一个正常属性值");
        this.attrInfo.attrValueList.splice(index, 1);
        return;
      }
      //新增的属性值不能与已有的属性值重复
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        if (row != item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepat) return;
      row.flag = false;
    },
    //点击span的回调，变为编辑模式
    toEdit(row, index) {
      row.flag = true;
      //获取input节点，实现自动聚焦
      //需要注意：点击span的时候，切换为input改为编辑模式，但是需要注意，对于浏览器而言，页面重绘需要时间
      //   $nextTick,当节点渲染完毕了，会执行一次
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    //点击确定删除attrValue时候的回调
    deleteAttrValue(index) {
      //splice(从第几个开始删除，删除几个)  数组中删除元素的方法
      this.attrInfo.attrValueList.splice(index, 1);
    },
    //保存按钮回调，惊醒添加属性或则修改属性操作
    async addOrUpdataAttr() {
      //整理参数：1.如果用户输入的值为空去掉当前其所在的对象 2.去掉this.attrInfo.attrValueList中对象的Flag，因为服务器不许要
      //   2.去掉this.attrInfo.attrValueList中对象的Flag，因为服务器不许要
      this.attrInfo.attrValueList.forEach((item) => {
        delete item.flag;
      });
      try {
        //发请求
        await this.$API.attr.reqAddOrUpdataAttr(this.attrInfo);
        this.$message({ type: "success", message: "保存成功" });
        //返回
        this.isShowTable = true;
        //刷新列表
        this.getAttrList();
      } catch (error) {
        this.$message("保存失败");
      }
    },
  },
};
</script>

<style>
</style>
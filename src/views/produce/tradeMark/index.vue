<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 20px"
      @click="shouDialog"
    >
      添加</el-button
    >

    <!-- 表格组件  data是表格组件需要展示的数据  数据类型
        border：给表格添加边框
        column相应的属性
        lable：显示的标题
        width：对应列的宽度
        align:标题的对齐方式
        注意1：elementUI当中的table组件，展示的数据是以一列一列进行展示的
    -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column label="序号" width="80px" align="center" type="index">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="height: 80px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updataTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器组件 
        当前页，数据总量， 每一页展示条数
        current-page:代表的是当前第几页
        total:代表分页器一共需要展示数据条数
        page-size:代表的是每一页需要展示多少条数据
        page-sizes：代表可以设置每一页展示多少条数据
        layout：可以实现分页器布局
        pager-count:按钮的数量如果9连续页码是7
    -->

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :total="total"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      :pager-count="7"
      layout="prev, pager, next, jumper,->,total, sizes"
    >
    </el-pagination>

    <!-- 对话框 
    :visible.sync：控制对话框显示隐藏
    Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。
    -->

    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <!-- form表单元素 :model属性是吧表单数据收集到哪个对象身上,将来表单验证也要用到-->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" :label-width="'100px'" prop="tmName">
          <!-- 文本框 -->
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" :label-width="'100px'" prop="logoUrl">
          <!-- 上传图品 这里收集数据不能使用v-model 因为不是表单元素
             action:设置图片的上传地址
             on-success:可以检测到图片上传成功,当图片上传成功会执行一次
            :before-upload:可以在上传图片之前,会执行一次
           -->
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdataTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {
      //代表分页器第几页
      page: 1,
      //代表页数展示数据条数
      limit: 3,
      //总共数据的条数
      total: 0,
      //   列表展示的数据
      list: [],
      //对话框显示与隐藏控制的属性
      dialogFormVisible: false,
      //收集品牌信息
      tmForm: {
        logoUrl: "",
        tmName: "",
      },
      //表单验证的规则
      rules: {
        //品牌名称的检验规则
        //require：必须要校验的字段
        tmName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "change",
          },
        ],
        logoUrl: [
          { required: true, message: "请选择品牌图片", trigger: "change" },
        ],
      },
    };
  },
  //组件挂载完毕就发请求
  mounted() {
    //获取列表数据的方法
    this.getPageList();
  },
  methods: {
    // 获得品牌列表的数据
    async getPageList() {
      const { page, limit } = this;
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        // 分别是总条数和列表
        this.total = result.data.total;
        this.list = result.data.records;
      } else {
      }
    },
    //修改当前页码
    handleCurrentChange(page) {
      // 会自动传入page
      this.page = page;
      this.getPageList();
    },
    //当分页器某一页需要展示数据的条数发生变化的时候会触发
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    //上传图片成功的回调
    handleAvatarSuccess(res, file) {
      //   res:上传成功之后返回给前端的数据
      // file:上传成功之后服务器返回给前端的数据
      //   收集品牌图片路径,用来发数据
      this.tmForm.logoUrl = res.data;
    },
    //上传图片相关的回调
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //点击添加品牌的按钮
    shouDialog() {
      // 显示对话框
      this.dialogFormVisible = true;
      //清除数据
      this.tmForm = {
        logoUrl: "",
        tmName: "",
      };
    },
    //点击修改品牌按钮
    updataTradeMark(row) {
      // row是当前用户选择品牌的信息
      this.dialogFormVisible = true;
      //   将已有的品牌信息赋值给tmForm进行展示
      //   将服务器直接返回的信息进行展示
      //也就是说tmform存储的就是服务器返回的信息
      //进行浅拷贝是因为避免修改表格中展示的数据
      this.tmForm = { ...row };
    },
    //添加品牌OR更新品牌
    addOrUpdataTradeMark() {
      //当全部的字段通过，再去书写业务逻辑
      this.$refs.ruleForm.validate(async (success) => {
        //如果全部字段符合条件
        if (success) {
          this.dialogFormVisible = false;
          //发请求（添加品牌|修改品牌）
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            //弹出信息
            this.$message({
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
              type: "success",
            });
            //再次获取新的列表
            //如果添加品牌：停留在第一页，修改品牌应该停留在当前页
            this.getPageList(this.tmForm.id ? this.page : 1);
          }
        } else {
          console.log("error submit");
          return false;
        }
      });
    },
    //删除品牌
    deleteTradeMark(row) {
      console.log(row);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //当用户点击取消按钮的时候会触发
          //向服务器发请求
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            //删除成功后再次获取品牌的数据 如果当前页数据大于1，那么留在当页否则返回上一页
            this.getPageList(this.list.length > 1 ? this.page : this.page - 1);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

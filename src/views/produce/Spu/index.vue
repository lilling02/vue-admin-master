<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene!=0"></CategorySelect>
    </el-card>
    <el-card>
      <!-- 这里会有三部分进行切换 -->
      <div v-show="scene==0">
        <!-- 展示Spu列表的结构 -->
        <el-button type="primary" icon="el-icon-plus" :disabled='!cForm.category3Id'
          @click="addSpu">添加SPU
        </el-button>
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column header-align="center" align="center" prop="spuName" label="SPU名称">
          </el-table-column>
          <el-table-column header-align="center" align="center" prop="description" label="SPU描述">
          </el-table-column>
          <el-table-column header-align="center" align="center" prop="prop" label="操作">
            <template slot-scope="{row,$index}">
              <el-button type="success" icon="el-icon-plus" size="mini" @click="addSku(row)">添加
              </el-button>
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateSpu(row)">修改
              </el-button>
              <el-button type="info" icon="el-icon-info" size="mini" @click="handler(row)">查看所有
              </el-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"
                  style="margin-left: 10px;">删除
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器   "-->
        <el-pagination :current-page="page" :page-sizes="[3, 5, 10]" :page-size="limit"
          @size-change="handleSizeChange" @current-change="handleCurrentChange"
          layout=" prev, pager, next, jumper,->,sizes,total" :total="20" style="text-align:center">
        </el-pagination>
      </div>
      <SpuForm v-show="scene==1" @changeScene='changeScene' ref="spu"></SpuForm>
      <SkuForm v-show="scene==2" ref="sku" @changeScene='changeScene'></SkuForm>
    </el-card>
    <!-- 展示所有sku列表的对话框 点击查看所有按钮时候展示 -->
    <el-dialog :title="`${spu.spuName}的列表`" :visible.sync="dialogTableVisible" @closed="close">
      <el-table :data="skuList" style="width:100%" v-loading="loading">
        <el-table-column align="center" prop="skuName" label="名称">
        </el-table-column>
        <el-table-column align="center" prop="price" label="价格">
        </el-table-column>
        <el-table-column align="center" prop="weight" label="重量">
        </el-table-column>
        <el-table-column align="center" prop="prop" label="默认图片">
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" alt="默认图片" style="width: 100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
//引入子组件
import SpuForm from "@/views/produce/Spu/SpuForm";
import SkuForm from "@/views/produce/Spu/SkuForm";
export default {
  name: "Spu",
  data() {
    return {
      //获取三级分类的id
      cForm: {},
      //   控制三级联动的是否展示
      show: true,
      //当前页数
      page: 1,
      //每页展示数据条数
      limit: 3,
      //存储展示数据的数组
      records: [],
      //分页器一共需要展示的数据的总条数
      total: 0,
      //0表示展示SPU列表数据，1代表添加Spu修改SPU 2添加Sku
      scene: 0,
      //控制展示所有sku的dialog是否展示的值
      dialogTableVisible: false,
      //用于收集所有sku的字段
      skuList: [],
      //存储spu信息
      spu: {},
      loading: true

    };
  },
  methods: {
    // 三级联动自定义事件可以给父组件传递响应的id
    getCategoryId(cForm) {
      this.cForm = cForm;
      //获取SPU列表数据进行展示
      this.getSpuList();
    },
    //获取Spu列表数据
    async getSpuList() {
      //需要三个参数page limit category3Id
      const { page, limit } = this
      let category3Id = this.cForm.category3Id
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      if (result.code == 200) {
        this.total = result.data.total
        this.records = result.data.records
      } else {
        console.error();
      }
    },
    //点击分页器的第几页按钮的回调
    handleCurrentChange(page) {
      this.page = page
      //再次获取SPU列表
      this.getSpuList()
    },
    //当分页器的某一个展示数据条数发生变化的回调
    handleSizeChange(limit) {
      this.limit = limit
      //再次获取SPU列表
      this.getSpuList()
    },
    //添加SPU按钮的回调
    addSpu() {
      this.scene = 1
      this.$refs.spu.addSpuData(this.cForm.category3Id)
    },
    //修改某个SPU
    updateSpu(row) {
      this.scene = 1
      this.$refs.spu.initSpuData(row)
    },
    //spuForm点击取消时候触发的事件
    changeScene({ scene, flag }) {
      //flag这个形参是为了区分保存按钮是添加还是修改
      this.scene = scene
      if (flag == '修改') {
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }
    },
    //点击删除Spu的回调
    async deleteSpu(row) {
      //   发请求删除Spu
      let result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result == 200) {
        this.$message({ type: 'success', message: '删除成功' })
        //从新获取spu列表 spu个数大于1删除的时候停留在当前页
        this.getSpuList(this.records.length >= 1 ? this.page : this.page - 1)
      } else {
        console.error();
      }
    },
    //添加Sku按钮的回调
    addSku(row) {
      //切换场景
      this.scene = 2;
      //父组件调用子组件的方法，让子组件发请求
      this.$refs.sku.getData(row, this.cForm)
    },
    //控制展示所有sku的按钮的回调 
    async handler(row) {
      this.dialogTableVisible = true
      //发请求获取数据
      this.spu = row
      let result = await this.$API.spu.reqSkuList(this.spu.id)
      if (result.code == 200) {
        //将请求到的skuList存储
        this.skuList = result.data
        //数据返回时候loading结束
        this.loading = false
      } else {
        console.error();
      }
    },
    //点击关闭dialog 的回调
    close() {
      // 点击时候开始缓存效果
      this.loading = true
      //清除缓存
      this.skuList = ''
    }
  },
  components: {
    SpuForm,
    SkuForm
  }
};
</script>

<style></style>

<template>
  <div>
    <!-- 表格 -->
    <el-table style="width: 100%" :data="records">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column width="width" align="center" prop="skuName" label="名称">
      </el-table-column>
      <el-table-column width="width" align="center" prop="skuDesc" label="描述">
      </el-table-column>
      <el-table-column width="110" align="center" prop="prop" label="默认图片">
        <template slot-scope="{row,$index}">
          <img :src="row.skuDefaultImg" alt="" style="width:80px;height: 80px;">
        </template>
      </el-table-column>
      <el-table-column width="80" align="center" prop="weight" label="重量">
      </el-table-column>
      <el-table-column width="width" align="center" prop="price" label="价格">
      </el-table-column>
      <el-table-column width="width" align="center" prop="prop" label="操作">
        <template slot-scope="{row,$index}">
          <el-button icon="el-icon-sort-up" size="mini" v-if="row.isSale == 0" @click="sale(row)">
          </el-button>
          <el-button type="success" icon="el-icon-sort-down" size="mini" v-else
            @click="cancel(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit()">
          </el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)">
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 
    @size-change="handleSizeChange"
        @current-change="handleCurrentChange"-->
    <el-pagination :current-page="page" :page-sizes="[5, 10, 20]" :page-size="limit"
      layout="prev, pager, next, jumper,->,total, sizes" :total="total" style="text-align:center"
      @current-change="getSkuList" @size-change="handleSizeChange">
    </el-pagination>

    <!-- 抽屉效果 -->

    <el-drawer :visible.sync="drawer" :show-close="false" size="30%">
      <el-row style="margin:25px 25px">
        <el-col :span="5" style="font-size:18px; text-align:right;">
          <div class="grid-content bg-purple">名称</div>
        </el-col>
        <el-col :span="16" push="3">
          <div class="grid-content bg-purple-light">{{skuInfo.skuName}}</div>
        </el-col>
      </el-row>

      <el-row style="margin:25px 25px">
        <el-col :span="5" style="font-size:18px; text-align:right;">
          <div class="grid-content bg-purple">描述</div>
        </el-col>
        <el-col :span="16" push="3">
          <div class="grid-content bg-purple-light">{{skuInfo.skuDesc}}</div>
        </el-col>
      </el-row>

      <el-row style="margin:25px 25px">
        <el-col :span="5" style="font-size:18px; text-align:right;">
          <div class="grid-content bg-purple">价格</div>
        </el-col>
        <el-col :span="16" push="3">
          <div class="grid-content bg-purple-light">{{skuInfo.price}}元</div>
        </el-col>
      </el-row>

      <el-row style="margin:25px 25px">
        <el-col :span="5" style="font-size:18px; text-align:right;">
          <div class="grid-content bg-purple">平台属性</div>
        </el-col>
        <el-col :span="16" push="3">
          <el-tag v-for="(attr,index) in skuInfo.skuAttrValueList" :key="attr.id"
            style="margin: 0px 10px">
            {{attr.attrId}}-{{attr.valueId}}</el-tag>
        </el-col>
      </el-row>

      <el-row style="margin:25px 25px">
        <el-col :span="5" style="font-size:18px; text-align:right;">
          <div class="grid-content bg-purple">商品图片</div>
        </el-col>
        <el-col :span="16" push="3">
          <el-carousel height="300px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="" height="300px">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>

    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      //当前在第几页
      page: 1,
      //一页展示多少条数据
      limit: 5,
      //存储skuList数据
      records: [],
      //存储总共的数据条数
      total: 0,
      //存储sku信息的字段
      skuInfo: {},
      //控制抽屉显示隐藏
      drawer: false,
      direction: 'rtl',
    }
  },
  methods: {
    //获取SkuList
    async getSkuList(pages = 1) {
      this.page = pages
      let result = await this.$API.sku.reqSkuList(this.page, this.limit)
      if (result.code == 200) {
        this.records = result.data.records
        this.total = result.data.total
      }
    },
    //改变每页展示个数的回调
    handleSizeChange(limit) {
      this.limit = limit
      this.getSkuList()
    },
    //上架回调
    async sale(row) {
      let result = await this.$API.sku.reqSale(row.id)
      if (result.code == 200) {
        this.$message({ type: 'success', message: '上架成功' })
        row.isSale = 1
      }
    },
    //下架回调
    async cancel(row) {
      let result = await this.$API.sku.reqCancelSale(row.id)
      if (result.code == 200) {
        this.$message({ type: 'success', message: '下架成功' })
        row.isSale = 0
      }
    },
    //修改回调
    edit() {
      this.$message('正在开发中')
    },
    //获取sku详情的方法
    async getSkuInfo(sku) {
      //展示抽屉
      this.drawer = true
      // 获取sku数据
      let result = await this.$API.sku.reqSkuById(sku.id)
      console.log(result);
      if (result.code == 200) {
        this.skuInfo = result.data
      }
    },

  },
  mounted() {
    //获取SKU列表的方法
    this.getSkuList()
  }
};
</script>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        {{spu.spuName}}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" v-model="skuInfo.price" type="number"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight" type="number"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form ref="form1" label-width="80px" :inline='true' :data='attrInfoList'>
          <el-form-item :label="attr.attrName" v-for="(attr,index) in attrInfoList" :key="attr.id">
            <el-select value='' placeholder="请选择" v-model="attr.attrIdAndValue">
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`"
                v-for="(attrValue,index) in attr.attrValueList" :key="attrValue.id">
                {{attrValue.valueName}}</el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form ref="form1" label-width="80px" :inline='true'>
          <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr,index) in spuSaleAttrList"
            :key="saleAttr.id">
            <el-select v-model="saleAttr.attrIdAndValueId" placeholder="请选择">
              <el-option :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="(saleAttrValue,index) in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="spuImageList">
          <!-- <el-table-column type="selection" prop="prop" label="lable" width="80">
          </el-table-column> -->
          <el-table-column type="selection" width="55" @selection-change="handleSelectionChange">
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{row,$index}">
              <img :src="row.imgUrl" alt="" style="width:100px">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">

          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button type="primary" v-if="row.isDefault==0" @click="changeDefault(row)">设为默认
              </el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save()">保存</el-button>
        <el-button @click="cancel()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'skuForm',
  data() {
    return {
      //存储图片的信息
      spuImageList: [],
      //存储销售属性的数组
      spuSaleAttrList: [],
      //存储平台属性的数组
      attrInfoList: [],
      //存储skuInfo 的
      skuInfo: {
        //第一类收集的数据是父组件给的
        "category3Id": 0,
        "spuId": 0,
        "tmId": 0,
        //第二类：需要通过数据双向绑定收集的数据
        "price": 0,
        "weight": "",
        "skuName": "",
        "skuDesc": "",
        //第三类：需要自己写代码收集
        "skuAttrValueList": [
          //   {
          //     "attrId": 0,
          //     "valueId": 0,
          //   }
        ],
        "skuDefaultImg": "",
        "skuImageList": [
          //   {
          //     "id": 0,
          //     "imgName": "string",
          //     "imgUrl": "string",
          //     "isDefault": "string",
          //     "skuId": 0,
          //     "spuImgId": 0
          //   }
        ],
        "skuSaleAttrValueList": [
          //   {
          //     "id": 0,
          //     "saleAttrId": 0,
          //     "saleAttrName": "string",
          //     "saleAttrValueId": 0,
          //     "saleAttrValueName": "string",
          //     "skuId": 0,
          //     "spuId": 0
          //   }
        ],
      },
      spu: {},
      //收集图片的数据的字段
      imageList: []
    }
  },
  methods: {
    //后去skuForm数组
    async getData(spu, cForm) {
      let { category1Id, category2Id, category3Id } = cForm
      //收集父组件给的数据
      this.skuInfo.category3Id = category3Id
      this.skuInfo.tmId = spu.tmId
      this.skuInfo.spuId = spu.id
      this.spu = spu
      //获取图片的数据
      let result = await this.$API.spu.reqSpuImageList(spu.id)
      if (result.code == 200) {
        let list = result.data
        list.forEach(item => {
          item.isDefault = 0
        });
        this.spuImageList = list
      }

      // 获取销售属性的数据的接口
      let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id)
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data
      }

      //获取平台属性的数据的接口
      let result2 = await this.$API.spu.reqAttrInfoList(category1Id, category2Id, category3Id)
      if (result2.code == 200) {
        this.attrInfoList = result2.data
      }
    },
    //table表格复选框的回调
    handleSelectionChange(params) {
      //获取用户选中图片的信息，但是需要注意收集的信息钟缺少isDefault
      this.imageList = params
    },
    //用排他方法设置一个默认
    changeDefault(row) {
      //排他
      this.spuImageList.forEach(item => {
        if (item == row) {
          item.isDefault = 1
          this.skuInfo.skuDefaultImg = row.imgUrl
        } else {
          item.isDefault = 0
        }
      });
    },
    //取消按钮的回调
    cancel() {
      this.$emit('changeScene', { scene: 0, flag: '' })
      // 清除数据
      Object.assign(this._data, this.$options.data())
    },
    //点击保存的回调
    async save() {
      //收集数据
      const { attrInfoList, skuInfo, spuSaleAttrList } = this
      //平台属性
      attrInfoList.forEach(item => {
        //当前平台属性用户进行选择
        if (item.attrIdAndValue) {
          const [attrId, valueId] = item.attrIdAndValue.split(":")
          //   携带给服务器参数应该是个对象
          let obj = { attrId, valueId }
          skuInfo.skuAttrValueList.push(obj)
        }
      })
      //图片
      skuInfo.skuImageList = this.spuImageList
      //销售属性
      spuSaleAttrList.forEach(item => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(":")
          let obj = { saleAttrId, saleAttrValueId }
          skuInfo.skuSaleAttrValueList.push(obj)
        }
      });
      //发请求
      let result = await this.$API.spu.reqAddSku(skuInfo)
      if (result.code == 200) {
        this.$message({ type: 'success', message: '成功保存' })
        //通知父组件切换页面
        this.$emit('changeScene', { scene: 0, flag: '保存' })
        // 清除数据
        Object.assign(this._data, this.$options.data())
      } else {
        console.error();
      }
    }
  }
}
</script>

<style>
</style>
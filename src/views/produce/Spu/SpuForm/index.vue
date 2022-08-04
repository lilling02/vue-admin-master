<template>
  <div>
    <el-form ref="form" label-width="80px" :model='spu'>
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU的名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <!-- 选择的选项的值是value  选择后会将value变成 select 的value -->
          <el-option :label="tm.tmName" :value="tm.id" v-for="(tm,index) in tradeMarkList"
            :key="tm.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" rows='4' placeholder="描述" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片：action图片上传的地址 on-preview：当图片预览时候 file-list:照片墙需要展示的数据-->
        <el-upload action="/api/admin/product/fileUpload" list-type="picture-card"
          :file-list="spuImageList" :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
          :on-success="handleSuccess">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择销售属性`" v-model="attrIdAndAttrName">
          <el-option :label="unSelect.name" :value="`${unSelect.id}:${unSelect.name}`"
            v-for="(unSelect,index) in unSelectSaleAttr" :key="unSelect.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled='!attrIdAndAttrName'
          @click="addSaleAttr">添加销售属性</el-button>
        <!-- 展示的是当前Spu属于自己的销售属性 -->
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{row,$index}">
              <!-- row是spu.spuSaleAttrList -->
              <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" closable
                :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index, 1)">
                {{tag.saleAttrValueName}}
              </el-tag>
              <!-- 一下的结构是按钮和输入框切换 -->
              <!--  @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm" 
                 v-model="inputValue"-->
              <el-input class="input-new-tag" v-if="row.inputVisible" ref="saveTagInput"
                size="small" v-model="row.inputValue" @blur="handleInputConfirm(row)">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" style="margin-top:10px"
                @click="addAttrValue(row,$index)">添加
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini"
                @click="(row,$index)=>{spu.spuSaleAttrList.splice($index, 1)}"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrupdateSpu">保存</el-button>
        <el-button @click="cansle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'spuForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      //存储SPU信息的对象
      spu: {
        "category3Id": '',
        "description": "",
        "id": '',
        "spuImageList": [
          //   {
          //     // "id": 0,
          //     // "imgName": "string",
          //     // "imgUrl": "string",
          //     // "spuId": ''
          //   }
        ],
        "spuName": "",
        "spuSaleAttrList": [
          //   {
          //     "baseSaleAttrId": 0,
          //     "id": 0,
          //     "saleAttrName": "",
          //     "spuId": 0,
          //     "spuSaleAttrValueList": [
          //       {
          //         "baseSaleAttrId": 0,
          //         "id": 0,
          //         "isChecked": "",
          //         "saleAttrName": "",
          //         "saleAttrValueName": "",
          //         "spuId": 0
          //       }
          //     ]
          //   }
        ],
        "tmId": ''
      },
      //存储品牌列表的对象
      tradeMarkList: [],
      //存储照片墙的数组
      spuImageList: [],
      // 存储平台中全部的销售属性的数组 
      saleAttrList: [],
      //收集未被选择后的销售属性ID
      attrIdAndAttrName: '',


    };
  },
  methods: {
    //照片墙删除图片的回调
    handleRemove(file, fileList) {
      //file是删除的那张图片信息  fileList是还剩余的图片的信息
      //对于照片墙已有的图片有name，url 将来整理参数要去掉
      this.spuImageList = fileList
    },
    //照片墙图片上传成功的回调
    handleSuccess(response, file, fileList) {
      // 收集图片信息
      this.spuImageList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //初始化SpuForm数据
    async initSpuData(row) {
      //获取SPU信息的数据
      let spuResult = await this.$API.spu.reqSpu(row.id)
      if (spuResult.code == 200) {
        this.spu = spuResult.data
      } else {
        console.error();
      }
      //获取品牌的信息
      let tradeMarkListResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkListResult.code == 200) {
        this.tradeMarkList = tradeMarkListResult.data
      } else {
        console.error();
      }
      //获取照片墙
      let spuImageListResult = await this.$API.spu.reqSpuImageList(row.id)
      if (spuImageListResult.code == 200) {
        let listArr = spuImageListResult.data
        //因为elementUI展示图片需要固定的数组格式所以处理数组
        listArr.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        });
        this.spuImageList = listArr
      } else {
        console.error();
      }

      // 获取平台中全部的销售属性 
      let BaseSaleAttrListResult = await this.$API.spu.reqBaseSaleAttrList()
      if (BaseSaleAttrListResult.code == 200) {
        this.saleAttrList = BaseSaleAttrListResult.data
      } else {
        console.error();
      }
    },
    //点击添加销售属性的回调
    addSaleAttr() {
      //把收集到的销售属性的数据进行分割
      let [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':')
      //   向SPU的spuSaleAttrList数组添加一个新的销售属性
      let newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] }
      this.spu.spuSaleAttrList.push(newSaleAttr)
      //清空销售属性
      this.attrIdAndAttrName = ''
    },
    //点击添加销售属性值的回调
    addAttrValue(row, $index) {
      //点击销售属性值按钮时候，button变input
      //挂载在销售属性身上的响应式数据inputVisible控制button与input切换
      this.$set(row, 'inputVisible', true)
      // 通过响应式数据inputValue字段手机新增的销售属性值
      this.$set(row, 'inputValue', '')
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus()
      });
    },
    //el-input 表格添加属性的输入框 失去焦点的回调
    handleInputConfirm(row) {
      //新增的销售属性值的名字不能为空
      if (row.inputValue.trim() == '') {
        this.$message('请输入正确的属性值')
        return
      }
      //   结构出需要的属性
      let { baseSaleAttrId, inputValue } = row
      //属性值不能重复 重复返回false  不重复返回true
      let result = row.spuSaleAttrValueList.every(item => item.saleAttrValueName != inputValue)
      //就是有重复的属性值直接中止
      if (result == false) {
        this.$message('请不要输入重复的属性值')
        return
      }
      //   整合成数组添加AttrValue
      row.spuSaleAttrValueList.push({ baseSaleAttrId, saleAttrValueName: inputValue })
      //input框变
      row.inputVisible = false
    },
    //addOrupdateSpu 保存按钮的回调
    async addOrupdateSpu() {
      // 整理参数 ：需要整理照片抢的数据
      //携带参数：对于图片需要携带imageName与imageUrl
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url
        }
      })
      let result = await this.$API.spu.reqAddORUpdateSpu(this.spu)
      if (result.code == 200) {
        this.$message({ type: 'success', message: '保存成功' })
        this.$emit('changeScene', { scene: 0, flag: this.spu.id ? '修改' : "添加" })

      } else {
        console.error();
      }
      //清理数据 Object.assign合并对象 this._data可以操作data当中响应式数据，this.$options.data()当前组件的配置对象
      Object.assign(this._data, this.$options.data())
    },
    //点击添加SPU按钮的时候发请求的函数
    async addSpuData(category3Id) {
      // 获取平台中全部的销售属性 
      let BaseSaleAttrListResult = await this.$API.spu.reqBaseSaleAttrList()
      if (BaseSaleAttrListResult.code == 200) {
        this.saleAttrList = BaseSaleAttrListResult.data
      } else {
        console.error();
      }
      //获取品牌的信息
      let tradeMarkListResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkListResult.code == 200) {
        this.tradeMarkList = tradeMarkListResult.data
      } else {
        console.error();
      }
      //设置category3Id
      this.spu.category3Id = category3Id
    },
    //点击取消的回调
    cansle() {
      // 取消添加，场景值变为0
      this.$emit('changeScene', { scene: 0, flag: '' })
      //清理数据 Object.assign合并对象 this._data可以操作data当中响应式数据，this.$options.data()当前组件的配置对象
      Object.assign(this._data, this.$options.data())
    }
  },
  computed: {
    //计算出还未选择的销售属性
    unSelectSaleAttr() {
      //整个平台销售属性就三个
      return this.saleAttrList.filter((item) => {
        //  this.saleAttrList是所有的销售属性   this.spu.spuSaleAttrList是已有的销售属性 我们要筛选出出未被使用的销售属性
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name != item1.saleAttrName
        })
      })

    }
  },

}
</script>

<style >
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
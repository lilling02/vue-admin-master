import request from '@/utils/request'
import { method } from 'lodash'

//获取SPU列表护具的接口
///admin/product/{page}/{limit} get page limit category3id
export const reqSpuList = (page,limit,category3Id)=>{
    return request({url:`/api/admin/product/${page}/${limit}`,method:'get',params:{category3Id}})
}

// 获取某一个SPU 信息       /admin/product/getSpuById/{spuId}
export const reqSpu= (spuId)=>{
    return request({url:`/api/admin/product/getSpuById/${spuId}`,method:'get'})
}

// 获取品牌的信息      /admin/product/baseTrademark/getTrademarkList
export const reqTradeMarkList= ()=>{
    return request({url:`/api/admin/product/baseTrademark/getTrademarkList`,method:'get'})
}

// 获取照片墙               /admin/product/spuImageList/{spuId}
export const reqSpuImageList= (spuId)=>{
    return request({url:`/api/admin/product/spuImageList/${spuId}`,method:'get'})
}

// 获取平台中全部的销售属性  /admin/product/baseSaleAttrList
export const reqBaseSaleAttrList= ()=>{
    return request({url:`/api/admin/product/baseSaleAttrList`,method:'get'})
}

//修改spu||添加spu：对于修改或则添加，携带给服务器的参数大致一样的，区别在于携带的参数是否带id
export const reqAddORUpdateSpu = (spuInfo) =>{
    //添加和修改都放在spuInfo里面
    //携带的参数带id---修改spu
    if (spuInfo.id) {
        //携带的参数不带id---增加spu
        return request({url:`/api/admin/product/updateSpuInfo`,method:'post',data:spuInfo})
    }else{
        return request({url:`/api/admin/product/saveSpuInfo`,method:'post',data:spuInfo})
    }
}

//删除Spu
// /admin/product/deleteSpu/{spuId}
export const reqDeleteSpu= (spuId)=>{
    return request({url:`/api/admin/product/deleteSpu/${spuId}`,method:'delete'})
}

//获取图片的数据的接口
///admin/product/spuImageList/{spuId}  get
// export const reqSpuImageList = (spuId=>{
//     return request({url:`/api/admin/product/spuImageList/${spuId}`,method:'get'})
// })

// 获取销售属性的数据的接口
///admin/product/spuSaleAttrList/{spuId} get
export const reqSpuSaleAttrList = (spuId=>{
    return request({url:`/api/admin/product/spuSaleAttrList/${spuId}`,method:'get'})
})

//获取平台属性的数据的接口
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfoList = ((category1Id,category2Id,category3Id)=>{
    return request({url:`/api/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})
})

//添加sku
// /admin/product/saveSkuInfo post
export const reqAddSku = ((skuInfo)=>{
    return request({url:`/api/admin/product/saveSkuInfo`,method:'post',data:skuInfo})
})

//获取sku列表的接口 
// /admin/product/findBySpuId/{spuId}  get
export const reqSkuList = ((spuId)=>{
    return request({url:`/api/admin/product/findBySpuId/${spuId}`,method:'get'})
})

//平台属性管理模块请求文件
import request from '@/utils/request'

//获取一级分类数据 的接口
///admin/product/get/category1/{id}
export const reqCategory1List = ()=>{
    return request({url:`/api/admin/product/getCategory1`,method:'get'})
}

//获取二级分类数据的接口
///admin/product/getCategory2/${category1Id}
export const reqCategory2List = (category1Id)=>{
    return request({url:`/api/admin/product/getCategory2/${category1Id}`,method:'get'})
}

//获取三级分类数据的接口
///admin/product/getCategory3/{category2Id}
export const reqCategory3List = (category2Id)=>{
    return request({url:`/api/admin/product/getCategory3/${category2Id}`,method:'get'})
}

//获取平台的属性的接口
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfoList = (category1Id,category2Id,category3Id)=>{
    return request({url:`/api/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})
}

// 添加属性与属性值接口
///admin/product/saveAttrInfo
export const reqAddOrUpdataAttr = (data)=>{
    return request({url:`/api/admin/product/saveAttrInfo`,method:'post',data})
}
// {
//     "attrName": "string", 属性名
//     "attrValueList": [ 属性名中的属性值，属性值可以是很多个，因此需要数组
//       {
//         "attrId": 0,  属性Id
//         "valueName": "string" 属性值的名字
//       }
//     ],
//     "categoryId": 0, 要的是category3Id
//     "categoryLevel": 0, 
//   }
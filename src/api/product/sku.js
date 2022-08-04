//关于SKU的API

import request from '@/utils/request';

//sku列表的接口
// /admin/product/list/{page}/{limit}
export const reqSkuList = (page,limit) =>{
    return request({url:`/api/admin/product/list/${page}/${limit}`,method:'get'})
}

//产品上架
///admin/product/onSale/{skuId}
export const reqSale= (skuId) =>{
    return request({url:`/api/admin/product/onSale/${skuId}`,method:'get'})
}

//产品下架
export const reqCancelSale= (skuId) =>{
    return request({url:`/api/admin/product/cancelSale/${skuId}`,method:'get'})
}

// 获取SKU详情的接口
///admin/product/getSkuById/{skuId}
export const reqSkuById= (skuId) =>{
    return request({url:`/api/admin/product/getSkuById/${skuId}`,method:'get'})
}

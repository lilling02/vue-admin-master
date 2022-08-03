// 这个模块主要是获取怕你拍管理的数据模块
import request from '@/utils/request'

//获取品牌列表接口
// /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList=(page,limit)=>request({url:`/api/admin/product/baseTrademark/${page}/${limit}`,method:'get' })

//处理添加品牌的操作
// /admin/product/baseTrademark/save post 要带两个参数：品牌名称。品牌LOGO
//处理修改品牌
// /admin/product/baseTrademark/update put 携带三个参数:id,品牌名称,品牌LOGO
export const reqAddOrUpdateTradeMark = (tradeMark)=>{
    //如果带给服务器的数据携带ID---修改品牌信息
    if (tradeMark.id) {
        return request({url:`/api/admin/product/baseTrademark/update`,method:'put',data:tradeMark})
    }else{
        // 没有Id  新增品牌
        return request({url:`/api/admin/product/baseTrademark/save`,method:'post',data:tradeMark})
    }
}

// 删除品牌的操作
export const reqDeleteTradeMark = (id) =>{
    return request({url:`/api/admin/product/baseTrademark/remove/${id}`,method:'delete'})
}
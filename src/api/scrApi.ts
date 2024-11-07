import request from "@/utils/scrRequest";
//查询屏车间打印数据
export function QueryScreEPrintData(data: any){
    return request({
        url: "/api/Scree/QueryScreEPrintData",
        method: "post",
        data,
    });
}
//打印屏车间标签
export function PrintScreePcbLabel(data: any){
    return request({
        url: "/api/Scree/PrintScreePcbLabel",
        method: "post",
        data,
    });
}

//工治具上线
export function ToolOnline(data: any){
    return request({
        url: "/api/OqcIpTest/ToolOnline",
        method: "post",
        data,
    });
}

//OqcIp 测试过站
export function OqcIpTestOut(data: any){
    return request({
        url: "/api/OqcIpTest/OqcIpTestOut",
        method: "post",
        data,
    });
}

//查询不良代码及生产计划号信息
export function QueryDefectCode(data: any){
    return request({
        url: "/api/OqcIpTest/QueryDefectCode",
        method: "post",
        params:{
            containerName:data
        }
    });
}

//不良品记录
export function OqcIpTefectProductRecord(data: any){
    return request({
        url: "/api/OqcIpTest/OqcIpTefectProductRecord",
        method: "post",
        data,
    });
}

//功能测试工治具上线
export function OqcFunctionTestOut(data: any){
    return request({
        url: "/api/OqcFunctionTest/OqcFunctionTestOut",
        method: "post",
        data
    });
}

//OqcIp 测试过站
export function FTQueryDefectCode(data: any){
    return request({
        url: "/api/OqcFunctionTest/QueryDefectCode",
        method: "post",
        params:{
            containerName:data
        }
    });
}

//查询不良代码及生产计划号信息
export function FTToolOnline(data: any){
    return request({
        url: "/api/OqcFunctionTest/ToolOnline",
        method: "post",
        data
    });
}

//不良品记录
export function OqcfunctionTefectProductRecord(data: any){
    return request({
        url: "/api/OqcFunctionTest/OqcfunctionTefectProductRecord",
        method: "post",
        data
    });
}

//OqcIp 外观测试过站
export function TPOqcIpTestOut(data: any){
    return request({
        url: "/api/OqcIpAppearance/OqcIpTestOut",
        method: "post",
        params:{
            containerName:data
        }
    });
}

//查询外观不良代码及生产计划号信息
export function TPQueryDefectCode(data: any){
    return request({
        url: "/api/OqcIpAppearance/QueryDefectCode",
        method: "post",
        data
    });
}

//外观不良品记录
export function TPOqcIpTefectProductRecord(data: any){
    return request({
        url: "/api/OqcIpAppearance/OqcIpTefectProductRecord",
        method: "post",
        data
    });
}
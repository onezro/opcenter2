import request from "@/request/reportRequest";
//原材料
export function QueryMaterialCode(data: any) {
    return request({
        url: "/api/RawMaterialsTracedbackQuery/QueryMaterialCode",
        method: "post",
        data,
    });
}
//原材料
export function QueryContainerDetail(data: any) {
    return request({
        url: "/api/RawMaterialsTracedbackQuery/QueryContainerDetail",
        method: "post",
        data,
    });
}
//MES条码追溯
export function QueryMESContainerTracedBack(data: any) {
    return request({
      url: "/api/RawMaterialsTracedbackQuery/QueryMESContainerTracedBack",
      method: "post",
      data
    });
  }

//过序追溯
export function InsequenceRetraceFirstInfo(data: any) {
    return request({
      url: "/api/RawMaterialsTracedbackQuery/InsequenceRetraceFirstInfo",
      method: "post",
      data
    });
  }
  //过序追溯
  export function InsequenceRetraceTwoInfo(data: any) {
    return request({
      url: "/api/RawMaterialsTracedbackQuery/InsequenceRetraceTwoInfo",
      method: "post",
      data
    });
  }

//获取线体
export function QuertAllMfgLineInfo() {
  return request({
    url: "/api/RawMaterialsTracedbackQuery/QuertAllMfgLineInfo",
    method: "post",
    
  });
}
//获取工序
export function QuertAllSpecNameInfo() {
  return request({
    url: "/api/RawMaterialsTracedbackQuery/QuertAllSpecNameInfo",
    method: "post",
  });
}

import request from "@/request/reportRequest";
export function QueryMaterialCode(data: any) {
    return request({
        url: "/api/BurningData/QueryMaterialCode",
        method: "post",
        data,
    });
}
export function QueryContainerDetail(data: any) {
    return request({
        url: "/api/BurningData/QueryContainerDetail",
        method: "post",
        data,
    });
}
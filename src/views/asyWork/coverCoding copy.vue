<template>
  <div class="flex flex-col w-full h-full">
    <div class="h-[40px] min-h-[40px] pl-2 pr-2 flex justify-between items-center">
      <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
      <div class="flex items-center">
        <div>
          自动打印间隔：<span class="text-lg font-bold pl-1 pr-1 bg-slate-300">{{ setTime }}S</span>
        </div>
        <el-button type="info" class="ml-2" @click="openPrint">设定间隔</el-button>
      </div>
    </div>
    <div class="w-full flex-1 flex">
      <div class="setwidth w-[320px]">
        <div class="w-full h-full box">
          <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
            <span class="ml-5">基本信息</span>
          </div>
          <div class="p-[10px]">
            <el-form class="inbound" ref="formRef" :model="form" label-width="auto">
              <el-form-item label="生产计划号" class="mb-[5px] flex">
                <selectTa ref="selectTable" :table="orderTable" :selectWidth="170" :columns="orderColumns"
                  :max-height="400" :tableWidth="700" :defaultSelectVal="defaultSelectVal" :keywords="{
                    label: 'MfgOrderName',
                    value: 'MfgOrderName',
                  }" @radioChange="(...args: any) => radioChange(args)">
                </selectTa>
                <el-tooltip content="刷新" placement="top">
                  <el-icon class="ml-2" color="#006487" :class="isLoding" size="24" @click="getOrderData">
                    <RefreshRight />
                  </el-icon>
                </el-tooltip>
              </el-form-item>
              <el-form-item v-for="f in formHeader" :key="f.value" :label="f.label">
                <span class="font-bold text-lg leading-[30px]" :class="f.value == 'TodayNum' ? 'text-[#00B400]' : ''">
                  {{ formText(f.value) }}</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="w-[calc(100%-320px)]">
        <!-- <div class="w-full"> -->
        <div class="w-full h-full flex flex-col">
          <div>
            <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
              <span class="ml-5"> 扫描条码</span>
            </div>
            <div class="h-[200px] pt-3 pr-5 pl-5">
              <el-form class="inbound" ref="formRef" :inline="true" :model="form" @submit.native.prevent>
                <el-form-item label="扫描条码" class="mb-2">
                  <el-input v-model.trim="barCode" ref="inputRef" :autofocus="inputFocus" style="width: 500px"
                    placeholder="请扫描条码" @keyup.enter.native="getChange" />
                </el-form-item>

                <el-form-item :class="[stopsForm.result == 'OK' ? 'switchok' : 'switchng']" class="mb-2">
                  <el-switch v-model="stopsForm.result" size="large" style="
                      zoom: 1.2;
                      --el-switch-on-color: #ff4949;
                      --el-switch-off-color: #13ce66;
                    " :active-value="'NG'" :inactive-value="'OK'" active-text="NG" inactive-text="OK" />
                </el-form-item>
              </el-form>
              <div class="mb-2">
                <el-button :type="isAuto ? 'danger' : 'primary'" :disabled="form.MfgOrderName == ''"
                  @click="autoPrint">{{ isAuto ? "关闭自动打印" : "自动打印" }}</el-button>
                <el-button type="warning" :disabled="form.MfgOrderName == ''" @click="print">手动打印</el-button>
                <!-- <el-button type="success" :disabled="form.MfgOrderName == ''" @click="print">补打条码</el-button> -->
              </div>
              <div class="text-xl font-bold text-[#00B400]" v-show="msgType === true || msgTitle === ''">
                {{ msgTitle === "" ? "请扫描条码" : msgTitle }}
              </div>
              <div class="text-xl font-bold text-[red]" v-show="msgType === false && msgTitle !== ''">
                {{ msgTitle }}
              </div>
            </div>
          </div>

          <div class="flex flex-col flex-1 tabs-css">
            <div class="h-[35px] flex items-center justify-between text-lg text-[#fff] bg-[#006487]">
              <span class="ml-5">历史过站记录</span>
              <div class="mr-5">
                <el-checkbox-group v-model="checkedHis" class="laser-table-filter">
                  <el-checkbox v-for="c in checkedHisList" :label="`${c.label}(${changeDataLength(c.value)})`"
                    :value="c.value" @change="changeHis(c.value)">
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <table-tem :showIndex="true" :tableData="changeData" :tableHeight="tableHeight" :columnData="columnData1"
              :pageObj="pageObj" @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange"></table-tem>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="showSetTime" draggable title="自动打印时间设定" width="300px" :append-to-body="true"
      :close-on-click-modal="false" :close-on-press-escape="false" @close="setCancel">
      <el-form ref="formRef" :model="timeForm" label-width="auto">
        <el-form-item label="间隔时间" prop="time">
          <el-input-number v-model="timeForm.setTime" :min="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setCancel">关闭</el-button>
          <el-button type="primary" @click="setPrint"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="badVisible" title="不良登记" width="60%" :append-to-body="true" :close-on-click-modal="false"
      :close-on-press-escape="false" align-center @close="badCancel">
      <div>
        <div>
          <div class="h-[30px] pl-3 flex items-center text-base text-[#fff] bg-[#006487]">
            基本信息
          </div>
          <el-form ref="badFormRef" :model="badheadForm" label-width="auto">
            <el-form-item label="PCB条码" class="mb-[5px] flex">
              <el-input v-model="badForm.containerName" style="width: 160px" disabled />
            </el-form-item>
            <el-row>
              <el-col :span="8">
                <el-form-item label="生产计划号" class="mb-[5px] flex">
                  <el-input v-model="badheadForm.MfgOrderName" style="width: 160px" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="mb-[5px]" label="产品编码">
                  <el-input v-model="badheadForm.ProductName" style="width: 160px" disabled /> </el-form-item></el-col>
              <el-col :span="10">
                <el-form-item class="mb-[5px]" label="产品描述">
                  <el-input v-model="badheadForm.ProductDesc" style="width: 320px" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div>
          <div class="h-[30px] pl-3 flex items-center text-base text-[#fff] bg-[#006487]">
            不良原因
          </div>
          <table-temp :showIndex="true" :show-select="true" :tableData="BadtableData" :tableHeight="300"
            :columnData="badColumn" @handleSelectionChange="badSelectionChange"></table-temp>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="badCancel">取消</el-button>
          <el-button type="primary" @click="badSubmit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import tableTem from "@/components/tableTem/index.vue";
import badInfoTem from "@/components/badInfoTem/index.vue";
import formTem from "@/components/formTem/index.vue";
import feedTemp from "@/components/feedTemp/index.vue";
import selectTa from "@/components/selectTable/index.vue";
import { useAppStore } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { checkStringType } from "@/utils/barcodeFormat";
import type { Formspan, FormHeader, OrderData } from "@/typing";
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import { QueryMoveHistory, OrderQuery } from "@/api/dipApi";
import {
  CoverInstallPrint,
  CoverInstallStationMoveOut,
  DefectProductRecord,
  QueryDefectCode,
} from "@/api/asyApi";

import {
  ref,
  reactive,
  onMounted,
  nextTick,
  computed,
  onBeforeMount,
  onBeforeUnmount,
  watch,
} from "vue";
import { cloneDeep } from "lodash-es";
interface StopsForm {
  containerName: string;
  workstationName: string;
  result: string;
  userAccount: string;
  txnDate: string;
}

interface ToolList {
  WorkStationName: string;
  OrderNumber: string;
  ToolName: string;
  sort: number;
  MaterialName: string;
  CompName: string;
}
const appStore = useAppStore();
const userStore = useUserStoreWithOut();
const opui = appStore.getOPUIReal();
const inputRef = ref();
const inputFocus = ref(true);
const barCode = ref("");
const stopsForm = ref<StopsForm>({
  containerName: "",
  workstationName: opui.station || "",
  userAccount: userStore.getUserInfo,
  txnDate: "",
  result: "OK",
});

const form = ref<InstanceType<typeof Formspan>>({
  MfgOrderName: "",
  ProductName: "",
  ProductDesc: "",
  Qty: "",
  ERPOrder: "",
  PlannedStartDate: "",
  PlannedCompletionDate: "",
  AllNum: "",
  TodayNum: "",
});
const formHeader = reactive<InstanceType<typeof FormHeader>[]>([
  // {
  //     label: "生产计划号",
  //     value: "MfgOrderName",
  //     disabled: true,
  //     type: "input",
  //     width: "",
  // },

  {
    label: "产品机型",
    value: "BD_ProductModel",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "工单号",
    value: "ERPOrder",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "计划数量",
    value: "Qty",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "产品编码",
    value: "ProductName",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "产品描述",
    value: "ProductDesc",
    disabled: true,
    type: "textarea",
    width: 300,
  },
  // {
  //   label: "过站总数",
  //   value: "AllNum",
  //   disabled: true,
  //   type: "input",
  //   width: "",
  // },
  // {
  //   label: "实时过站",
  //   value: "TodayNum",
  //   disabled: true,
  //   type: "input",
  //   width: "",
  // },
]);
const columnData1 = reactive([
  {
    text: true,
    prop: "ContainerName",
    label: "成品SN条码",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "BD_EmployeeName",
    label: "扫描人",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "TxnDate",
    label: "扫描时间",
    width: "",
    align: "1",
  },
]);
const tableData1 = ref([]);
const tableHeight = ref(0);
const pageObj = ref({
  pageSize: 100,
  currentPage: 1,
});

const msgTitle = ref("");
const msgType = ref(true);
const hisForm = ref({
  MfgOrderName: "",
  workstationName: opui.station,
});
const orderTable = ref<InstanceType<typeof OrderData>>({
  data: [],
});
const orderColumns = ref([
  { label: "生产计划号", width: "", prop: "MfgOrderName" },
  { label: "产品编码", width: "", prop: "ProductName" },
  { label: "产线", width: "", prop: "MfgLineDesc" },
  { label: "状态", width: "", prop: "OrderStatusDesc" },
  { label: "计划开始", width: "", prop: "PlannedStartDate" },
  { label: "计划完成", width: "", prop: "PlannedCompletionDate" },
]);
const defaultSelectVal = ref<string[]>([]);
const isLoding = ref("");
const checkedHis = ref(["today"]);
const checkedHisList = ref([
  {
    value: "today",
    label: "当日过序",
  },
  {
    value: "all",
    label: "工序汇总",
  },
]);

interface Defect {
  isDefectLabel: string;
  isDefectType: number | string;
}
interface BadForm {
  containerName: string;
  DefectDetails: Array<Defect>;
  workstationName: string;
  userAccount: string;
}
const getBadForm = ref({
  containerName: "",
  workstationName: opui.station,
});
const badForm = ref<BadForm>({
  containerName: "",
  DefectDetails: [],
  workstationName: opui.station || "",
  userAccount: userStore.getUserInfo,
});
const badheadForm = ref<InstanceType<typeof Formspan>>({
  MfgOrderName: "",
  ProductName: "",
  ProductDesc: "",
});
const badColumn = reactive([
  {
    text: true,
    prop: "isDefectReasonName",
    label: "不良代码",
    width: "100",
    align: "1",
  },
  {
       text: true,
    prop: "isDefectReasonDesc",
    label: "不良原因",
    width: "",
    min:true,
    align: "1",
  },
]);
const badVisible = ref(false);
const changeList = ref([]);
const BadtableData = ref([]);

onBeforeMount(() => {
  clearInterval(timer.value);
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getOrderData();
  getFocus();
});
onBeforeUnmount(() => {
  clearInterval(timer.value);
  window.addEventListener("resize", getScreenHeight);
});

//获取光标
const getFocus = () => {
  inputFocus.value = false;
  setTimeout(() => {
    inputFocus.value = true;
  }, 100);
};

const formText = (data: string) => {
  let key = data as keyof typeof form;
  return form.value[key];
};

//获取过站历史记录
const getHisData = () => {
  QueryMoveHistory(hisForm.value).then((res: any) => {
    tableData1.value = res.content;
  });
};
const changeHis = (val: any) => {
  if (checkedHis.value.length == 0) {
    checkedHis.value = [];
  } else {
    checkedHis.value = [];
    checkedHis.value[0] = val;
  }
};
const changeData = computed(() => {
  if (checkedHis.value[0] == "today") {
    return geTodayData();
  } else {
    return tableData1.value;
  }
});
const changeDataLength = (val: any) => {
  if (val == "today") {
    let dataLength = geTodayData();
    return dataLength.length;
  } else {
    return tableData1.value.length;
  }
};
const geTodayData = () => {
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  function getDateFromDateTimeString(dateTimeString: any) {
    return dateTimeString.split(" ")[0];
  }
  const todayDataArray = tableData1.value.filter((item: any) => {
    return getDateFromDateTimeString(item.TxnDate) === todayString;
  });
  return todayDataArray;
};

//过站
const getChange = () => {
  let barCodeData = barCode.value;
  if (checkStringType(barCodeData) == "result") {
    if (barCodeData == "ng" || barCodeData == "NG") {
      stopsForm.value.result = "NG";
    } else {
      stopsForm.value.result = "OK";
    }
  } else {
    stopsForm.value.containerName = barCodeData;
    if (stopsForm.value.result == "OK") {
      msgTitle.value = "";
      msgType.value = true;
      CoverInstallStationMoveOut(stopsForm.value).then((res: any) => {
        msgTitle.value = res.msg;
        msgType.value = res.success;
        stopsForm.value.containerName = "";
        if (res.success) {
          getHisData();
        }
        getFocus();
      });
      barCode.value = "";
    } else {
      badForm.value.containerName = barCodeData;
      getBadForm.value.containerName = barCodeData
        QueryDefectCode(getBadForm.value).then((res: any) => {
        if (!res.success) {
          msgTitle.value = res.msg;
          msgType.value = res.success;
          return;
        }
        badheadForm.value.MfgOrderName = res.content.MfgOrderName;
        badheadForm.value.ProductName = res.content.ProductName;
        badheadForm.value.ProductDesc = res.content.ProductDesc;
        badheadForm.value.Qty = res.content.Qty;
        BadtableData.value = res.content.defectCode;
        badVisible.value = true;
      });
    }
  }
  // stopsForm.value.containerName = barCodeData;
  // msgTitle.value = "";
  // msgType.value = true;
  // CoverInstallStationMoveOut(stopsForm.value).then((res: any) => {
  //   msgTitle.value = res.msg;
  //   msgType.value = res.success;
  //   stopsForm.value.containerName = "";
  //   if (res.success) {
  //     getHisData();
  //   }
  //   getFocus();
  // });
  barCode.value = "";
};
const badSelectionChange = (data: any) => {
  let content = cloneDeep(data);
  changeList.value = content;
};
const badCancel = () => {
  badVisible.value = false;
  BadtableData.value = [];
  changeList.value = [];
  badForm.value.DefectDetails = [];
  stopsForm.value.result = "OK";
};
const badSubmit = () => {
  changeList.value.forEach((c: any) => {
    badForm.value.DefectDetails.push({
      isDefectLabel: c.isDefectReasonName,
      isDefectType: 1,
    });
  });
  DefectProductRecord(badForm.value).then((res: any) => {
    msgTitle.value = "";
    msgType.value = true;
    if (res.success) {
      badVisible.value = false;
      BadtableData.value = [];
      changeList.value = [];
      badForm.value.DefectDetails = [];
      stopsForm.value.result = "OK";
      getFocus();
    }
    ElNotification({
      title: "提示信息",
      message: res.msg,
      type: res.success ? "success" : "error",
    });
  });
};

const radioChange = (args: any) => {
  isAuto.value = false;
  if (args[1] == null) {
    form.value.MfgOrderName = "";
    form.value.ProductName = "";
    form.value.ProductDesc = "";
    form.value.PlannedStartDate = "";
    form.value.BD_ProductModel = "";
    form.value.BD_SoftVersion = "";
    form.value.PlannedCompletionDate = "";
    form.value.Qty = "";
    form.value.ERPOrder = "";
    tableData1.value = [];
  } else {
    if (args[1] !== form.value.MfgOrderName ||form.value.MfgOrderName == "") {
      form.value.MfgOrderName = args[0].MfgOrderName;
      form.value.ProductName = args[0].ProductName;
      form.value.ProductDesc = args[0].ProductDesc;
      form.value.BD_ProductModel = args[0].BD_ProductModel;
      form.value.BD_SoftVersion = args[0].BD_SoftVersion;
      form.value.PlannedStartDate = args[0].PlannedStartDate;
      form.value.PlannedCompletionDate = args[0].PlannedCompletionDate;
      form.value.Qty = args[0].Qty;
      form.value.AllNum = args[0].AllNum;
      form.value.TodayNum = args[0].TodayNum;
      form.value.ERPOrder = args[0].ERPOrder;
      hisForm.value.MfgOrderName = args[0].MfgOrderName;
      getHisData();
    } else {
    }
    // orderTable.value.data.forEach((v: any) => {
    //   if (v.MfgOrderName == args[1]) {
  }
};
const getOrderData = () => {
  isAuto.value = false;
  isLoding.value = "is-loading";
  defaultSelectVal.value = [];
  OrderQuery({
    lineName: opui.line,
    OrderTypeName: "Assembly",
    WorkStationName: opui.station,
  }).then((res: any) => {
    let data = res.content;
    let timer = setTimeout(() => {
      isLoding.value = "";
      clearTimeout(timer);
    }, 2000);
    if (data !== null && data.length !== 0) {
      orderTable.value.data = data;
      if (data.length >= 1) {
        defaultSelectVal.value[0] = data[0].MfgOrderName;
      }
    }
  });
};

const timer = ref();
const isAuto = ref(false);
const setTime = ref<any>(localStorage.getItem("SETTIME") || 5);
const timeForm = ref({
  setTime: 0,
});
const showSetTime = ref(false);
const openPrint = () => {
  showSetTime.value = true;
  timeForm.value.setTime = setTime.value;
};
const setPrint = () => {
  let data = timeForm.value.setTime;
  setTime.value = data;
  showSetTime.value = false;
  localStorage.setItem("SETTIME", JSON.stringify(data));
};
const setCancel = () => {
  showSetTime.value = false;
};
watch(
  () => isAuto.value,
  (newVal) => {
    if (newVal) {
      clearInterval(timer.value);
      timer.value = setInterval(() => {
        printData();
      }, setTime.value * 1000);
    } else {
      clearInterval(timer.value);
    }
  },
  {
    deep: true,
  }
);
const autoPrint = () => {
  isAuto.value = !isAuto.value;
};
const print = () => {
  isAuto.value = false;
  printData();
};

const printData = () => {
  CoverInstallPrint(form.value.MfgOrderName).then((res: any) => {
    msgType.value = res.success;
    if (res.success) {
      msgTitle.value = "打印成功";
    } else {
      isAuto.value = false;
      clearInterval(timer.value);
      msgTitle.value = res.msg;
    }
  });
};

//分页
const handleSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 390;
  });
};
</script>

<style lang="scss">
.inbound .el-form-item__label {
  font-size: 16px;
}

.setwidth {
  flex: 0 0 320px;
}

.box {
  border-right: 2px solid #cbcbcb;
}

.tabs-css .el-tabs--border-card {
  border-top: 1px solid #006487;
}

.tabs-css .el-tabs__header {
  background-color: #006487 !important;
}

.tabs-css .el-tabs__content {
  padding: 5px 0px;
}

.tabs-css .el-tabs__item {
  font-size: 1.1rem;
}

.tabs-css .el-tabs--border-card>.el-tabs__header .el-tabs__item {
  color: #fff;
  // padding: 0 !important;
}

.tabs-css .el-tabs__item.is-active {
  // color: #fff;
  color: #006487 !important;
  // font-weight: bold;
}

.el-switch__label {
  font-weight: bold;
}

.switchok .el-switch__label.is-active {
  color: #13ce66;
}

.switchng .el-switch__label.is-active {
  color: #ff4949;
}

.tabs-css .el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled):hover {
  // color: #fff;
  // background-color: #fff;
  background-color: rgba($color: #fff, $alpha: 0.8);
}

.saveAsDialog {
  min-width: 954px;
}

// .checked{
//   height: 14px;
// }
.checked .el-checkbox {
  height: 14px;
}
</style>
<style lang="scss" scoped>
::v-deep .laser-table-filter .el-checkbox__inner {
  /* 你的样式 */
  background-color: #409eff !important;
  /* 使用 !important，但请谨慎 */
  color: white !important;
}

::v-deep .laser-table-filter .el-checkbox__label {
  /* 你的样式 */
  color: white !important;
  font-size: 1.1rem;
}
</style>

<template>
  <div class="ag-grid-container">
    <div style="padding: 4px" class="btn-toolbar">
      <span>
        Grid API:
        <button class="btn btn-primary mx-1" @click="gridOptions.api?.selectAll()">全选</button>
        <button class="btn btn-primary mx-1" @click="gridOptions.api?.deselectAll()">
          取消全选
        </button>
      </span>
    </div>
    <div>
      全局搜索：
      <input
        class="mr-2 form-control d-inline-block"
        @keyup="onQuickFilterChanged"
        type="text"
        id="quickFilterInput"
        placeholder="请输入需要搜索的内容"
      />
    </div>
    <ag-grid-vue
      style="width: 80vw; height: 500px"
      class="ag-theme-alpine"
      rowSelection="multiple"
      :gridOptions="gridOptions"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
      :modules="modules"
      :animateRows="true"
      :enableRangeSelection="true"
      :sideBar="false"
      :suppressClickEdit="true"
      rowModelType="serverSide"
      @grid-ready="onGridReady"
      @model-updated="onModelUpdated"
      @cell-clicked="onCellClicked"
      @cell-double-clicked="onCellDoubleClicked"
      @cell-context-menu="onCellContextMenu"
      @cell-value-changed="onCellValueChanged"
      @cell-focused="onCellFocused"
      @row-selected="onRowSelected"
      @selection-changed="onSelectionChanged"
      @filter-modified="onFilterModified"
      @virtual-row-removed="onVirtualRowRemoved"
      @row-clicked="onRowClicked"
      @column-everything-changed="onColumnEverythingChanged"
      @column-row-group-changed="onColumnRowGroupChanged"
      @column-value-Changed="onColumnValueChanged"
      @column-moved="onColumnMoved"
      @column-visible="onColumnVisible"
      @column-group-Opened="onColumnGroupOpened"
      @column-resized="onColumnResized"
      @column-pinned="onColumnPinned"
    >
    </ag-grid-vue>
  </div>
  <el-dialog
    v-model="store.dialogVisible"
    title="编辑"
    width="30%"
    :before-close="handleClose"
    append-to-body
    destroy-on-close
  >
    <EditorForm />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, provide } from 'vue'
import type { Ref } from 'vue'
import type {
  GridOptions,
  ColDef,
  ColGroupDef,
  GridApi,
  GridReadyEvent,
  CellClickedEvent,
  ModelUpdatedEvent,
  CellContextMenuEvent,
  CellValueChangedEvent,
  CellFocusedEvent,
  RowSelectedEvent,
  SelectionChangedEvent,
  FilterModifiedEvent,
  VirtualRowRemovedEvent,
  RowClickedEvent,
  ColumnEverythingChangedEvent,
  ColumnRowGroupChangedEvent,
  ColumnValueChangedEvent,
  ColumnVisibleEvent,
  ColumnGroupOpenedEvent,
  ColumnResizedEvent
} from 'ag-grid-community'
import { AgGridVue } from 'ag-grid-vue3'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import DateComponent from '../components/DateComponent.vue'
import HeaderGroupComponent from '../components/HeaderGroupComponent.vue'
import OperatorComponent from '../components/OperatorComponent.vue'
import EditorForm from '../components/EditorForm.vue'
import RefData from '../data/refData'
import { createRandomPhoneNumber, pad, textHighlight } from '../utils'
import type { RowDataType } from '../type'
import { countryCellRenderer, skillsCellRenderer, percentCellRenderer } from '../customRender'
import { useStore } from '../store'
// 全局引入企业版所有功能。待熟悉下列模块后，改为按需引入。
import 'ag-grid-enterprise'

// 按需引入各类辅助模块
import { ModuleRegistry } from '@ag-grid-community/core'
import { ClipboardModule } from '@ag-grid-enterprise/clipboard'
import { ExcelExportModule } from '@ag-grid-enterprise/excel-export'
import { MenuModule } from '@ag-grid-enterprise/menu'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import { CsvExportModule } from '@ag-grid-community/csv-export'
import { RangeSelectionModule } from '@ag-grid-enterprise/range-selection'
import { ServerSideRowModelModule } from '@ag-grid-enterprise/server-side-row-model'
// import { GridChartsModule } from '@ag-grid-enterprise/charts'
// import { SparklinesModule } from '@ag-grid-enterprise/sparklines'
// import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel'
// import { FiltersToolPanelModule } from '@ag-grid-enterprise/filter-tool-panel'
// import { MasterDetailModule } from '@ag-grid-enterprise/master-detail'
// import { RichSelectModule } from '@ag-grid-enterprise/rich-select'
// import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping'
// import { SetFilterModule } from '@ag-grid-enterprise/set-filter'
// import { MultiFilterModule } from '@ag-grid-enterprise/multi-filter'
// import { AdvancedFilterModule } from '@ag-grid-enterprise/advanced-filter'
// import { SideBarModule } from '@ag-grid-enterprise/side-bar'
// import { StatusBarModule } from '@ag-grid-enterprise/status-bar'
// import { ViewportRowModelModule } from '@ag-grid-enterprise/viewport-row-model'
// import { InfiniteRowModelModule } from '@ag-grid-community/infinite-row-model'

const modules = [
  ClientSideRowModelModule,
  // 右键菜单
  MenuModule,
  // 导出为excel
  ExcelExportModule,
  // 导出为csv
  CsvExportModule,
  // 右键菜单剪切板
  ClipboardModule,
  // 单元格范围选择模块
  RangeSelectionModule,
  // 服务端加载数据
  ServerSideRowModelModule
  // SideBarModule
  // FiltersToolPanelModule,
  // SparklinesModule,
  // GridChartsModule,
  // MasterDetailModule,
  // MultiFilterModule,
  // RichSelectModule,
  // RowGroupingModule,
  // SetFilterModule,
  // StatusBarModule,
  // ViewportRowModelModule,
  // ColumnsToolPanelModule,
  // AdvancedFilterModule,
  // InfiniteRowModelModule
]
// 注册功能模块
ModuleRegistry.registerModules(modules)

const defaultColDef: ColDef = {
  sortable: true,
  filter: true,
  flex: 1
}
const gridApi: Ref<GridApi | null> = ref(null)
const gridColumnApi = ref({})
const gridOptions: Ref<GridOptions> = ref({})
provide('gridOptions', gridOptions)
// 初始化每列的数据
const columnDefs: Ref<(ColDef | ColGroupDef)[]> = ref([])
// 初始化行的数据
const rowData: Ref<RowDataType[]> = ref([])
const searchValue = ref('')
const store = useStore()

// 挂载前
onBeforeMount(() => {
  gridOptions.value.components = { agDateInput: DateComponent }
  createColumnDefs()
})

// 高亮搜素自负
const highlightCellRender = (params: any) => textHighlight(params.value, searchValue.value)

// 关闭编辑表单
const handleClose = () => {
  store.closeEditForm()
}

// 每列的配置
const createColumnDefs = () => {
  columnDefs.value = [
    {
      headerName: '#',
      minWidth: 60,
      width: 60,
      checkboxSelection: true,
      sortable: false,
      suppressMenu: true,
      pinned: true
    },
    {
      headerName: '员工',
      headerGroupComponent: HeaderGroupComponent,
      children: [
        {
          headerName: '姓名',
          field: 'name',
          editable: true,
          width: 150,
          pinned: true,
          cellRenderer: highlightCellRender
        },
        {
          headerName: '年龄',
          field: 'years',
          editable: true,
          width: 150,
          pinned: true,
          cellRenderer: highlightCellRender
        },
        {
          headerName: '国家',
          field: 'country',
          width: 150,
          cellRenderer: (params: any) => countryCellRenderer(params, searchValue.value),
          pinned: true,
          filterParams: {
            cellRenderer: (params: any) => countryCellRenderer(params, searchValue.value),
            cellHeight: 20
          }
        },
        {
          headerName: 'DOB',
          field: 'date',
          width: 120,
          editable: true,
          pinned: true,
          cellRenderer: (params: any) => {
            const date = new Date(params.value)
            return textHighlight(
              `${date.getFullYear()}/${pad(date.getMonth() + 1, 2)}/${pad(date.getDate(), 2)}`,
              searchValue.value
            )
          },
          filter: 'agDateColumnFilter',
          columnGroupShow: 'open'
        }
      ]
    },
    {
      headerName: 'IT 技能',
      children: [
        {
          headerName: '技能',
          width: 125,
          sortable: false,
          cellRenderer: skillsCellRenderer
        },
        {
          headerName: '熟练程度',
          field: 'proficiency',
          width: 120,
          cellRenderer: percentCellRenderer
        }
      ]
    },
    {
      headerName: '联系方式',
      children: [
        {
          headerName: '固定电话',
          field: 'landline',
          width: 150,
          filter: 'text',
          cellRenderer: highlightCellRender
        },
        {
          headerName: '地址',
          field: 'address',
          width: 500,
          filter: 'text',
          cellRenderer: highlightCellRender
        }
      ]
    },
    {
      headerName: '操作',
      width: 150,
      cellRenderer: OperatorComponent
    }
  ]
}

const getRowData = (rowNum: number) => {
  if (!rowNum) rowNum = 100
  const data = []
  for (let i = 0; i < rowNum; i++) {
    const countryData = RefData.COUNTRIES[i % RefData.COUNTRIES.length]
    data.push({
      name:
        RefData.FIRST_NAMES[i % RefData.FIRST_NAMES.length] +
        ' ' +
        RefData.LAST_NAMES[i % RefData.LAST_NAMES.length],
      skills: {
        android: Math.random() < 0.4,
        html5: Math.random() < 0.4,
        mac: Math.random() < 0.4,
        windows: Math.random() < 0.4,
        css: Math.random() < 0.4
      },
      date: RefData.DOBs[i % RefData.DOBs.length],
      address: RefData.ADDRESSES[i % RefData.ADDRESSES.length],
      years: Math.round(Math.random() * 100),
      proficiency: Math.round(Math.random() * 100),
      country: countryData.country,
      continent: countryData.continent,
      language: countryData.language,
      mobile: createRandomPhoneNumber(),
      landline: createRandomPhoneNumber()
    })
  }
  return data
}


// 快速筛选过滤
const onQuickFilterChanged = (event: KeyboardEvent | any) => {
  const value = event.target?.value
  searchValue.value = value
  gridApi.value?.setQuickFilter(value)
  gridApi.value?.redrawRows()
}


// 以下是一些常用ag-grid事件
// 网格已经初始化时触发，大部分api可调用。（此时可能没有显示完全）
const onGridReady = (params: GridReadyEvent) => {
  gridApi.value = params.api
  gridColumnApi.value = params.columnApi
  gridApi.value.sizeColumnsToFit()

  const updateData = (data: any[]) => {
    params.api.setServerSideDatasource({
      getRows: (params) => {
        const response = {
          success: true,
          rows: data.slice(params.request.startRow, params.request.endRow)
        }
        // 模拟请求数据的延迟
        setTimeout(function () {
          if (response.success) {
            params.success({ rowData: response.rows })
          } else {
            params.fail()
          }
        }, 500)
      }
    })
  }

  updateData(getRowData(10000))
}

// 显示的行已更改。排序、筛选或树展开后触发
const onModelUpdated = (event: ModelUpdatedEvent) => {
  // console.log('onModelUpdated: ', event)
}
// 单击单元时触发
const onCellClicked = (event: CellClickedEvent) => {
  // console.log('onCellClicked', event)
}
// 双击单元时触发
const onCellDoubleClicked = (event: ModelUpdatedEvent) => {
  // console.log('onCellDoubleClicked: ', event)
}
// 右击单元时触发
const onCellContextMenu = (event: CellContextMenuEvent) => {
  // console.log('onCellContextMenu: ', event)
}
// 单元数据改变后，粘贴等数据改变后触发
const onCellValueChanged = (event: CellValueChangedEvent) => {
  // console.log('onCellValueChanged: ', event)
}
// 单元聚焦时触发
const onCellFocused = (event: CellFocusedEvent) => {
  // console.log('onCellFocused: ', event)
}
// 行被选中或取消选中时触发
const onRowSelected = (event: RowSelectedEvent) => {
  // console.log('onRowSelected: ', event)
}
// 选中行更改时触发
const onSelectionChanged = (event: SelectionChangedEvent) => {
  // console.log('onSelectionChanged: ', event)
}
// 筛选过滤，已修改，但未点击“确认”时触发
const onFilterModified = (event: FilterModifiedEvent) => {
  // console.log('onFilterModified: ', event)
}
// 虚拟列表行删除时触发。
const onVirtualRowRemoved = (event: VirtualRowRemovedEvent) => {
  // console.log('onVirtualRowRemoved: ', event)
}
// 点击行时触发
const onRowClicked = (event: RowClickedEvent) => {
  // console.log('onRowClicked: ', event)
}
// 列有任何更改时触发
const onColumnEverythingChanged = (event: ColumnEverythingChangedEvent) => {
  // console.log('onColumnEverythingChanged: ', event)
}
// 添加或删除了行、列时触发
const onColumnRowGroupChanged = (event: ColumnRowGroupChangedEvent) => {
  // console.log('onColumnRowGroupChanged: ', event)
}
// 当前列的数据，添加或删除时触发
const onColumnValueChanged = (event: ColumnValueChangedEvent) => {
  // console.log('onColumnValueChanged: ', event)
}
// 列移动时触发
const onColumnMoved = (event: ColumnValueChangedEvent) => {
  // console.log('onColumnMoved: ', event)
}
// 列显示隐藏时触发
const onColumnVisible = (event: ColumnVisibleEvent) => {
  // console.log('onColumnVisible: ', event)
}
// 列组打开关闭时触发
const onColumnGroupOpened = (event: ColumnGroupOpenedEvent) => {
  // console.log('onColumnGroupOpened: ', event)
}
// 列的大小发生变化时触发
const onColumnResized = (event: ColumnResizedEvent) => {
  // console.log('onColumnResized: ', event)
}
// 固定或取消列时触发
const onColumnPinned = (event: ColumnResizedEvent) => {
  // console.log('onColumnPinned: ', event)
}
</script>

<style lang="scss">
.highlight {
  color: rgb(250, 158, 50);
}

.ag-grid-container {
  min-height: 60vh;
}

.ag-cell {
  padding-top: 2px !important;
  padding-bottom: 2px !important;
}

label {
  font-weight: normal !important;
}

.div-percent-bar {
  display: inline-block;
  height: 100%;
  position: relative;
  z-index: 0;
}

.div-percent-value {
  position: absolute;
  padding-left: 4px;
  font-weight: bold;
  font-size: 13px;
  z-index: 100;
}

.div-outer-div {
  display: inline-block;
  height: 100%;
  width: 100%;
}

.ag-menu {
  z-index: 200;
}

.toolbar button {
  margin-left: 5px;
  margin-right: 5px;
  padding: 2px;
}
</style>
../customRender

<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="广告名称：">
            <el-input v-model="listQuery.advertName" class="input-width" placeholder="广告名称"></el-input>
          </el-form-item>
          <el-form-item label="广告位置：">
            <el-select v-model="listQuery.type" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in typeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="到期时间：">
            <el-date-picker
              class="input-width"
              v-model="listQuery.dueTime"
              type="datetime"
              placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()">添加广告</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="homeAdvertiseTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="60" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="广告名称" align="center">
          <template slot-scope="scope">{{scope.row.advertName}}</template>
        </el-table-column>
        <el-table-column label="广告位置" width="120" align="center">
          <template slot-scope="scope">{{scope.row.type | formatType}}</template>
        </el-table-column>
        <el-table-column label="广告图片" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.advertImage"></template>
        </el-table-column>
        <el-table-column label="时间" width="240" align="center">
          <template slot-scope="scope">
            <p>开始时间：{{scope.row.startTime | formatTime}}</p>
            <p>到期时间：{{scope.row.dueTime | formatTime}}</p>
          </template>
        </el-table-column>
        <el-table-column label="下线/上线" width="120" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleUpdateStatus(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.isOnline">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="点击次数" width="60" align="center">
          <template slot-scope="scope">{{scope.row.clickNum}}</template>
        </el-table-column>
        <el-table-column label="生成订单" width="60" align="center">
          <template slot-scope="scope">{{scope.row.orderCount}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.size"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.page"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
    import {fetchList, updateStatus, deleteHomeAdvertise} from '@/api/homeAdvertise';
    import {formatDate} from '@/utils/date';
    import {checkSuccess, getList, getTotal} from "@/utils/response";

    const defaultListQuery = {
        page: 1,
        size: 10,
    };
    const defaultTypeOptions = [
        {
            label: '小程序首页轮播',
            value: 1
        },
        {
            label: '小程序banner',
            value: 2
        },
        {
            label: 'PC端首页轮播',
            value: 3
        },
        {
            label: 'PC端分类广告',
            value: 4
        }
    ];
    export default {
        name: 'homeAdvertiseList',
        data() {
            return {
                listQuery: Object.assign({}, defaultListQuery),
                typeOptions: Object.assign({}, defaultTypeOptions),
                list: null,
                total: null,
                listLoading: false,
                multipleSelection: [],
                operates: [
                    {
                        label: "删除",
                        value: 0
                    }
                ],
                operateType: null
            }
        },
        created() {
            this.getList();
        },
        filters: {
            formatType(type) {
                const index = type - 1;
                return defaultTypeOptions[index].label;
            },
            formatTime(time) {
                if (time == null || time === '') {
                    return 'N/A';
                }
                let date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
            },
        },
        methods: {
            handleResetSearch() {
                this.listQuery = Object.assign({}, defaultListQuery);
            },
            handleSearchList() {
                this.listQuery.page = 1;
                if ('' === this.listQuery.advertName) delete this.listQuery.advertName;
                if ('' === this.listQuery.type) delete this.listQuery.type;
                if (null === this.listQuery.dueTime) delete this.listQuery.dueTime;
                this.listQuery.dueTime = this.listQuery.dueTime.getTime().toString();
                this.getList();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleSizeChange(val) {
                this.listQuery.page = 1;
                this.listQuery.size = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            handleUpdateStatus(index, row) {
                this.$confirm('是否要修改上线/下线状态?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    updateStatus(row.isOnline, [row.advertCode]).then(response => {
                        this.getList();
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                    });
                }).catch(reason => {
                    this.$message({
                        type: 'success',
                        message: '已取消操作!'
                    });
                    this.getList();
                });
            },
            handleDelete(index, row) {
                this.deleteHomeAdvertise(row.advertCode);
            },
            handleBatchOperate() {
                if (this.multipleSelection < 1) {
                    this.$message({
                        message: '请选择一条记录',
                        type: 'warning',
                        duration: 1000
                    });
                    return;
                }
                let ids = [];
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    ids.push(this.multipleSelection[i].id);
                }
                if (this.operateType === 0) {
                    //删除
                    this.deleteHomeAdvertise(ids);
                } else {
                    this.$message({
                        message: '请选择批量操作类型',
                        type: 'warning',
                        duration: 1000
                    });
                }
            },
            handleAdd() {
                this.$router.push({path: '/sms/addAdvertise'})
            },
            handleUpdate(index, row) {
                this.$router.push({path: '/sms/updateAdvertise', query: {data: row}})
            },
            getList() {
                this.listLoading = true;
                fetchList(this.listQuery).then(response => {
                    this.listLoading = false;
                    console.log(response)
                    if (checkSuccess(response)) {
                        this.list = getList(response);
                        this.total = getTotal(response);
                    }
                })
            },
            deleteHomeAdvertise(ids) {
                this.$confirm('是否要删除该广告?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteHomeAdvertise(ids).then(response => {
                        this.getList();
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    });
                })
            }
        }
    }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>



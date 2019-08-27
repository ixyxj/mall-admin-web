<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>快递单模板</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="freightFare"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="60" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="模板名称" align="center">
          <template slot-scope="scope">{{scope.row.tempName}}</template>
        </el-table-column>
        <el-table-column label="计价方式" width="120" align="center">
          <template slot-scope="scope">{{scope.row.priceMethod}}</template>
        </el-table-column>
        <el-table-column label="数量" align="center">
          <template slot-scope="scope">{{scope.row.quantity}}</template>
        </el-table-column>
        <el-table-column label="起步价" width="120" align="center">
          <template slot-scope="scope">{{scope.row.minPrice}}</template>
        </el-table-column>
        <el-table-column label="增加数量" width="120" align="center">
          <template slot-scope="scope">{{scope.row.inPrice}}</template>
        </el-table-column>
        <el-table-column label="加价" width="120" align="center">
          <template slot-scope="scope">{{scope.row.addPrice}}</template>
        </el-table-column>
        <el-table-column label="运送到" width="120" align="center">
          <template slot-scope="scope">{{scope.row.destination}}</template>
        </el-table-column>
        <el-table-column label="是否启动" width="120" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleUpdateStatus(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.isEnable">
            </el-switch>
          </template>
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
    import {fetchList, updateStatus, deleteFreightFare} from '@/api/freightFare';
    import {checkSuccess, getList, getTotal} from "@/utils/response";

    const defaultListQuery = {
        page: 1,
        size: 10,
    };

    export default {
        name: 'freightFare',
        data() {
            return {
                listQuery: Object.assign({}, defaultListQuery),
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
        methods: {
            handleResetSearch() {
                this.listQuery = Object.assign({}, defaultListQuery);
            },
            handleSearchList() {
                this.listQuery.page = 1;
                if ('' === this.listQuery.advertName) delete this.listQuery.advertName;
                if ('' === this.listQuery.type) delete this.listQuery.type;
                if (null === this.listQuery.dueTime) delete this.listQuery.dueTime;
                else this.listQuery.dueTime = this.listQuery.dueTime.getTime().toString();
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
                this.$router.push({path: '/oms/addFreightFare'})
            },
            handleUpdate(index, row) {
                this.$router.push({path: '/oms/updateFreightFare', query: {data: row}})
            },
            getList() {
                this.listLoading = true;
                fetchList(this.listQuery).then(response => {
                    this.listLoading = false;
                    console.log(response);
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



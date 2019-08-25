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
          <el-form-item label="文章标题：">
            <el-input v-model="listQuery.title" class="input-width" placeholder="广告名称"></el-input>
          </el-form-item>
          <el-form-item label="文章分类：">
            <el-select v-model="listQuery.categoryName" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in categoryOptions"
                         :key="item.id"
                         :label="item.categoryName"
                         :value="item.categoryName">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()">分类管理</el-button>
      <el-button size="mini" class="btn-add" @click="handleAdd()">发布文章</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="articleTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="60" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="封面图片" width="120" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.image"></template>
        </el-table-column>
        <el-table-column label="标题" align="center">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column label="分类" align="center">
          <template slot-scope="scope">{{scope.row.categoryName}}</template>
        </el-table-column>
        <el-table-column label="是否显示" width="120" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleUpdateStatus(scope.$index, scope.row)"
              :active-value="0"
              :inactive-value="1"
              v-model="scope.row.isEnable">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否置顶" width="120" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleUpdateTop(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.isTop">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatTime}}</template>
        </el-table-column>
        <el-table-column label="查看次数" width="120" align="center">
          <template slot-scope="scope">{{scope.row.visits}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleShow(scope.$index, scope.row)">查看
            </el-button>
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
    import {fetchList, updateStatus,
      updateTopStatus, deleteArticle,
      fetchListWithCategory} from '@/api/article';
    import {formatDate} from '@/utils/date';
    import {checkSuccess, getList, getTotal, getArray} from "@/utils/response";

    const defaultListQuery = {
        page: 1,
        size: 10,
    };
    export default {
        name: 'articleList',
        data() {
            return {
                listQuery: Object.assign({}, defaultListQuery),
                categoryOptions: null,
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
            this.getCategoryList();
        },
        filters: {
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
                if ('' === this.listQuery.title) delete this.listQuery.title;
                if ('' === this.listQuery.categoryName) delete this.listQuery.categoryName;
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
            // op show status
            handleUpdateStatus(index, row) {
                this.$confirm('是否要修改显示状态?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    updateStatus(row.isOnline, [row.articleCode]).then(response => {
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
            //op top status
            handleUpdateTop(index, row) {
                this.$confirm('是否置顶?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  updateTopStatus(row.isTop, [row.articleCode]).then(response => {
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
                let arr = [];
                arr.push(row.articleCode);
                this.deleteHomeArticle(arr);
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
                this.$router.push({path: '/content/addArticle'})
            },
            handleUpdate(index, row) {
                this.$router.push({path: '/content/updateArticle', query: {data: row}})
            },
            //show article
            handleShow(index, row) {

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
            getCategoryList() {
                fetchListWithCategory().then(response => {
                  console.log(response);
                    if (checkSuccess(response)) {
                      this.categoryOptions = getArray(response);
                    }
                })
            },
            deleteHomeArticle(ids) {
                this.$confirm('是否要删除文章?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteArticle(ids).then(response => {
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



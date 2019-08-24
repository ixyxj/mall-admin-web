<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="articleTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="分类图标" width="120" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.categoryLogo"></template>
        </el-table-column>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="scope">{{scope.row.categoryName}}</template>
        </el-table-column>
        <el-table-column label="专题数量" align="center">
          <template slot-scope="scope">{{scope.row.topicNum}}</template>
        </el-table-column>
        <el-table-column label="是否显示" width="120" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleUpdateStatus(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.isEnable">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="分类排序" width="120" align="center">
          <template slot-scope="scope">
            <el-input
              value="0"
              v-model="scope.row.sort"
              clearable=""></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
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
    <!--    add category-->
    <el-dialog title="添加分类" :visible.sync="selectDialogVisible" width="50%">
      <el-card shadow="never">
        <el-form :model="selectDialogData"
                 :rules="rules"
                 ref="homeAdvertiseFrom"
                 label-width="150px"
                 size="small">
          <el-form-item label="类型名称：" prop="categoryName">
            <el-input v-model="selectDialogData.categoryName" class="input-width"></el-input>
          </el-form-item>
          <el-form-item label="分类图标：" prop="categoryLogo">
            <single-upload v-model="selectDialogData.categoryLogo"></single-upload>
          </el-form-item>
          <el-form-item label="是否显示：">
            <template>
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="selectDialogData.isEnable">
              </el-switch>
            </template>
          </el-form-item>
        </el-form>
      </el-card>
      <div style="clear: both;"></div>
      <div slot="footer">
        <el-button  size="small" @click="selectDialogVisible = false">取 消</el-button>
        <el-button  size="small" type="primary" @click="handleSelectDialogConfirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
    import SingleUpload from '@/components/Upload/qiniuSingleUpload'
    import {fetchList, updateStatus, deleteArticleCate, addArticleCate} from '@/api/articleCate';
    import {checkSuccess, getList, getTotal, getArray} from "@/utils/response";

    const defaultListQuery = {
        page: 1,
        size: 10,
    };
    const defaultArticleCate = {
        categoryCode: null,
      categoryLogo: null,
      categoryName: null,
      createTime: null,
      createUser: null,
      isEnable: 1,
    };
    export default {
        name: 'articleCateList',
        components: {SingleUpload},
        data() {
            return {
              rules: {
                  categoryName: [
                    {require: true, message: '请输入分类名称', trigger: true}
                  ],
                  categoryLogo: [
                    {require: true, message: '请添加分类图标', trigger: true}
                  ],
              },
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
              operateType: null,
              selectDialogVisible: false,
              selectDialogData: Object.assign({}, defaultArticleCate)
            }
        },
        created() {
            this.getList();
        },
        filters: {

        },
        methods: {
            handleResetSearch() {
                this.listQuery = Object.assign({}, defaultListQuery);
            },
            handleSearchList() {
                this.listQuery.page = 1;
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
                    updateStatus(row.isEnable, [row.categoryCode]).then(response => {
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
                arr.push(row.categoryCode);
                this.deleteArticleCate(arr);
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
              this.selectDialogVisible = true;
            },
            handleUpdate(index, row) {
                this.$router.push({path: '/sms/updateArticleCate', query: {data: row}})
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
            deleteArticleCate(ids) {
                this.$confirm('是否要删除文章分类?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                  deleteArticleCate(ids).then(response => {
                      if (checkSuccess(response)) {
                          this.getList();
                          this.$message({
                            type: 'success',
                            message: this.$t('message.deleteSuccess')
                          });
                      }
                  });
                })
            },
            //dialog
            handleSelectDialogConfirm() {
                addArticleCate(this.selectDialogData).then(response => {
                    if (checkSuccess(response)) {
                        this.selectDialogVisible = false;
                        this.getList();
                        this.$message({
                          type: 'success',
                          message: this.$t('message.submitSuccess')
                        });
                    }
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



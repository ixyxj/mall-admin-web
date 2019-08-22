<template> 
  <div class="app-container">
<!--    统计标签-->
    <el-card class="operate-container" shadow="never">
      <el-tag type="success">全部商品({{this.total}})</el-tag>
    </el-card>
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="handleSearchList()"
          type="primary"
          size="small">
          查询结果
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input
              clearable=""
              style="width: 203px"
              v-model="listQuery.productName"
              placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品货号：">
            <el-input style="width: 203px" v-model="listQuery.productSn" placeholder="商品货号"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader
              clearable
              v-model="selectProductCateValue"
              :options="productCateOptions">
            </el-cascader>
          </el-form-item>
          <el-form-item label="商品品牌：">
            <el-select v-model="listQuery.brandId" placeholder="请选择品牌" clearable>
              <el-option
                v-for="item in brandOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上架状态：">
            <el-select v-model="listQuery.isUpshelf" placeholder="全部" clearable>
              <el-option
                v-for="item in publishStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select v-model="listQuery.status" placeholder="全部" clearable>
              <el-option
                v-for="item in verifyStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddProduct()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.product.id}}</template>
        </el-table-column>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.product.logo"></template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.product.productName}}</p>
            <!--            <p>品牌：{{scope.row.brandName}}</p>-->
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="120" align="center">
          <template slot-scope="scope">
            <p>价格：￥{{scope.row.product.sellPrice/1000.0}}</p>
<!--            <p>货号：{{scope.row.product.productCode}}</p>-->
          </template>
        </el-table-column>
        <el-table-column label="标签" width="140" align="center">
          <template slot-scope="scope">
            <p>上架：
              <el-switch
                @change="handleProductStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.product.isUpshelf">
              </el-switch>
            </p>
            <!--            <p>新品：-->
            <!--              <el-switch-->
            <!--                @change="handleNewStatusChange(scope.$index, scope.row)"-->
            <!--                :active-value="1"-->
            <!--                :inactive-value="0"-->
            <!--                v-model="scope.row.newStatus">-->
            <!--              </el-switch>-->
            <!--            </p>-->
            <p>推荐：
              <el-switch
                @change="handleProductStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.product.recommend">
              </el-switch>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template slot-scope="scope">{{1}}</template>
        </el-table-column>
        <el-table-column label="SKU库存" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="handleShowSkuEditDialog(scope.$index, scope.row)"
                       circle></el-button>
          </template>
        </el-table-column>
        <el-table-column label="销量" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sale}}</template>
        </el-table-column>
        <el-table-column label="审核状态" width="100" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.verifyStatus | verifyStatusFilter}}</p>
            <p>
              <el-button
                type="text"
                @click="handleShowVerifyDetail(scope.$index, scope.row)">审核详情
              </el-button>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                size="mini"
                @click="handleShowProduct(scope.$index, scope.row)">查看
              </el-button>
              <el-button
                size="mini"
                @click="handleUpdateProduct(scope.$index, scope.row)">编辑
              </el-button>
            </p>
            <p>
              <el-button
                size="mini"
                @click="handleShowLog(scope.$index, scope.row)">日志
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </p>
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
    <el-dialog
      title="编辑货品信息"
      :visible.sync="editSkuInfo.dialogVisible"
      width="40%">
      <span>商品货号：</span>
      <span>{{editSkuInfo.productId}}</span>
      <el-input placeholder="按sku编号搜索" v-model="editSkuInfo.keyword" size="small" style="width: 50%;margin-left: 20px">
        <el-button slot="append" icon="el-icon-search" @click="handleSearchEditSku"></el-button>
      </el-input>
      <el-table style="width: 100%;margin-top: 20px"
                :data="editSkuInfo.stockList"
                border>
        <el-table-column
          label="SKU编号"
          align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.id"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="重量"
          align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.weight"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="单位"
          align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.unite"></el-input>
          </template>
        </el-table-column>
<!--        <el-table-column-->
<!--          v-for="(item,index) in editSkuInfo.productAttr"-->
<!--          :label="item.name"-->
<!--          :key="item.id"-->
<!--          align="center">-->
<!--          <template slot-scope="scope">-->
<!--            {{getProductSkuSp(scope.row,index)}}-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column
          label="商品库存"
          width="80"
          align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.stockTotal"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="库存预警值"
          width="100"
          align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.warnTotal"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSkuInfo.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSkuConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
    import {
        fetchList,
        updateDeleteStatus,
        updateNewStatus,
        updateProductStatus
    } from '@/api/product'
    import {fetchList as fetchSkuStockList, update as updateSkuStockList} from '@/api/skuStock'
    import {fetchList as fetchProductAttrList} from '@/api/productAttr'
    //import {fetchList as fetchBrandList} from '@/api/brand'
    import {fetchListWithChildren} from '@/api/productCate'
    import {
        checkSuccess,
        getList as getResplist,
        getTotal as getRespListTotal,
    } from '@/utils/response'
    import {getArray} from "../../../utils/response";

    const defaultListQuery = {
        page: 1,
        size: 10
    };
    export default {
        name: "productList",
        data() {
            return {
                editSkuInfo:{
                    dialogVisible:false,
                    productId:0,
                    // productAttributeCategoryId:null,
                    stockList:[],
                    // productAttr:[],
                    keyword:null
                },
                operates: [
                    {
                        label: "商品上架",
                        value: "publishOn"
                    },
                    {
                        label: "商品下架",
                        value: "publishOff"
                    },
                    {
                        label: "设为推荐",
                        value: "recommendOn"
                    },
                    {
                        label: "取消推荐",
                        value: "recommendOff"
                    },
                    {
                        label: "设为新品",
                        value: "newOn"
                    },
                    {
                        label: "取消新品",
                        value: "newOff"
                    },
                    {
                        label: "转移到分类",
                        value: "transferCategory"
                    },
                    {
                        label: "移入回收站",
                        value: "recycle"
                    }
                ],
                operateType: null,
                listQuery: Object.assign({}, defaultListQuery),
                list: null,
                total: null,
                listLoading: true,
                selectProductCateValue: null,
                multipleSelection: [],
                productCateOptions: [],
                brandOptions: [],
                publishStatusOptions: [{
                    value: 1,
                    label: '上架'
                }, {
                    value: 0,
                    label: '下架'
                }],
                verifyStatusOptions: [{
                    value: 1,
                    label: '审核通过'
                }, {
                    value: 0,
                    label: '未审核'
                }]
            }
        },
        created() {
            this.getList();
            // this.getBrandList();
            this.getProductCateList();
        },
        watch: {
            selectProductCateValue: function (newValue) {
                if (newValue != null && newValue.length === 1) {
                    this.listQuery.kindName = newValue[0];
                } else {
                    this.listQuery.kindName = null;
                }
            }
        },
        filters: {
            verifyStatusFilter(value) {
                if (value === 1) {
                    return '审核通过';
                } else {
                    return '未审核';
                }
            }
        },
        methods: {
            getProductSkuSp(row, index) {
                if (index === 0) {
                    return row.sp1;
                } else if (index === 1) {
                    return row.sp2;
                } else {
                    return row.sp3;
                }
            },
            //商品列表
            getList() {
                this.listLoading = true;
                fetchList(this.listQuery).then(response => {
                    console.log(response);
                    this.listLoading = false;
                    if (checkSuccess(response)) {
                        this.list = getResplist(response);
                        this.total = getRespListTotal(response);
                    }
                });
            },
            // getBrandList() {
            //     fetchBrandList({pageNum: 1, pageSize: 100}).then(response => {
            //         this.brandOptions = [];
            //         let brandList = response.data.list;
            //         for (let i = 0; i < brandList.length; i++) {
            //             this.brandOptions.push({label: brandList[i].name, value: brandList[i].id});
            //         }
            //     });
            // },
            getProductCateList() {
                fetchListWithChildren().then(response => {
                    let list = getArray(response);
                    this.productCateOptions = [];
                    for (let i = 0; i < list.length; i++) {
                        this.productCateOptions.push({label: list[i].kindName, value: list[i].kindName});
                    }
                    console.log(this.productCateOptions);
                });
            },
            handleShowSkuEditDialog(index, row) {
                this.editSkuInfo.dialogVisible = true;
                this.editSkuInfo.productId = row.product.id;
                this.editSkuInfo.stockList.pop();
                this.editSkuInfo.stockList.push(row.productStore);
            },
            handleSearchEditSku() {
                fetchSkuStockList(this.editSkuInfo.productId, {keyword: this.editSkuInfo.keyword}).then(response => {
                    this.editSkuInfo.stockList = response.data;
                });
            },
            handleEditSkuConfirm() {
                if (this.editSkuInfo.stockList == null || this.editSkuInfo.stockList.length <= 0) {
                    this.$message({
                        message: '暂无sku信息',
                        type: 'warning',
                        duration: 1000
                    });
                    return
                }
                this.$confirm('是否要进行修改', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    updateSkuStockList(this.editSkuInfo.stockList).then(response => {
                        this.$message({
                            message: '修改成功',
                            type: 'success',
                            duration: 1000
                        });
                        this.editSkuInfo.dialogVisible = false;
                    });
                });
            },
            // 搜索
            handleSearchList() {
                if ('' === this.listQuery.productName) this.listQuery.productName = null;
                this.getList();
            },
            handleAddProduct() {
                this.$router.push({path: '/pms/addProduct'});
            },
            handleBatchOperate() {
                if (this.operateType == null) {
                    this.$message({
                        message: '请选择操作类型',
                        type: 'warning',
                        duration: 1000
                    });
                    return;
                }
                if (this.multipleSelection == null || this.multipleSelection.length < 1) {
                    this.$message({
                        message: '请选择要操作的商品',
                        type: 'warning',
                        duration: 1000
                    });
                    return;
                }
                this.$confirm('是否要进行该批量操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = [];
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        ids.push(this.multipleSelection[i].id);
                    }
                    let product_codes = [];
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        product_codes.push(this.multipleSelection[i].product.productCode);
                    }
                    switch (this.operateType) {
                        case this.operates[0].value:
                            this.updatePublishStatus(1, product_codes);
                            break;
                        case this.operates[1].value:
                            this.updatePublishStatus(0, product_codes);
                            break;
                        case this.operates[2].value:
                            this.updateRecommendStatus(1, product_codes);
                            break;
                        case this.operates[3].value:
                            this.updateRecommendStatus(0, product_codes);
                            break;
                        case this.operates[4].value:
                            this.updateNewStatus(1, ids);
                            break;
                        case this.operates[5].value:
                            this.updateNewStatus(0, ids);
                            break;
                        case this.operates[6].value:
                            break;
                        case this.operates[7].value:
                            this.updateDeleteStatus(1, ids);
                            break;
                        default:
                            break;
                    }
                    this.getList();
                });
            },
            handleSizeChange(val) {
                this.listQuery.pageNum = 1;
                this.listQuery.pageSize = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNum = val;
                this.getList();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            //更新商品状态
            handleProductStatusChange(index, row) {
                this.updateProductStatus(row.product);
            },
            handleResetSearch() {
                this.selectProductCateValue = [];
                this.listQuery = Object.assign({}, defaultListQuery);
            },
            //删除商品
            handleDelete(index, row) {
                this.$confirm('是否要进行删除操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.updateDeleteStatus(row.product.productCode);
                });
            },
            handleUpdateProduct(index, row) {
                this.$router.push({path: '/pms/updateProduct', query: {id: row.id}});
            },
            //查看功能
            handleShowProduct(index, row) {
                console.log("handleShowProduct", row);
                this.$notify({
                    message: this.$t('message.messageNotFinish'),
                    type: 'success',
                    duration: 1000
                });
            },
            handleShowVerifyDetail(index, row) {
                console.log("handleShowVerifyDetail", row);
            },
            //查看日志
            handleShowLog(index, row) {
                console.log("handleShowLog", row);
                this.$notify({
                  message: this.$t('message.messageNotFinish'),
                  type: 'success',
                  duration: 1000
                });
            },

            updateNewStatus(newStatus, ids) {
                let params = new URLSearchParams();
                params.append('ids', ids);
                params.append('newStatus', newStatus);
                updateNewStatus(params).then(response => {
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        duration: 1000
                    });
                });
            },

            // 更新商品状态
            updateProductStatus(product) {
                let data = {
                    isUpshelf: product.isUpshelf,
                    productCode: product.productCode,
                    recommend: product.recommend
                };
                console.log(data);
                updateProductStatus(data).then(response => {
                    console.log(response);
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        duration: 1000
                    });
                });
            },
            // 更新上架状态-批量
            updatePublishStatus(status, product_codes) {
            },
            // 更新推荐状态
            updateRecommendStatus(status, product_codes) {
            },

            // 删除商品
            updateDeleteStatus(productCode) {
                updateDeleteStatus(productCode)
                  .then(response => {
                    if (checkSuccess(response)) {
                        this.$notify({
                          message: this.$t('message.deleteSuccess'),
                          type: 'success',
                          duration: 1000
                        });
                        this.getList();
                    } else {
                        this.$notify.error(this.$t('message.deleteFailure'))
                    }
                  })
                  .catch(function (e) {
                      this.$notify.error(this.$t('message.deleteFailure'))
                  });
            }
        }
    }
</script>
<style></style>



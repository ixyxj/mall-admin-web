<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="freightFare"
             :rules="rules"
             ref="homeAdvertiseFrom"
             label-width="150px"
             size="small">
      <el-form-item label="模板名称：" prop="tempName">
        <el-input v-model="freightFare.tempName" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="费用计算方式：" prop="priceMethod">
        <el-radio-group v-model="freightFare.priceMethod">
          <el-radio :label="0">按重量计算</el-radio>
          <el-radio :label="1">按商品件数计算</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否包邮：" prop="isFree">
        <el-radio-group v-model="freightFare.isFree">
          <el-radio :label="0">自定义</el-radio>
          <el-radio :label="1">包邮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="运送方式：">
        <el-radio-group v-model="freightFare.priceMethod">
          <el-radio :label="0">自营物流</el-radio>
          <el-radio :label="1">按商品件数</el-radio>
        </el-radio-group>
        <el-table

        <p>
          <span style="size: 8px">除指定地区外，其余地区的运费采用“默认运费”</span>
        </p>


      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('freightFare')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('freightFare')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
    import {createFreightFare, updateFreightFare} from '@/api/freightFare'
    import {checkSuccess} from "@/utils/response";
    import Layout from "../../../layout/Layout";

    const defaultFrightFare = {
        addPrice: 0,
        createTime: null,
        createUser: null,
        destination: null,
        id: 0,
        inPrice: 0,
        isFree: 0,
        minPrice: 0,
        priceMethod: 0,
        quantity: 0,
        tempName: null
    };

    export default {
        name: 'freightFareDetail',
        components: {Layout},
        props: {
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                rules: {
                    tempName: [
                        {required: true, message: '请输入模板名称', trigger: 'blur'},
                        {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
                    ],
                    priceMethod: [
                        {required: true, message: '请选择重量计算', trigger: 'blur'}
                    ],
                    isFree: [
                        {required: true, message: '请选择包邮方式', trigger: 'blur'}
                    ]
                },
                freightFare: Object.assign({}, defaultFrightFare)
            }
        },
        created() {
            if (this.isEdit) {
                this.freightFare = this.$route.query.data;
            } else {
                this.freightFare = Object.assign({}, defaultFrightFare);
            }
        },
        methods: {
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('是否提交数据', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            if (this.isEdit) {
                                updateFreightFare(this.freightFare).then(response => {
                                    this.$refs[formName].resetFields();
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success',
                                        duration: 1000
                                    });
                                    this.$router.back();
                                });
                            } else {
                                createFreightFare(this.freightFare).then(response => {
                                    if (checkSuccess(response)) {
                                        this.$refs[formName].resetFields();
                                        this.freightFare = Object.assign({}, defaultFrightFare);
                                        this.$message({
                                            message: this.$t('message.submitSuccess'),
                                            type: 'success',
                                            duration: 1000
                                        });
                                    } else {
                                        this.$message.error(this.$t('message.submitFailure'))
                                    }
                                });
                            }
                        });

                    } else {
                        this.$message({
                            message: '验证失败',
                            type: 'error',
                            duration: 1000
                        });
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.freightFare = Object.assign({}, defaultFrightFare);
            },
        }
    }
</script>
<style scoped>
  .input-width {
    width: 70%;
  }
</style>



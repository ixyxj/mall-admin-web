<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="homeAdvertise"
             :rules="rules"
             ref="homeAdvertiseFrom"
             label-width="150px"
             size="small">
      <el-form-item label="广告名称：" prop="advertName">
        <el-input v-model="homeAdvertise.advertName" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="广告位置：">
        <el-select v-model="homeAdvertise.type">
          <el-option
            v-for="type in typeOptions"
            :key="type.value"
            :label="type.label"
            :value="type.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间：" prop="startTime">
        <el-date-picker
          format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择日期"
          v-model="homeAdvertise.startTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="到期时间：" prop="dueTime">
        <el-date-picker
          format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择日期"
          v-model="homeAdvertise.dueTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="上线/下线：">
        <el-radio-group v-model="homeAdvertise.isOnline">
          <el-radio :label="1">上线</el-radio>
          <el-radio :label="0">下线</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="广告图片：">
        <single-upload v-model="homeAdvertise.advertImage"></single-upload>
      </el-form-item>
      <el-form-item label="排序：" hidden="hidden">
        <el-input v-model="homeAdvertise.sort" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="广告链接：">
        <el-select v-model="selectParentCategory"
                   size="small"
                   placeholder="一级分类"
                   value="">
          <el-option
            v-for="item in categoryParentOptions"
            :key="item.id"
            :label="item.kindName"
            :value="item.kindCode">
          </el-option>
        </el-select>
        <el-select v-model="selectChildCategory" placeholder="二级分类" value="">
          <el-option
            v-for="item in categoryChildOptions"
            :key="item.id"
            :label="item.kindName"
            :value="item.kindCode">
          </el-option>
        </el-select>
        <el-input v-model="url" class="input-width" prop="url"></el-input>
      </el-form-item>
      <el-form-item label="广告备注：">
        <el-input
          class="input-width"
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="homeAdvertise.advertNote">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('homeAdvertiseFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('homeAdvertiseFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
    import SingleUpload from '@/components/Upload/qiniuSingleUpload'
    import {createHomeAdvertise, updateHomeAdvertise} from '@/api/homeAdvertise'
    import {fetchListWithChildren} from "@/api/productCate";
    import {getArray, checkSuccess} from "@/utils/response";
    import {formatDate} from "@/utils/date";

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
    const defaultHomeAdvertise = {
        advertName: null,
        advertImage: null,
        type: 0,
        startTime: null,
        dueTime: null,
        linkUrl: 'http://www.1688bee.com/',
        advertNote: null,
        sort: 0,
        isOnline: 0,
        isTop: 0,
        kindName: null,
        kindCode: null,
    };

    export default {
        name: 'HomeAdvertiseDetail',
        components: {SingleUpload},
        props: {
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                homeAdvertise: null,
                rules: {
                    advertName: [
                        {required: true, message: '请输入广告名称', trigger: 'blur'},
                        {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
                    ],
                    url: [
                        {required: true, message: '请输入广告链接', trigger: 'blur'}
                    ],
                    startTime: [
                        {required: true, message: '请选择开始时间', trigger: 'blur'}
                    ],
                    dueTime: [
                        {required: true, message: '请选择到期时间', trigger: 'blur'}
                    ],
                    advertImage: [
                        {required: true, message: '请选择广告图片', trigger: 'blur'}
                    ],
                    // advertMark: [
                    //     {required: true, message: '请输入内容', trigger: 'blur'}
                    // ]
                },
                typeOptions: Object.assign({}, defaultTypeOptions),
                categoryParentOptions: [],
                selectParentCategory: null,
                categoryChildOptions: [],
                selectChildCategory: null,
                url: null,
            }
        },
        watch: {
            selectParentCategory: function (newValue) {
                this.url = null;
                this.homeAdvertise.kindCode = null;
                this.selectChildCategory = null;
                if (newValue != null) {
                    fetchListWithChildren(newValue).then(response => {
                        if (checkSuccess(response)) {
                            this.categoryChildOptions = getArray(response);
                        }
                    })
                } else {
                    this.categoryChildOptions = [];
                }
            },
            selectChildCategory: function (newValue) {
                this.url = newValue;
                this.homeAdvertise.kindCode = newValue;
                this.homeAdvertise.kindName = this.categoryChildOptions.forEach(option => {
                    if (newValue === option.kindCode) return option.kindName;
                });
            }
        },
        created() {
            if (this.isEdit) {
                this.homeAdvertise = this.$route.query.data;
            } else {
                this.homeAdvertise = Object.assign({}, defaultHomeAdvertise);
            }
            //get parent category
            fetchListWithChildren(0).then(response => {
                if (checkSuccess(response)) {
                    this.categoryParentOptions = getArray(response);
                }
            })
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
                            // this.homeAdvertise.startTime = formatDate(this.homeAdvertise.startTime);
                            // this.homeAdvertise.dueTime = formatDate(this.homeAdvertise.dueTime);{
                            this.homeAdvertise.startTime = this.homeAdvertise.startTime.getTime().toString();
                            this.homeAdvertise.dueTime = this.homeAdvertise.dueTime.getTime().toString();
                            if (this.isEdit) {
                                updateHomeAdvertise(this.$route.query.id, this.homeAdvertise).then(response => {
                                    this.$refs[formName].resetFields();
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success',
                                        duration: 1000
                                    });
                                    this.$router.back();
                                });
                            } else {
                                createHomeAdvertise(this.homeAdvertise).then(response => {
                                    if (checkSuccess(response)) {
                                        this.$refs[formName].resetFields();
                                        this.homeAdvertise = Object.assign({}, defaultHomeAdvertise);
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
                this.homeAdvertise = Object.assign({}, defaultHomeAdvertise);
            },
        }
    }
</script>
<style scoped>
  .input-width {
    width: 70%;
  }
</style>



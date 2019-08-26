<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="article"
             :rules="rules"
             ref="homeAdvertiseFrom"
             label-width="150px"
             size="big">
      <el-form-item label="文章标题：" prop="title">
        <el-input
          clearable
          v-model="article.title" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="文章分类："
                    prop="categoryCode">
        <el-select v-model="article.categoryCode"
                   clearable
                   placeholder="请选择"
                   value="">
          <el-option v-for="item in cateOptions"
                     :key="item.categoryName"
                     :label="item.categoryName"
                     :value="item.categoryCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章封面：">
        <single-upload v-model="article.image"></single-upload>
      </el-form-item>
      <el-form-item label="是否置顶：">
        <el-switch
          v-model="article.isTop"
          active-value="1"
          inactive-value="0"></el-switch>
      </el-form-item>

      <el-form-item label="规格参数：">
        <el-tabs v-model="activeHtmlName" type="card">
          <el-tab-pane label="电脑端详情" name="pc">
            <tinymce :width="595" :height="300" v-model="articleHtmlContent"></tinymce>
          </el-tab-pane>
          <el-tab-pane label="移动端详情" name="mobile">
            <tinymce :width="595" :height="300" v-model="articleHtmlContent"></tinymce>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('homeAdvertiseFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('homeAdvertiseFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>

    import {createArticle, updateArticle, fetchListWithCategory} from '@/api/article';
    import {checkSuccess, getArray} from "@/utils/response";
    import SingleUpload from '@/components/Upload/qiniuSingleUpload'
    import Tinymce from '@/components/Tinymce'

    const defaultArticle = {
        title: null,
        categoryName: null,
        categoryCode: null,
        image: null,
        content: {
            articleText: '',
            imageUrl: ''
        },
    };

    export default {
        name: 'ArticleDetail',
        components: {SingleUpload, Tinymce},
        props: {
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                article: Object.assign({}, defaultArticle),
                rules: {
                    title: [
                        {required: true, message: this.$t('message.hintInputTitle'), trigger: 'blur'},
                        {min: 2, max: 140, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                    ],
                    categoryCode: [
                        {required: true, message: this.$t('message.hintChoiceCategory'), trigger: 'blur'}
                    ]
                },
                cateOptions: null,
                activeHtmlName: 'pc',
                articleHtmlContent: null
            }
        },
        watch: {
            articleHtmlContent: function (newValue) {
                this.article.content.articleText = newValue;
            }
        },
        created() {
            if (this.isEdit) {
                this.article = this.$route.query.data;
            } else {
                this.article = Object.assign({}, defaultArticle);
            }
            //get parent category
            fetchListWithCategory().then(response => {
                if (checkSuccess(response)) {
                    this.cateOptions = getArray(response);
                }
            })
        },
        methods: {
            beforeSubmit() {
              for (let i = 0; i < this.cateOptions.length; i++) {
                  let o = this.cateOptions[i];
                  if (o.categoryCode === this.article.categoryCode) {
                      this.article.categoryName = o.categoryName;
                      break;
                  }
              }
              console.log(this.article.categoryName)
            },
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('是否提交数据', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.beforeSubmit();
                            if (this.isEdit) {
                                updateArticle(this.article).then(response => {
                                    if (checkSuccess(response)) {
                                      this.$refs[formName].resetFields();
                                      this.$message({
                                        message: '修改成功',
                                        type: 'success',
                                        duration: 1000
                                      });
                                      this.$router.back();
                                    }
                                });
                            } else {
                                createArticle(this.article).then(response => {
                                    if (checkSuccess(response)) {
                                        this.$refs[formName].resetFields();
                                        this.homeAdvertise = Object.assign({}, defaultArticle);
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
                this.article = Object.assign({}, defaultArticle);
            },
        }
    }
</script>
<style scoped>
  .input-width {
    width: 70%;
  }
</style>



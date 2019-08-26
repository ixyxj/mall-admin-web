<template> 
  <div>
    <el-upload
      action="https://upload-z2.qiniup.com"
      list-type="picture"
      :multiple="false"
      :show-file-list="showFileList"
      :file-list="fileList"
      :http-request="uploadQiniu"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="fileList[0].url" alt="">
    </el-dialog>
  </div>
</template>
<script>
    import * as qiniu from 'qiniu-js'
    import {getToken, upload} from "@/api/oss";

    export default {
        name: 'qiniuSingleUpload',
        props: {
            value: String
        },
        computed: {
            imageUrl() {
                return this.value;
            },
            imageName() {
                if (this.value != null && this.value !== '') {
                    return this.value.substr(this.value.lastIndexOf("/") + 1);
                } else {
                    return null;
                }
            },
            fileList() {
                return [{
                    name: this.imageName,
                    url: this.imageUrl
                }]
            },
            showFileList: {
                get: function () {
                    return this.value !== null && this.value !== '' && this.value !== undefined;
                },
                set: function (newValue) {
                }
            }
        },
        data() {
            return {
                dialogVisible: false,
                host: 'http://image.1688bee.com'
            };
        },
        methods: {
            emitInput(val) {
                this.$emit('input', val)
            },
            handleRemove(file, fileList) {
                this.emitInput('');
            },
            handlePreview(file) {
                this.dialogVisible = true;
            },
            beforeUpload(file) {
                const isLimit = file.size <= 1024*1024*200; //200k
                if (!isLimit) this.$message.error('上传图片大小不能超过200k!!!');
                return isLimit;
            },
            handleUploadSuccess(res, file) {
                console.log('==========handleUploadSuccess');
                this.showFileList = true;
                this.fileList.pop();
                this.fileList.push({name: file.name, url: this.host + '/' + file.name});
                this.emitInput(this.fileList[0].url);
            },


            uploadQiniu(request) {
                getToken().then(response => {
                    let uploadToken = response.value;
                    console.log('token ==> ' + uploadToken);
                    upload(uploadToken, request,
                        next => {
                            console.log('==========next');
                            let total = next.total;
                            console.log(total);
                        },
                        error => {
                            console.log('==========error');
                            console.log(error);
                        },
                        completed => {
                            console.log('==========completed');
                            console.log(completed);
                            let hash = completed.hash;
                            let key = completed.key;
                            this.fileList.pop();
                            this.fileList.push({name: '====', url: this.host + '/' + key});
                            console.log(this.fileList);
                            this.emitInput(this.fileList[0].url);
                        });
                })
            },
        }
    }
</script>
<style>

</style>



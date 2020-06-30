<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>新增商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <el-steps :space="200" :active="activeIndex - 0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTableLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goodsName">
              <el-input v-model="addForm.goodsName"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goodsPrice">
              <el-input v-model="addForm.goodsPrice" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goodsNumber">
              <el-input v-model="addForm.goodsNumber" type="number"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">配置管理</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">角色管理</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示图片要上传的地址 -->
            <el-upload
              action="http://localhost:8090/file/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goodsIntroduce"></quill-editor>
            <el-button class="addGoodsBtn" type="primary">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: 0,
      addForm: {
        goodsName: '',
        goodsPrice: 0,
        goodsNumber: 0,
        goodsIntroduce: ''
      },
      addFormRules: {
        goodsName: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }
        ],
        goodsPrice: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }
        ],
        goodsNumber: [
          {
            required: true,
            message: '请输入商品数量',
            trigger: 'blur'
          }
        ]
      },
      addFormRef: {}
    }
  },
  created() {},
  methods: {
    beforeTableLeave(activeName, oldActiveName) {
      console.log(activeName, oldActiveName)
    },
    tabClick() {
      if (this.activeIndex === '1') {
        // console.log('动态参数面板')
        this.$http.post()
      }
    },
    // 处理图片预览效果
    handlePreview() {},
    // 处理移出图片的操作
    handleRemove() {},
    // 监听图片上传成功
    handleSuccess(response) {
      console.log(response)
    }
  }
}
</script>

<style lang="less" scoped>
.addGoodsBtn {
  margin-top: 15px;
}
</style>
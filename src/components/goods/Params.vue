<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <el-alert title="注意：只允许为第三分类设置相关参数" type="warning" :closable="false" show-icon></el-alert>
      <el-row class="cate_option">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectKeys"
            :options="cateList"
            :props="cateProps"
            @change="cateChange"
            :clearable="true"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisiable = true"
          >添加参数</el-button>
          <el-table :data="manyTabData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attrName"></el-table-column>
            <el-table-column label="操作">
              <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
              <el-button type="warning" size="mini" icon="el-icon-delete">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisiable = true"
          >添加属性</el-button>
          <el-table :data="onlyTabData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attrName"></el-table-column>
            <el-table-column label="操作">
              <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
              <el-button type="warning" size="mini" icon="el-icon-delete">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 新增、更新 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisiable"
      width="50%"
      @close="addDialogCosed"
    >
      <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="100px">
        <el-form-item :label="titleText" prop="attrName">
          <el-input v-model="addFrom.attrName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      //动态属性的数据
      manyTabData: [],
      //静态属性的属性
      onlyTabData: [],
      queryInfo: {
        pageNumber: 0,
        pageSize: 999
      },
      //   级联框绑定的数组
      selectKeys: [],
      //   级联选择框的配置对象
      cateProps: {
        value: 'cateId',
        label: 'cateName',
        children: 'children'
      },
      //   被激活的页签名称
      activeName: 'many',
      addDialogVisiable: false,
      addFrom: {
        attrName: ''
      },
      addFromRules: {
        attrName: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    //   获取所有的分类
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.post(
        '/goods/cate/list',
        this.queryInfo
      )
      if (res.code != 0) return this.$message.error(res.msg)
      console.log(res.data)
      this.cateList = res.data.list
    },
    async cateChange() {
      this.getParamsData()
    },
    async getParamsData() {
      //   console.log(this.selectKeys)
      if (this.selectKeys.length != 3) {
        // 不是三级分类
        this.selectKeys = []
        return
      }
      // 选中的是三级分类
      const { data: res } = await this.$http.get(
        `/goods/params/${this.cateId}`,
        {
          params: { type: this.activeName }
        }
      )
      if (res.code !== 0) return this.$message.error(res.msg)
      //   console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTabData = res.data
      } else {
        this.onlyTabData = res.data
      }
    },
    // tab页签点击事件处理函数
    handleTabClick() {
      this.getParamsData()
      //   console.log(this.activeName)
    },
    //对话框关闭
    addDialogCosed() {
      this.$refs.addFromRef.resetFields()
    },
    //新增参数
    addParams() {
      this.$refs.addFromRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await this.$http.post('/goods/add/params', {
          attrName: this.addFrom.attrName,
          cateId: this.cateId,
          type: this.activeName
        })
        if(res.code != 0) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.addDialogVisiable = false;
        this.getParamsData()
      })
    }
  },
  computed: {
    //   如果按钮禁用，返回true,否则返回false
    isBtnDisabled() {
      if (this.selectKeys.length !== 3) {
        return true
      }
      return false
    },
    cateId() {
      if (this.selectKeys.length === 3) {
        return this.selectKeys[2]
      }
      return null
    },
    //动态计算标题文本
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.cate_option {
  margin: 15px 0;
}
</style>>

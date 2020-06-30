<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入一级分类" v-model="queryInfo.cateName" clearable @clear="getCateList">
            <el-button slot="append" icon="el-icon-search" @click="getCateList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :expand-type="false"
        :selection-type="false"
        show-index
        index-text="#"
        border
      >
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" style="color:lightgreen" v-if="scope.row.cateStatus === true"></i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cateLevel === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cateLevel === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="operation" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button
            type="warning"
            icon="el-icon-delete"
            size="mini"
            @click="removeCate(scope.row.cateId)"
          >删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNumber"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateVisiable"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="addCateForm"
        :rules="addCateRules"
        ref="addCateRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称:" prop="cateName">
          <el-input v-model="addCateForm.cateName"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader
            v-model="selectKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            :clearable="true"
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        cateName: null,
        pageNumber: 0,
        pageSize: 5
      },
      cateList: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cateName'
        },
        {
          label: '有效性',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation'
        }
      ],
      addCateVisiable: false,
      addCateForm: {
        cateName: '',
        parentId: null,
        cateLevel: 0
      },
      addCateRules: {
        cateName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        cateLevel: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      cascaderProps: {
        value: 'cateId',
        label: 'cateName',
        children: 'children'
      },
      selectKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.post(
        '/goods/cate/list',
        this.queryInfo
      )
      if (res.code != 0) return this.$message.error(res.msg)
      console.log(res.data.list)
      this.cateList = res.data.list
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageNumber = newPage
      this.getCateList()
    },
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateVisiable = true
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get('/goods/parent/cate/list')
      if (res.code != 0) return this.$message.error(res.msg)
      // console.log(res.data)
      this.parentCateList = res.data
    },
    parentCateChange() {
      console.log(this.selectKeys)
      //如果数组的长度为0，代表level=0
      if (this.selectKeys.length > 0) {
        this.addCateForm.parentId = this.selectKeys[this.selectKeys.length - 1]
        this.addCateForm.cateLevel = this.selectKeys.length
        return
      } else {
        this.addCateForm.parentId = null
        this.addCateForm.cateLevel = 0
      }
    },
    addCate() {
      // console.log(this.addCateForm)
      this.$refs.addCateRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          '/goods/addCate',
          this.addCateForm
        )
        if (res.code != 0) return this.$message.error(res.msg)
        this.$message.success('添加成功')
        this.getCateList()
        this.addCateVisiable = false
      })
    },
    addCateDialogClosed() {
      //监听对话框的关闭事件，重置
      this.$refs.addCateRef.resetFields()
      this.selectKeys = []
      this.addCateForm.parentId = ''
      this.addCateForm.cateLevel = 0
    },
    //删除分类
    async removeCate(cateId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult != 'confirm') return this.$message.info('取消了删除')
      const { data: res } = await this.$http.delete(
        `/goods/delete/cate/${cateId}`
      )
      if (res.code != 0) return this.$message.error(res.msg)
      this.getCateList()
      return this.$message.success('删除成功')
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.goodsName"
            clearable
            @clear="getGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisiable = true">添加商品</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="turnToAdd">添加商品页面</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goodsName"></el-table-column>
        <el-table-column label="商品价格" prop="goodsPrice"></el-table-column>
        <el-table-column label="商品数量" prop="goodsNumber"></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">{{scope.row.createdTime | dateFormat}}</template>
        </el-table-column>
        <el-table-column>
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="warning" icon="el-icon-delete" size="mini">删除</el-button>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
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

    <!-- 添加商品 -->
    <el-dialog title="添加商品" :visible.sync="addDialogVisiable" width="50%" @close="addDiaglogClosed">
      <!-- 内容主体区 -->
      <el-form :model="addForm" :rules="addFromRules" ref="addFormRef" label-width="100px">
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="addForm.goodsName"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goodsPrice">
          <el-input v-model="addForm.goodsPrice"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goodsNumber">
          <el-input v-model="addForm.goodsNumber"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        goodsName: null,
        pageNumber: 0,
        pageSize: 10
      },
      goodsList: [],
      total: 0,
      addDialogVisiable: false,
      addForm: {
        goodsName: '',
        goodsPrice: 0,
        goodsNumber: 0
      },
      addFromRules: {
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goodsPrice: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goodsNumber: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getGoodsList()
  },

  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.post(
        '/goods/goods/list',
        this.queryInfo
      )
      if (res.code != 0) return this.$message.error('获取商品列表失败')
      //   console.log(res.data)
      this.goodsList = res.data.list
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageNumber = newPage
      this.getGoodsList()
    },
    //监听关闭事件
    addDiaglogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    //新增商品
    async addGoods() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          '/goods/add/goods',
          this.addForm
        )
        if (res.code != 0) return this.$message.error('添加商品失败')
        this.$message.success('添加商品成功')
        this.addDialogVisiable = false
        this.getGoodsList()
      })
    },
    turnToAdd() {
      this.$router.push('/add/goods')
    }
  }
}
</script>

<style lang="less" scoped>
</style>


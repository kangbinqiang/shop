<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.orderNo" clearable @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="orderNo" width="300px"></el-table-column>
        <el-table-column label="订单价格" prop="price"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay === 1">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.post === 1">已发货</el-tag>
            <el-tag type="danger" v-else>未发货</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">{{scope.row.createdTime | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEdit"></el-button>
            <el-button type="success" size="mini" icon="el-icon-location" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
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
      <el-dialog title="修改收货地址" :visible.sync="editVisiable" width="50%">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item label="省市区/县" prop="address">
            <el-input v-model="editForm.address"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" prop="addressDetail">
            <el-input v-model="editForm.addressDetail"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisiable = false">取 消</el-button>
          <el-button type="primary" @click="editVisiable = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 展示物流 -->
      <el-dialog title="展示物流进度" :visible.sync="progressVisiable" width="50%">
        <span>这是一段信息</span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        orderNo: '',
        pageNumber: 0,
        pageSize: 10
      },
      orderList: [],
      total: 0,
      editVisiable: false,
      editForm: {
        address: '',
        addressDetail: ''
      },
      editFormRules: {
        address: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        addressDetail: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      progressVisiable: false
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    //获取订单
    async getOrderList() {
      const { data: res } = await this.$http.post('/order/list', this.queryInfo)
      if (res.code != 0) return this.$message.error('查询订单异常')
      this.total = res.data.total
      this.orderList = res.data.list
      console.log(res.data)
    },
    //监听pageSize
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    //监听页码值改变的值
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pageNumber = newPage
      this.getUserList()
    },
    //展示编辑框
    showEdit() {
      this.editVisiable = true
    },
    //展示物流
    showProgressBox() {
      this.progressVisiable = true
    }
  }
}
</script>

<style lang="less" scoped>
</style>
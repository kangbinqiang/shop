<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.username" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisiable = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="手机号" prop="mobile"></el-table-column>
        <el-table-column label="密码" prop="password"></el-table-column>
        <el-table-column label="盐值" prop="salt"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-switch v-model="scope.row.status" @change="userStatusChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="开关">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                size="mini"
                @click="showEditDiaglog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                size="mini"
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" circle size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
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

    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisiable" width="50%" @close="addDiaglogClosed">
      <!-- 内容主体区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDiaglogColsed"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      //验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      return callback(new Error('请输入合法的邮箱'))
    }
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      return callback(new Error('请输入合法的手机号'))
    }
    return {
      //获取用户列表的参数
      queryInfo: {
        username: null,
        pageNumber: 0, //当前页数
        pageSize: 10
      },
      userList: [],
      total: 0,
      addDialogVisiable: false, //控制添加用户显示
      editDialogVisible: false, //控制显示用户修改的对话框
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {},
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3到10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '密码的长度在3到10个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      } //验证规则
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    //获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.post('/user/list', this.queryInfo)
      console.log(res)
      if (res.code != 0) return this.$message.error(res.msg)
      this.userList = res.data.list
      this.total = res.data.total
      //   this.userList = result.data.data.list;
      //   console.log(result.data);
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
    //监听switch开关的改变
    async userStatusChange(user) {
      console.log(user)
      const { data: res } = await this.$http.put(
        `/user/update/${user.id}/status/${user.status}`
      )
      if (res.code != 0) {
        user.status = !user.status
        return this.$message.error(res.msg)
      }
      this.$message.success('更新用户状态成功')
    },
    //监听添加用户对话框关闭的事件
    addDiaglogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    //点击按钮，添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.post('/user/add', this.addForm)
        if (res.code != 0) return this.$message.error(res.msg)
        this.$message.success('添加用户成功')
        this.addDialogVisiable = false
        this.getUserList()
      })
    },
    //展示用户编辑对话框
    async showEditDiaglog(id) {
      // console.log(id);
      const { data: res } = await this.$http.get('/user/fetch', {
        params: {
          id: id
        }
      })
      if (res.code != 0) return this.$message.error('获取用户信息失败')
      this.editForm = res.data
      console.log(this.editForm)
      this.editDialogVisible = true
    },
    //监听修改表单关闭事件
    editDiaglogColsed() {
      this.$refs.editFormRef.resetFields()
    },
    //修改用户并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          '/user/update',
          this.editForm
        )
        if (res.code != 0) return this.$message.error(res.msg)
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('修改成功')
      })
    },
    //根据id删除用户
    async removeUserById(id) {
      console.log(id)
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult != 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('/user/delete/' + id)
      if (res.code != 0) return this.$message.error(res.msg)
      this.getUserList()
      return this.$message.success('删除成功')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
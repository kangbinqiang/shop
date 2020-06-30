<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容"  clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button class="aside-left" type="primary" @click="addRoleVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 渲染一级权限 -->
            <el-row
              :class="['bdbottom',i1 === 0 ? 'bdtop' : '','vcenter']"
              v-for="(item1,i1) in scope.row.permissions"
              :key="item1.id"
            >
              <el-col :span="6">
                <el-tag closable @close="removePermissionById(scope.row,item1.id)">{{item1.name}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <!-- 渲染二级权限 -->
                <el-tag
                  v-for="item2 in item1.permissions"
                  :key="item2.id"
                  type="success"
                  closable
                  @close="removePermissionById(scope.row,item2.id)"
                >{{item2.name}}</el-tag>
              </el-col>
            </el-row>
            <!-- <pre>
                    {{scope.row}}
            </pre>-->
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="name"></el-table-column>
        <el-table-column label="角色描述" prop="desc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDiaglog(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoleById(scope.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetPermissionDiaglog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addRoleVisible" width="50%" @close="addDiaglogClosed">
      <!-- 内容主体区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="角色名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="addForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色 -->
    <el-dialog title="修改角色" :visible.sync="editRoleVisible" width="50%" @close="editDiaglogClosed">
      <!-- 内容主体区 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="角色名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="editForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="分配权限"
      :visible.sync="setPermissionVisiable"
      width="50%"
      @close="setPermissionDialogColsed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="permissionList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        ref="treeRef"
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setPermissionVisiable = false">取 消</el-button>
        <el-button type="primary" @click="allotPermissions">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //添加数据
      addRoleVisible: false,
      addForm: {
        name: '',
        desc: ''
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '角色名的长度在1到10个字符之间',
            trigger: 'blur'
          }
        ],
        desc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 3,
            max: 100,
            message: '角色描述的长度在3到100个字符之间',
            trigger: 'blur'
          }
        ]
      },
      //编辑数据
      editRoleVisible: false,
      editForm: {
        name: '',
        desc: ''
      },
      editFormRules: {
        name: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '角色名的长度在1到10个字符之间',
            trigger: 'blur'
          }
        ],
        desc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 3,
            max: 100,
            message: '角色描述的长度在3到100个字符之间',
            trigger: 'blur'
          }
        ]
      },
      roleList: [],
      setPermissionVisiable: false,
      permissionList: [], //树形控件的权限列表
      treeProps: {
        label: 'name',
        children: 'permissions'
      },
      defKeys: [], //默认选中的数据
      roleId: '' //当前即将分配权限的id
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    //添加角色
    async addRole() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/role/add', this.addForm)
        if (res.code != 0) return this.$message.error(res.msg)
        this.$message.success('添加成功')
        this.addRoleVisible = false
        this.getRoleList()
      })
    },
    //添加对话框关闭
    addDiaglogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    //展示更新数据对话框
    async showEditDiaglog(role) {
      const { data: res } = await this.$http.get('/role/fetch', {
        params: { id: role.id }
      })
      if (res.code != 0) return this.$message.error(res.msg)
      console.log(res.data)
      this.editForm = res.data
      this.editRoleVisible = true
    },
    //更新用户的对话框关闭
    editDiaglogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //更新用户
    editRole() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          '/role/update',
          this.editForm
        )
        if (res.code != 0) return this.$message.error(res.msg)
        this.editRoleVisible = false
        this.getRoleList()
        return this.$message.success('更新成功')
      })
    },
    //删除角色
    async removeRoleById(id) {
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
      const { data: res } = await this.$http.delete(`/role/delete/${id}`)
      if (res.code != 0) return this.$message.error(res.msg)
      this.getRoleList()
      return this.$message.success('删除成功')
    },
    //获取角色-权限列表
    async getRoleList() {
      const { data: res } = await this.$http.get('/role/list')
      if (res.code != 0) return this.$message.error(res.msg)
      this.roleList = res.data
      console.log(this.roleList)
    },
    //删除角色对应的权限
    async removePermissionById(user, id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult != 'confirm') return this.$message.info('取消了删除')
      const { data: res } = await this.$http.delete(
        `/role/${user.id}/permission/${id}`
      )
      if (res.code != 0) return this.$message.error(res.msg)
      user.permissions = res.data
    },
    //展示分配权限的对话框
    async showSetPermissionDiaglog(role) {
      this.roleId = role.id
      this.setPermissionVisiable = true
      const { data: res } = await this.$http.get('/permission/tree')
      if (res.code != 0) return this.$message.error(res.msg)
      this.permissionList = res.data
      // console.log(role)
      if (role.permissions) {
        role.permissions.forEach(item => {
          this.getDefaultKeys(item, this.defKeys)
        })
      }
      console.log(this.defKeys)
    },
    //递归的形式保存树节点
    getDefaultKeys(node, arr) {
      if (!node.permissions) {
        return arr.push(node.id)
      }
      node.permissions.forEach(item => {
        this.getDefaultKeys(item, arr)
      })
    },
    //监听分配权限框的关闭事件
    setPermissionDialogColsed() {
      this.defKeys = []
    },
    //分配权限
    async allotPermissions() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // const idStr = keys.join(',')
      const { data: res } = await this.$http.post('/permission/select', {
        roleId: this.roleId,
        ids: keys
      })
      if (res.code != 0) return this.$message.error(res.msg)
      this.$message.success('分配权限成功')
      this.getRoleList()
      this.setPermissionVisiable = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
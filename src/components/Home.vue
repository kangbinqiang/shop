<template>
  <el-container class="home-container">
    <!-- 头部区 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt />
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 菜单区 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <dir class="toggle-button" @click="toggleCollapse">|||</dir>
        <el-menu
          class="el-menu-vertical-demo"
          unique-opened
          router
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-active="activePath"
        >
          <el-submenu :index="item.path" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.menuName}}</span>
            </template>
            <el-menu-item :index="child.path" v-for="child in item.children" 
            :key="child.id" @click="saveNavStatus(child.path)">
              <template slot="title">
                <i :class="child.icon"></i>
                <span>{{child.menuName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      isCollapse: false, //是否折叠，默认不折叠
      activePath: '',  //动态激活的地址
    }
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //获取所有的菜单
    async getMenuList() {
      const result = await this.$http.get('/menu/list')
      // console.log(result.data)
      if (result.data.code != 0)
        return this.$message.console.error(result.data.msg)
      this.menuList = result.data.data
    },
    //点击按钮，切换菜单的展开和折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNavStatus(activePath) {
      window.sessionStorage.setItem("activePath",activePath);
      this.activePath = activePath;
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-menu {
  border: null;
  border-right: 0px !important;
}

.el-header {
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #545c64;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #ffffff;
}

.el-main {
  background-color: #ffffff;
}
.toggle-button {
  padding: 0;
  background-color: #ffffff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-submenu{
  padding: 0;
}
.el-menu-item{
  padding: 0;
}
</style>
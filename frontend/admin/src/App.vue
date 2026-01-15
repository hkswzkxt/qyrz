<template>
  <el-container style="min-height: 100vh;">
    <el-header style="background: #fff; border-bottom: 1px solid #e5e7eb; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h1 style="margin: 0; color: var(--el-color-primary);">企业入驻表单管理后台</h1>
        <div>
          <el-dropdown>
            <span class="el-dropdown-link">
              管理员 <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px" style="background: #fff; border-right: 1px solid #e5e7eb;">
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical-demo"
          @select="handleMenuSelect"
        >
          <el-menu-item index="formList">
            <el-icon><document /></el-icon>
            <span>表单列表</span>
          </el-menu-item>
          <el-menu-item index="config">
            <el-icon><setting /></el-icon>
            <span>系统配置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowDown, Document, Setting } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const activeMenu = computed(() => route.path === '/' ? 'formList' : route.name)

const handleMenuSelect = (index) => {
  if (index === 'formList') {
    router.push('/')
  } else if (index === 'config') {
    router.push('/config')
  }
}
</script>

<style>
:root {
  --el-color-primary: #2563eb;
}

.el-main {
  padding: 20px;
  background: #f8fafc;
}
</style>

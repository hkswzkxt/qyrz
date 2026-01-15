<template>
  <div class="config-container">
    <el-card shadow="hover">
      <template #header>
        <h2>系统配置</h2>
      </template>
      
      <el-tabs v-model="activeTab">
        <!-- 邮件模板配置 -->
        <el-tab-pane label="邮件模板配置" name="email">
          <el-form :model="emailConfig" label-width="120px">
            <!-- 通过模板 -->
            <el-divider content-position="left">
              <h3 style="margin: 0;">审核通过模板</h3>
            </el-divider>
            
            <el-form-item label="邮件主题">
              <el-input
                v-model="emailConfig.templates.approved.subject"
                placeholder="请输入审核通过邮件主题"
              />
            </el-form-item>
            
            <el-form-item label="邮件内容">
              <el-input
                v-model="emailConfig.templates.approved.content"
                type="textarea"
                :rows="10"
                placeholder="请输入审核通过邮件内容，支持HTML格式和变量替换（如{{contactName}}、{{companyName}}等）"
              />
            </el-form-item>
            
            <el-form-item>
              <el-alert
                title="支持的变量"
                type="info"
                :closable="false"
                style="margin-bottom: 20px;"
              >
                <p>{{contactName}} - 对接人姓名</p>
                <p>{{companyName}} - 企业名称</p>
                <p>{{approvedAt}} - 审核时间</p>
                <p>{{approvalNote}} - 审核备注</p>
              </el-alert>
            </el-form-item>
            
            <!-- 拒绝模板 -->
            <el-divider content-position="left">
              <h3 style="margin: 0;">审核拒绝模板</h3>
            </el-divider>
            
            <el-form-item label="邮件主题">
              <el-input
                v-model="emailConfig.templates.rejected.subject"
                placeholder="请输入审核拒绝邮件主题"
              />
            </el-form-item>
            
            <el-form-item label="邮件内容">
              <el-input
                v-model="emailConfig.templates.rejected.content"
                type="textarea"
                :rows="10"
                placeholder="请输入审核拒绝邮件内容，支持HTML格式和变量替换（如{{contactName}}、{{companyName}}等）"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" :loading="saving" @click="saveEmailConfig">保存配置</el-button>
              <el-button @click="resetConfig">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <!-- 系统信息 -->
        <el-tab-pane label="系统信息" name="system">
          <el-descriptions :column="1" border :size="'large'">
            <el-descriptions-item label="系统名称">企业入驻表单管理系统</el-descriptions-item>
            <el-descriptions-item label="版本号">1.0.0</el-descriptions-item>
            <el-descriptions-item label="部署模式">前后端分离</el-descriptions-item>
            <el-descriptions-item label="前端技术栈">Vue 3 + Element Plus + Vite</el-descriptions-item>
            <el-descriptions-item label="后端技术栈">Node.js + Express + MongoDB</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { configApi } from '../services/api'

// 当前激活的标签页
const activeTab = ref('email')

// 保存状态
const saving = ref(false)

// 原始邮件配置
const originalConfig = ref(null)

// 邮件配置数据
const emailConfig = reactive({
  templates: {
    approved: {
      subject: '',
      content: ''
    },
    rejected: {
      subject: '',
      content: ''
    }
  }
})

// 加载邮件配置
const loadEmailConfig = async () => {
  try {
    const result = await configApi.getEmailConfig()
    const config = result.data
    emailConfig.templates = config.templates
    originalConfig.value = JSON.parse(JSON.stringify(config))
  } catch (error) {
    ElMessage.error('获取邮件配置失败')
  }
}

// 保存邮件配置
const saveEmailConfig = async () => {
  try {
    saving.value = true
    await configApi.updateEmailConfig(emailConfig)
    originalConfig.value = JSON.parse(JSON.stringify(emailConfig))
    ElMessage.success('邮件配置保存成功')
  } catch (error) {
    ElMessage.error('保存邮件配置失败')
  } finally {
    saving.value = false
  }
}

// 重置配置
const resetConfig = () => {
  if (originalConfig.value) {
    emailConfig.templates = JSON.parse(JSON.stringify(originalConfig.value.templates))
  }
}

// 初始加载
onMounted(() => {
  loadEmailConfig()
})
</script>

<style scoped>
.config-container {
  padding: 0;
}

.el-divider {
  margin: 20px 0;
}

.el-divider--horizontal {
  border-top: 2px solid #e5e7eb;
}
</style>

<template>
  <div class="form-list-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <h2>表单列表</h2>
          <div class="header-actions">
            <el-button
              type="primary"
              :disabled="selectedIds.length === 0"
              @click="handleBatchApprove('approved')"
            >
              批量通过
            </el-button>
            <el-button
              type="danger"
              :disabled="selectedIds.length === 0"
              @click="handleBatchApprove('rejected')"
            >
              批量拒绝
            </el-button>
          </div>
        </div>
      </template>
      
      <!-- 筛选条件 -->
      <el-form :inline="true" class="filter-form">
        <el-form-item label="企业名称">
          <el-input v-model="filters.companyName" placeholder="请输入企业名称" clearable @keyup.enter="loadFormList" />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="filters.status" placeholder="请选择审核状态" clearable>
            <el-option label="全部" value="" />
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已拒绝" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadFormList">查询</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 表单列表 -->
      <el-table
        v-loading="loading"
        :data="formList"
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="companyName" label="企业名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="contactName" label="对接人" min-width="120" />
        <el-table-column prop="contactPhone" label="联系电话" min-width="150" />
        <el-table-column prop="businessType" label="业务类型" min-width="120" />
        <el-table-column prop="status" label="审核状态" min-width="120">
          <template #default="scope">
            <el-tag
              :type="scope.row.status === 'approved' ? 'success' : scope.row.status === 'rejected' ? 'danger' : 'warning'"
            >
              {{ scope.row.status === 'pending' ? '待审核' : scope.row.status === 'approved' ? '已通过' : '已拒绝' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="submittedAt" label="提交时间" min-width="180" sortable>
          <template #default="scope">
            {{ new Date(scope.row.submittedAt).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="180" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleViewDetail(scope.row)">
              查看详情
            </el-button>
            <template v-if="scope.row.status === 'pending'">
              <el-button type="success" size="small" @click="handleApprove(scope.row, 'approved')">
                通过
              </el-button>
              <el-button type="danger" size="small" @click="handleApprove(scope.row, 'rejected')">
                拒绝
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 表单详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="表单详情"
      width="80%"
      :close-on-click-modal="false"
    >
      <el-descriptions v-if="selectedForm" border :column="2" :size="'large'">
        <template #title>
          <h3>{{ selectedForm.companyName }}</h3>
        </template>
        
        <!-- 企业基础信息 -->
        <el-descriptions-item label="企业全称" span="2">{{ selectedForm.companyName }}</el-descriptions-item>
        <el-descriptions-item label="统一社会信用代码" span="2">{{ selectedForm.socialCreditCode }}</el-descriptions-item>
        <el-descriptions-item label="企业性质">{{ selectedForm.companyType || '-' }}</el-descriptions-item>
        <el-descriptions-item label="所属行业">{{ selectedForm.industry || '-' }}</el-descriptions-item>
        <el-descriptions-item label="企业注册地址" span="2">{{ selectedForm.registrationAddress }}</el-descriptions-item>
        
        <!-- 对接人信息 -->
        <el-descriptions-item label="对接人姓名" span="2" style="margin-top: 20px;">
          <span style="font-weight: bold; color: var(--el-color-primary);">对接人信息</span>
        </el-descriptions-item>
        <el-descriptions-item label="对接人姓名">{{ selectedForm.contactName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ selectedForm.contactPhone }}</el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ selectedForm.contactIdCard }}</el-descriptions-item>
        <el-descriptions-item label="电子邮箱">{{ selectedForm.email || '-' }}</el-descriptions-item>
        <el-descriptions-item label="部门/职务">{{ selectedForm.department || '-' }}</el-descriptions-item>
        <el-descriptions-item label="推荐人姓名">{{ selectedForm.referrerName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="推荐人电话">{{ selectedForm.referrerPhone || '-' }}</el-descriptions-item>
        <el-descriptions-item label="推荐人身份证号">{{ selectedForm.referrerIdCard || '-' }}</el-descriptions-item>
        
        <!-- 对接业务及需求 -->
        <el-descriptions-item label="对接业务及需求" span="2" style="margin-top: 20px;">
          <span style="font-weight: bold; color: var(--el-color-primary);">对接业务及需求</span>
        </el-descriptions-item>
        <el-descriptions-item label="对接业务类型">{{ selectedForm.businessType }}</el-descriptions-item>
        <el-descriptions-item label="预算范围">{{ selectedForm.budgetRange || '-' }}</el-descriptions-item>
        <el-descriptions-item label="需求描述" span="2" :style="{ height: 'auto' }">
          <div style="white-space: pre-wrap; text-align: left;">{{ selectedForm.demandDescription }}</div>
        </el-descriptions-item>
        
        <!-- 审核信息 -->
        <el-descriptions-item label="审核信息" span="2" style="margin-top: 20px;">
          <span style="font-weight: bold; color: var(--el-color-primary);">审核信息</span>
        </el-descriptions-item>
        <el-descriptions-item label="审核状态">
          <el-tag
            :type="selectedForm.status === 'approved' ? 'success' : selectedForm.status === 'rejected' ? 'danger' : 'warning'"
          >
            {{ selectedForm.status === 'pending' ? '待审核' : selectedForm.status === 'approved' ? '已通过' : '已拒绝' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="审核人">{{ selectedForm.approvedBy || '-' }}</el-descriptions-item>
        <el-descriptions-item label="审核时间">
          {{ selectedForm.approvedAt ? new Date(selectedForm.approvedAt).toLocaleString() : '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="审核备注" span="2">{{ selectedForm.approvalNote || '-' }}</el-descriptions-item>
      </el-descriptions>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
    
    <!-- 审核备注对话框 -->
    <el-dialog
      v-model="approvalDialogVisible"
      :title="approvalType === 'approved' ? '通过审核' : '拒绝审核'"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item label="审核备注" :label-width="'100px'">
          <el-input
            v-model="approvalNote"
            type="textarea"
            :rows="4"
            placeholder="请输入审核备注"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="approvalDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="approving"
            @click="confirmApproval"
          >
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formApi } from '../services/api'

// 表单列表数据
const formList = ref([])
const loading = ref(false)
const selectedIds = ref([])
const selectedForm = ref(null)

// 筛选条件
const filters = reactive({
  companyName: '',
  status: ''
})

// 分页信息
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})

// 对话框状态
const dialogVisible = ref(false)
const approvalDialogVisible = ref(false)
const approving = ref(false)
const approvalType = ref('')
const approvalNote = ref('')
const formToApprove = ref(null)

// 加载表单列表
const loadFormList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      companyName: filters.companyName,
      status: filters.status
    }
    const result = await formApi.getFormList(params)
    formList.value = result.data.forms
    pagination.total = result.data.pagination.total
  } catch (error) {
    ElMessage.error('获取表单列表失败')
  } finally {
    loading.value = false
  }
}

// 重置筛选条件
const resetFilters = () => {
  filters.companyName = ''
  filters.status = ''
  loadFormList()
}

// 选择变更
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item._id)
}

// 分页大小变更
const handleSizeChange = (size) => {
  pagination.limit = size
  pagination.page = 1
  loadFormList()
}

// 当前页码变更
const handleCurrentChange = (page) => {
  pagination.page = page
  loadFormList()
}

// 查看详情
const handleViewDetail = async (form) => {
  try {
    const result = await formApi.getFormDetail(form._id)
    selectedForm.value = result.data
    dialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取表单详情失败')
  }
}

// 单个审核
const handleApprove = (form, type) => {
  formToApprove.value = form
  approvalType.value = type
  approvalNote.value = ''
  approvalDialogVisible.value = true
}

// 批量审核
const handleBatchApprove = (type) => {
  ElMessageBox.prompt('请输入审核备注', type === 'approved' ? '批量通过审核' : '批量拒绝审核', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputType: 'textarea',
    inputPlaceholder: '请输入审核备注'
  }).then(async ({ value }) => {
    try {
      approving.value = true
      await formApi.approveForm({
        ids: selectedIds.value,
        status: type,
        approvalNote: value
      })
      ElMessage.success(`成功${type === 'approved' ? '通过' : '拒绝'}${selectedIds.value.length}个表单`)
      loadFormList()
      selectedIds.value = []
    } catch (error) {
      ElMessage.error('审核失败')
    } finally {
      approving.value = false
    }
  }).catch(() => {
    // 用户取消
  })
}

// 确认审核
const confirmApproval = async () => {
  if (!formToApprove.value) return
  
  try {
    approving.value = true
    await formApi.approveForm({
      ids: [formToApprove.value._id],
      status: approvalType.value,
      approvalNote: approvalNote.value
    })
    ElMessage.success(`成功${approvalType.value === 'approved' ? '通过' : '拒绝'}审核`)
    approvalDialogVisible.value = false
    loadFormList()
    // 如果当前打开了详情对话框，更新表单状态
    if (dialogVisible.value && selectedForm.value && selectedForm.value._id === formToApprove.value._id) {
      selectedForm.value.status = approvalType.value
      selectedForm.value.approvalNote = approvalNote.value
      selectedForm.value.approvedAt = new Date()
    }
  } catch (error) {
    ElMessage.error('审核失败')
  } finally {
    approving.value = false
  }
}

// 初始加载
onMounted(() => {
  loadFormList()
})
</script>

<style scoped>
.form-list-container {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.filter-form {
  margin-bottom: 20px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.card-header h2 {
  margin: 0;
  font-size: 20px;
  color: var(--el-color-primary);
}
</style>

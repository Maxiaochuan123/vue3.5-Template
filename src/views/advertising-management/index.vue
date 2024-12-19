<script setup lang="ts">
import { h, ref, onMounted, reactive, computed } from 'vue'
import { NButton, NIcon, NSpace, type DataTableColumns } from 'naive-ui'
import { AddOutline } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import { advertisementTypeOptions, statusOptions } from '@/enum/options'
import { renderAdvertisingInfo } from '@/components/TableColumns/renderAdvertisingInfo'
import TablePageLayout from '@/components/PageLayout/TablePageLayout.vue'
import AdvertisingForm, { type FormState } from './components/AdvertisingForm.vue'
import SearchForm from '@/components/SearchForm/index.vue'
import Table from '@/components/Table/index.vue'
import FormDrawer from '@/components/FormDrawer/index.vue'

type TableDataRecord = Record<string, any>

interface SearchParams {
  keyword: string | null
  dateRange: [number, number] | null
  adType: 'CPM' | 'CPC' | 'CPA' | null
  status: '审核通过' | '审核中' | '审核失败' | null
}

// 定义默认搜索表单值
const defaultSearchForm = reactive<SearchParams>({
  keyword: null,
  dateRange: null,
  adType: null,
  status: null,
})

const tableRef = ref<InstanceType<typeof Table> | null>(null)
const drawerRef = ref<InstanceType<typeof FormDrawer> | null>(null)
const formRef = ref<InstanceType<typeof AdvertisingForm> | null>(null)
const formType = ref<'add' | 'edit'>('add')
const editData = ref<Partial<FormState>>({})

// 搜索
const handleSearch = (values: SearchParams) => {
  tableRef.value?.loadData(values)
}

// 定义获取数据的方法
const tableFetchApi = async ( params: SearchParams ): Promise<{ list: TableDataRecord[]; total: number }> => {
  // 打印完整的搜索参数
  console.log('搜索参数:', params)

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        list: [
          {
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title:
              '这里是视频广视频广告长度限制20个字',
            description:
              '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          },{
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title:
              '这里是视频广视频广告长度限制20个字',
            description:
              '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          },{
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title:
              '这里是视频广视频广告长度限制20个字',
            description:
              '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          },{
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title:
              '这里是视频广视频广告长度限制20个字',
            description:
              '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          },{
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title:
              '这里是视频广视频广告长度限制20个字',
            description:
              '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          },{
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title:
              '这里是视频广视频广告长度限制20个字',
            description:
              '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          },{
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title:
              '这里是视频广视频广告长度限制20个字',
            description:
              '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          },{
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title:
              '这里是视频广视频广告长度限制20个字',
            description:
              '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          },{
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title:
              '这里是视频广视频广告长度限制20个字',
            description:
              '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          },{
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title:
              '这里是视频广视频广告长度限制20个字',
            description:
              '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          },{
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title:
              '这里是视频广视频广告长度限制20个字',
            description:
              '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          },{
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title:
              '这里是视频广视频广告长度限制20个字',
            description:
              '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          },{
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title:
              '这里是视频广视频广告长度限制20个字',
            description:
              '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          },{
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title:
              '这里是视频广视频广告长度限制20个字',
            description:
              '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          },{
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title:
              '这里是视频广视频广告长度限制20个字',
            description:
              '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          },{
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title:
              '这里是视频广视频广告长度限制20个字',
            description:
              '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          },{
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title:
              '这里是视频广视频广告长度限制20个字',
            description:
              '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          },{
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title:
              '这里是视频广视频广告长度限制20个字',
            description:
              '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          },{
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title:
              '这里是视频广视频广告长度限制20个字',
            description:
              '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          },{
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title:
              '这里是视频广视频广告长度限制20个字',
            description:
              '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          },{
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title:
              '这里是视频广视频广告长度限制20个字',
            description:
              '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          },{
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title:
              '这里是视频广视频广告长度限制20个字',
            description:
              '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          },{
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title:
              '这里是视频广视频广告长度限制20个字',
            description:
              '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          },{
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title:
              '这里是视频广视频广告长度限制20个字',
            description:
              '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          },{
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title:
              '这里是视频广视频广告长度限制20个字',
            description:
              '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          },{
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title:
              '这里是视频广视频广告长度限制20个字',
            description:
              '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          },{
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title:
              '这里是视频广视频广告长度限制20个字',
            description:
              '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          },{
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title:
              '这里是视频广视频广告长度限制20个字',
            description:
              '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          },
        ],
        total: 100,
      })
    }, 500)
  })
}

// 表格列定义
const columns: DataTableColumns<TableDataRecord> = [
  {
    title: '广告信息',
    key: 'info',
    width: 400,
    render: renderAdvertisingInfo,
  },
  {
    title: '广告类型',
    key: 'adType',
    width: 150,
    render: (row) => {
      // 定义广告类型映射
      const typeMap: Record<string, string> = {
        CPM: '展示广告',
        CPC: '可点击广告',
        CPA: '可下载广告',
      }
      return h(
        'div',
        {
          style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;',
        },
        // 使用类型断言确保 row.adType 是有效的键
        `${row.adType} ${typeMap[row.adType as keyof typeof typeMap]}`,
      )
    },
  },
  {
    title: '创建人',
    key: 'creator',
    width: 120,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '状态',
    key: 'status',
    width: 150,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 200,
    fixed: 'right',
    render: (row: TableDataRecord) => {
      return h(
        NSpace,
        { justify: 'center', align: 'center' },
        {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
                quaternary: true,
                type: 'primary',
                onClick: () => handleEdit(row),
              },
              { default: () => '编辑' },
            ),
            h(
              NButton,
              {
                size: 'small',
                quaternary: true,
                type: 'error',
                onClick: () => {
                  console.log('删除', row)
                },
              },
              { default: () => '删除' },
            ),
          ],
        },
      )
    },
  },
]

onMounted(() => {
  // drawerRef.value?.open()
})

// 抽屉标题
const drawerTitle = computed(() => {
  return formType.value === 'edit' ? '编辑广告' : '新增广告'
})

// 打开抽屉
const handleAdd = () => {
  formType.value = 'add'
  editData.value = {}
  drawerRef.value?.open()
}

const refreshList = () => {
  console.log('refreshList called', tableRef.value)
  if (tableRef.value) {
    tableRef.value.refresh()
  }
}

// 编辑处理
const handleEdit = (row: Record<string, any>) => {
  const formattedData = {
    ...row,
    media: Array.isArray(row.media) ? row.media : [],
    adIcon: Array.isArray(row.adIcon) ? row.adIcon : []
  }
  
  formType.value = 'edit'
  editData.value = formattedData
  drawerRef.value?.open()
}

// 表单提交
const onSubmit = async (formData: FormState) => {
  console.log('提交的数据:', formData)
  return Promise.resolve()
}
</script>

<template>
  <TablePageLayout>
    <template #search>
      <SearchForm :model="defaultSearchForm" :on-search="handleSearch">
        <template #default="{ form }">
          <NFormItem label="关键词">
            <NInput
              v-model:value="form.keyword"
              placeholder="请输入标题关键词"
            />
          </NFormItem>

          <NFormItem label="创建时间" data-width="lg">
            <NDatePicker
              v-model:value="form.dateRange"
              type="daterange"
              clearable
            />
          </NFormItem>

          <NFormItem label="广告类型" data-width="sm">
            <NSelect
              v-model:value="form.type"
              :options="advertisementTypeOptions"
              placeholder="请选择广告类型"
              clearable
            />
          </NFormItem>

          <NFormItem label="审核状态" data-width="sm">
            <NSelect
              v-model:value="form.status"
              :options="statusOptions"
              placeholder="请选择审核状态"
              clearable
            />
          </NFormItem>
          <NFormItem label="审核状态" data-width="sm">
            <NSelect
              v-model:value="form.status"
              :options="statusOptions"
              placeholder="请选择审核状态"
              clearable
            />
          </NFormItem>
          <NFormItem label="审核状态" data-width="sm">
            <NSelect
              v-model:value="form.status"
              :options="statusOptions"
              placeholder="请选择审核状态"
              clearable
            />
          </NFormItem>
          <NFormItem label="审核状态" data-width="sm">
            <NSelect
              v-model:value="form.status"
              :options="statusOptions"
              placeholder="请选择审核状态"
              clearable
            />
          </NFormItem>
        </template>
      </SearchForm>
    </template>

    <!-- 工具栏 -->
    <template #toolbar>
      <NButton type="primary" @click="handleAdd">
        <template #icon>
          <NIcon><AddOutline /></NIcon>
        </template>
        新增广告
      </NButton>
    </template>

    <!-- 表格 -->
    <template #table>
      <Table ref="tableRef" :columns="columns" :fetch-api="tableFetchApi" />
    </template>

    <!-- 新增/编辑广告 -->
    <FormDrawer
      ref="drawerRef"
      :title="drawerTitle"
      :submit-api="onSubmit"
      :form-ref="formRef"
      :refresh-list="refreshList"
    >
      <AdvertisingForm
        ref="formRef"
        :form-type="formType"
        :data="editData"
      />
    </FormDrawer>
  </TablePageLayout>
</template>

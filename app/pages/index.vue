<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Job } from '~/composables/useJobs'

const { getJobs } = useJobs()

const allJobs = ref<Job[]>([])
const loading = ref(true)

const searchQuery = ref('')
const filterRemote = ref(false)
const filterMinSalary = ref(0)
const sortBy = ref('recent') // 'recent', 'highest-salary'

onMounted(async () => {
  allJobs.value = await getJobs()
  loading.value = false
})

const filterLocation = ref('')

const filteredJobs = computed(() => {
  let jobs = [...allJobs.value]
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    jobs = jobs.filter(j => 
      j.title.toLowerCase().includes(q) || 
      j.company.toLowerCase().includes(q) ||
      j.tags.some(t => t.toLowerCase().includes(q))
    )
  }
  
  if (filterLocation.value) {
    const q = filterLocation.value.toLowerCase()
    jobs = jobs.filter(j => j.location.toLowerCase().includes(q))
  }
  
  if (filterRemote.value) {
    jobs = jobs.filter(j => j.remote)
  }
  
  if (filterMinSalary.value > 0) {
    jobs = jobs.filter(j => j.salaryMax >= filterMinSalary.value)
  }
  
  if (sortBy.value === 'recent') {
    jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } else if (sortBy.value === 'highest-salary') {
    jobs.sort((a, b) => b.salaryMax - a.salaryMax)
  }
  
  return jobs
})

const formatTimeAgo = (dateStr: string) => {
  const date = new Date(dateStr)
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  
  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + 'y ago'
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + 'mo ago'
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + 'd ago'
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + 'h ago'
  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + 'm ago'
  return Math.floor(seconds) + 's ago'
}
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
    <div class="text-center mb-12 py-10 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-900/50">
      <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
        Find your next <span class="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">creative</span> role
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
        The #1 job board for designers, illustrators, videographers, and creative professionals.
      </p>
      
      <div class="mt-8 max-w-2xl mx-auto px-4 flex flex-col md:flex-row gap-3">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          size="lg"
          placeholder="Search for job titles, companies, or keywords..."
          class="w-full flex-1"
        />
        <UButton size="lg" color="neutral" class="md:w-auto w-full justify-center">
          Search Jobs
        </UButton>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <div class="flex flex-wrap items-center gap-4">
        <UCheckbox v-model="filterRemote" label="Remote Only" />
        
        <UInput
          v-model="filterLocation"
          icon="i-lucide-map-pin"
          placeholder="Location..."
          class="w-40"
        />
        
        <USelectMenu
          v-model="filterMinSalary"
          :options="[{label: 'Any Salary', value: 0}, {label: '$50k+', value: 50000}, {label: '$100k+', value: 100000}, {label: '$150k+', value: 150000}]"
          value-attribute="value"
          option-attribute="label"
          placeholder="Min Salary"
          class="w-40"
        />
      </div>
      
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium text-gray-500">Sort by:</span>
        <USelectMenu
          v-model="sortBy"
          :options="[{label: 'Recently Posted', value: 'recent'}, {label: 'Highest Salary', value: 'highest-salary'}]"
          value-attribute="value"
          option-attribute="label"
          class="w-44"
        />
      </div>
    </div>

    <!-- Job List -->
    <div v-if="loading" class="flex justify-center p-12">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary" />
    </div>
    <div v-else-if="filteredJobs.length === 0" class="text-center py-12 p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
      <UIcon name="i-lucide-search-x" class="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">No jobs found</h3>
      <p class="text-gray-500 mt-1">Try adjusting your filters or search query.</p>
    </div>
    
    <div v-else class="space-y-4">
      <NuxtLink v-for="job in filteredJobs" :key="job.id" :to="`/jobs/${job.id}`" class="block group">
        <div class="p-5 bg-white dark:bg-gray-900 hover:border-primary-500/50 dark:hover:border-primary-500/50 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-200 flex flex-col sm:flex-row gap-5 items-start sm:items-center relative overflow-hidden group-hover:shadow-md">
          
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <!-- Logo -->
          <div class="w-14 h-14 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-center bg-gray-50 dark:bg-gray-800 overflow-hidden shrink-0">
            <img v-if="job.logo" :src="job.logo" :alt="job.company" class="w-8 h-8 object-contain" />
            <span v-else class="font-bold text-gray-400">{{ job.company.charAt(0) }}</span>
          </div>
          
          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-medium text-sm text-gray-600 dark:text-gray-400">{{ job.company }}</span>
              <span v-if="job.salaryMax > 0" class="inline-flex items-center gap-0.5 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full border border-green-100 dark:border-green-800/50">
                <UIcon name="i-lucide-badge-dollar-sign" class="w-3.5 h-3.5" />
                ${{ (job.salaryMin/1000).toFixed(0) }}k - ${{ (job.salaryMax/1000).toFixed(0) }}k
              </span>
            </div>
            
            <h3 class="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-primary transition-colors">
              {{ job.title }}
            </h3>
            
            <div class="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center gap-1">
                <UIcon name="i-lucide-map-pin" class="w-4 h-4" />
                {{ job.location }}
              </div>
              <div v-if="job.remote" class="flex items-center gap-1">
                <UIcon name="i-lucide-globe" class="w-4 h-4" />
                Remote
              </div>
            </div>
            
            <div class="hidden sm:flex flex-wrap gap-2 mt-3">
              <span v-for="tag in job.tags.slice(0,3)" :key="tag" class="text-xs font-medium px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                {{ tag }}
              </span>
              <span v-if="job.tags.length > 3" class="text-xs font-medium px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                +{{ job.tags.length - 3 }}
              </span>
            </div>
          </div>
          
          <!-- Actions / Time -->
          <div class="flex flex-row sm:flex-col items-center sm:items-end justify-between self-stretch w-full sm:w-auto gap-4">
            <div class="text-sm font-medium text-gray-400 whitespace-nowrap">
              {{ formatTimeAgo(job.createdAt) }}
            </div>
            
            <UButton variant="soft" color="primary" class="opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex">
              View Role
            </UButton>
            <div class="sm:hidden text-primary font-medium text-sm flex items-center gap-1">
              View <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
            </div>
          </div>
          
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

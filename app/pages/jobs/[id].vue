<script setup lang="ts">
const route = useRoute()
const { getJobById } = useJobs()

const job = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  job.value = await getJobById(route.params.id as string)
  loading.value = false
})

useSeoMeta({
  title: computed(() => job.value ? `${job.value.title} at ${job.value.company}` : 'Loading...'),
})
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
    
    <div v-if="loading" class="flex justify-center py-20">
      <UIcon name="i-lucide-loader-2" class="w-10 h-10 animate-spin text-primary" />
    </div>
    
    <div v-else-if="!job" class="text-center py-20">
      <UIcon name="i-lucide-file-question" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Job not found</h2>
      <p class="text-gray-500 mb-6">The job you are looking for does not exist or has been removed.</p>
      <UButton to="/" color="primary" variant="solid">Back to Jobs</UButton>
    </div>
    
    <div v-else class="space-y-8">
      <!-- Header -->
      <div class="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
        
        <div class="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 pointer-events-none">
          <UIcon name="i-lucide-briefcase" class="w-64 h-64 text-primary" />
        </div>
        
        <div class="w-24 h-24 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-center bg-gray-50 dark:bg-gray-800 shrink-0">
          <img v-if="job.logo" :src="job.logo" :alt="job.company" class="w-16 h-16 object-contain" />
          <span v-else class="font-bold text-3xl text-gray-400">{{ job.company.charAt(0) }}</span>
        </div>
        
        <div class="flex-1 z-10">
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white">{{ job.title }}</h1>
          </div>
          <div class="text-xl text-gray-600 dark:text-gray-300 font-medium mb-4">{{ job.company }}</div>
          
          <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
              <UIcon name="i-lucide-map-pin" class="w-4 h-4" />
              {{ job.location }}
            </div>
            
            <div v-if="job.remote" class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
              <UIcon name="i-lucide-globe" class="w-4 h-4" />
              Remote Accepted
            </div>
            
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">
              <UIcon name="i-lucide-banknote" class="w-4 h-4" />
              ${{ (job.salaryMin/1000).toFixed(0) }}k - ${{ (job.salaryMax/1000).toFixed(0) }}k {{ job.salaryCurrency }}
            </div>
          </div>
        </div>
        
        <div class="w-full md:w-auto z-10 flex flex-col gap-3">
          <UButton size="xl" color="primary" block>
            Apply Now
          </UButton>
          <UButton size="lg" color="neutral" variant="ghost" icon="i-lucide-bookmark" block>
            Save Job
          </UButton>
        </div>
      </div>
      
      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left: Details -->
        <div class="lg:col-span-2 space-y-8 bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <UIcon name="i-lucide-file-text" class="w-6 h-6 text-primary" />
              Job Description
            </h2>
            <div class="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
              <p class="whitespace-pre-line">{{ job.description }}</p>
              
              <h3 class="text-xl font-bold mt-8 mb-4">Requirements:</h3>
              <ul class="list-disc pl-5 space-y-2">
                <li>Proven experience in a similar creative role.</li>
                <li>A strong portfolio demonstrating your skills.</li>
                <li>Excellent communication and collaboration skills.</li>
                <li>Ability to work independently in a fast-paced environment.</li>
              </ul>
            </div>
          </div>
          
          <USeparator />
          
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Required Skills</h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in job.tags" :key="tag" class="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium text-sm border border-gray-200 dark:border-gray-700">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Right: Sidemenu -->
        <div class="space-y-6">
          <div class="bg-gray-900 dark:bg-gray-800 rounded-3xl p-6 text-white text-center">
            <div class="w-16 h-16 mx-auto bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
              <UIcon name="i-lucide-mail" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-lg font-bold mb-2">Get alerts for similar jobs</h3>
            <p class="text-sm text-gray-400 mb-6">Enter your email and we'll send you new creative roles like this one.</p>
            <form class="space-y-3" @submit.prevent>
              <UInput placeholder="Email address" class="w-full text-black" color="neutral" />
              <UButton color="primary" block>Subscribe</UButton>
            </form>
          </div>
          
          <div class="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Share this role</h3>
            <div class="flex items-center gap-3">
              <UButton color="neutral" variant="soft" icon="i-lucide-link" class="flex-1 justify-center">Copy Link</UButton>
              <UButton color="neutral" variant="soft" icon="i-simple-icons-x" aria-label="Share on X" class="w-10 h-10 justify-center p-0" />
              <UButton color="neutral" variant="soft" icon="i-simple-icons-linkedin" aria-label="Share on LinkedIn" class="w-10 h-10 justify-center p-0" />
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

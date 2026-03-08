<script setup lang="ts">
import { ref } from 'vue'

const title = ref('')
const company = ref('')
const location = ref('')
const remote = ref(false)
const description = ref('')
const salaryMin = ref()
const salaryMax = ref()
const tags = ref('')

const loading = ref(false)

const handlePostJob = async () => {
  loading.value = true
  
  try {
    // In a real application, you would create the job in Supabase here with a status of 'pending_payment'
    // Then call your server endpoint to create a Stripe checkout session
    
    const response = await $fetch('/api/checkout', {
      method: 'POST',
      body: {
        title: title.value,
        company: company.value,
        priceId: 'price_dummy123' // Replace with your actual Stripe Price ID
      }
    })
    
    // Redirect to Stripe checkout
    if (response.url) {
      window.location.href = response.url
    } else {
      alert('Simulated Stripe checkout! In a real app, you would be redirected to Stripe to pay $299.')
      loading.value = false
      navigateTo('/')
    }
  } catch (error) {
    console.error(error)
    alert('Error connecting to Stripe checkout.')
    loading.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
    
    <div class="text-center mb-10">
      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Reach the world's top creatives</h1>
      <p class="text-gray-600 dark:text-gray-400">Post a job for 30 days. Reach over 50k+ designers, illustrators, and artists.</p>
    </div>
    
    <div class="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <!-- Header -->
      <div class="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-900/30 border-b border-gray-200 dark:border-gray-800">
        <h2 class="text-xl font-bold flex items-center gap-2">
          <UIcon name="i-lucide-pencil" class="w-5 h-5 text-primary" />
          Job Details
        </h2>
      </div>
      
      <!-- Form -->
      <form class="p-6 md:p-8 space-y-6" @submit.prevent="handlePostJob">
        
        <UFormGroup label="Job Title" name="title" required>
          <UInput v-model="title" placeholder="e.g. Senior Product Designer" size="lg" />
        </UFormGroup>
        
        <UFormGroup label="Company Name" name="company" required>
          <UInput v-model="company" placeholder="e.g. Figma" size="lg" />
        </UFormGroup>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormGroup label="Location" name="location" required>
            <UInput v-model="location" placeholder="e.g. San Francisco, CA" size="lg" />
          </UFormGroup>
          
          <UFormGroup label="Remote Options" name="remote" class="self-end my-auto pb-2">
            <UCheckbox v-model="remote" label="This job accepts remote applicants" />
          </UFormGroup>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormGroup label="Min Salary (USD)" name="salaryMin">
            <UInput v-model="salaryMin" type="number" placeholder="e.g. 100000" size="lg">
              <template #leading><span class="text-gray-500">$</span></template>
            </UInput>
          </UFormGroup>
          
          <UFormGroup label="Max Salary (USD)" name="salaryMax">
            <UInput v-model="salaryMax" type="number" placeholder="e.g. 150000" size="lg">
              <template #leading><span class="text-gray-500">$</span></template>
            </UInput>
          </UFormGroup>
        </div>
        
        <UFormGroup label="Tags (comma separated)" name="tags">
          <UInput v-model="tags" placeholder="e.g. UI, UX, Figma, Illustration" size="lg" />
        </UFormGroup>
        
        <UFormGroup label="Job Description" name="description" required>
          <UTextarea v-model="description" placeholder="Describe the role, responsibilities, and requirements..." :rows="8" />
        </UFormGroup>
        
        <USeparator class="my-6" />
        
        <!-- Payment -->
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 class="text-lg font-bold flex items-center gap-2">
              <UIcon name="i-lucide-credit-card" class="w-5 h-5" />
              Standard Listing
            </h3>
            <p class="text-sm text-gray-500 mt-1">Boost visibility and receive applications instantly. Valid for 30 days.</p>
          </div>
          
          <div class="flex flex-col items-center">
            <div class="text-2xl font-extrabold mb-2">$299</div>
            <UButton 
              type="submit" 
              color="primary" 
              size="xl" 
              :loading="loading"
              icon="i-lucide-lock"
              class="w-full sm:w-auto font-bold px-8 shadow-md"
            >
              Post & Pay
            </UButton>
            <p class="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <UIcon name="i-simple-icons-stripe" class="w-8 h-8 opacity-50" />
              Secured by Stripe
            </p>
          </div>
        </div>
        
      </form>
    </div>
    
  </div>
</template>

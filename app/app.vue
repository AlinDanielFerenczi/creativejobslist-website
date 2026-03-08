<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Creative Jobs List'
const description = 'Find your next creative role. The best jobs in design, writing, videography, and more.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const logout = async () => {
  await supabase.auth.signOut()
  navigateTo('/')
}
</script>

<template>
  <UApp>
    <div class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Creative Jobs List
            </NuxtLink>
          </div>
          <div class="flex items-center gap-4">
            <NuxtLink v-if="!user" to="/login">
              <UButton color="neutral" variant="ghost" class="font-medium">
                Log In
              </UButton>
            </NuxtLink>
            <div v-else class="flex items-center gap-2">
              <span class="text-sm text-gray-600 dark:text-gray-300">{{ user.email }}</span>
              <UButton color="neutral" variant="ghost" icon="i-lucide-log-out" class="font-medium" @click="logout">
                Log Out
              </UButton>
            </div>
            
            <NuxtLink to="/post">
              <UButton color="primary" variant="solid" icon="i-lucide-plus" class="font-medium rounded-full px-4">
                Post a Job
              </UButton>
            </NuxtLink>
            <UColorModeButton />
          </div>
        </div>
      </div>
    </div>

    <UMain class="pt-24 min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-gray-950">
      <NuxtPage />
    </UMain>

    <UFooter class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          © {{ new Date().getFullYear() }} Creative Jobs List. All rights reserved.
        </p>
      </div>
    </UFooter>
  </UApp>
</template>

<script setup lang="ts">
const route = useRoute()
const sessionId = route.query.session_id as string | undefined
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-20 text-center">
    <div class="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm p-10">
      <UIcon name="i-lucide-check-circle" class="w-16 h-16 text-green-500 mx-auto mb-6" />
      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Job Posted!</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        Your payment was successful and your job listing is now live. It will be visible for 30 days.
      </p>
      <div class="flex justify-center gap-4">
        <UButton to="/" color="primary" size="lg">Browse Jobs</UButton>
        <UButton to="/post" variant="outline" size="lg">Post Another</UButton>
      </div>
      <p v-if="sessionId" class="text-xs text-gray-400 mt-6">
        Session: {{ sessionId }}
      </p>
    </div>
  </div>
</template>

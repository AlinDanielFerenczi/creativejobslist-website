<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const email = ref('')
const password = ref('')
const isSignUp = ref(false)
const error = ref('')
const loading = ref(false)

watchEffect(() => {
  if (user.value) {
    navigateTo('/')
  }
})

const handleAuth = async () => {
  loading.value = true
  error.value = ''
  
  try {
    if (isSignUp.value) {
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      })
      if (signUpError) throw signUpError
      // Optional: Handle email verification requirement
      alert('Check your email for the login link!')
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      if (signInError) throw signInError
      navigateTo('/')
    }
  } catch (e: any) {
    error.value = e.message || 'An error occurred during authentication'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-20 flex flex-col justify-center min-h-[60vh]">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
        {{ isSignUp ? 'Create an account' : 'Welcome back' }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ isSignUp ? 'Join Creative Jobs List to manage your jobs' : 'Sign in to access your dashboard' }}
      </p>
    </div>
    
    <div class="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <form class="space-y-5" @submit.prevent="handleAuth">
        <UAlert v-if="error" color="error" variant="soft" :title="error" icon="i-lucide-alert-circle" />
        
        <UFormGroup label="Email address" name="email" required>
          <UInput v-model="email" type="email" placeholder="you@example.com" size="xl" icon="i-lucide-mail" />
        </UFormGroup>
        
        <UFormGroup label="Password" name="password" required>
          <UInput v-model="password" type="password" placeholder="••••••••" size="xl" icon="i-lucide-lock" />
        </UFormGroup>
        
        <UButton type="submit" color="primary" size="xl" block :loading="loading" class="mt-8 font-bold">
          {{ isSignUp ? 'Sign up' : 'Sign in' }}
        </UButton>
      </form>
      
      <div class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        {{ isSignUp ? 'Already have an account?' : 'Don\'t have an account?' }}
        <button type="button" class="text-primary font-medium hover:underline ml-1" @click="isSignUp = !isSignUp">
          {{ isSignUp ? 'Sign in' : 'Sign up' }}
        </button>
      </div>
    </div>
  </div>
</template>

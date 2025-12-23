import { Stack } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StatusBar } from 'expo-status-bar'

const queryClient = new QueryClient()

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#f97316' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="movie/[id]" options={{ title: 'Movie Details' }} />
        <Stack.Screen name="person/[id]" options={{ title: 'Person' }} />
        <Stack.Screen name="login" options={{ title: 'Sign In', presentation: 'modal' }} />
        <Stack.Screen name="register" options={{ title: 'Sign Up', presentation: 'modal' }} />
      </Stack>
      <StatusBar style="light" />
    </QueryClientProvider>
  )
}

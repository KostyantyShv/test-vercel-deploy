import './App.css'
import { ClerkProvider } from '@clerk/clerk-react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

function App() {
  const { data, error, isLoading } = useSWR('https://api.github.com/repos/vercel/swr', fetcher)

  if (error) return <div>Failed to load</div>
  if (isLoading) return <div>Loading...</div>

  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <div>
        <h1>{data.name}</h1>
        <p>{data.description}</p>
        <strong>👁 {data.subscribers_count}</strong>{' '}
        <strong>✨ {data.stargazers_count}</strong>{' '}
        <strong>🍴 {data.forks_count}</strong>
      </div>
    </ClerkProvider>
  )
}

export default App
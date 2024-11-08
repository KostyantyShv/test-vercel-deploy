import './App.css'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())
const API_URL = import.meta.env.PROD 
  ? 'https://test-vercel-deploy-nine-steel.vercel.app/api/svix'
  : '/api/svix'

function App() {
  const { data: apiData, error: apiError } = useSWR(API_URL, fetcher)
  const { data, error, isLoading } = useSWR('https://api.github.com/repos/vercel/swr', fetcher)

  if (error || apiError) return <div>Failed to load: {error?.message || apiError?.message}</div>
  if (isLoading || !apiData) return <div>Loading...</div>

  return (
    <div>
      <div>
        <h2>SWR Repository Info:</h2>
        <h1>{data.name}</h1>
        <p>{data.description}</p>
        <strong>👁 {data.subscribers_count}</strong>{' '}
        <strong>✨ {data.stargazers_count}</strong>{' '}
        <strong>🍴 {data.forks_count}</strong>
      </div>

      <div>
        <h2>Webhook API Response:</h2>
        <pre>{JSON.stringify(apiData, null, 2)}</pre>
      </div>
    </div>
  )
}

export default App
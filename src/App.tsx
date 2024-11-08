import './App.css'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

function App() {
  const { data, error, isLoading } = useSWR('https://api.github.com/repos/vercel/swr', fetcher)

  if (error) return <div>Failed to load</div>
  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👁 {data.subscribers_count}</strong>{' '}
      <strong>✨ {data.stargazers_count}</strong>{' '}
      <strong>🍴 {data.forks_count}</strong>
    </div>
  )
}

export default App
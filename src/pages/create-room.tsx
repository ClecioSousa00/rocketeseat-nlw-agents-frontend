import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

type GetRoomsAPIResponse = Array<{
  id: string
  name: string
}>

export function CreateRoom() {
  const { data, isLoading } = useQuery({
    queryKey: ['get-rooms'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3333/rooms')
      const result: GetRoomsAPIResponse = await response.json()
      return result
    },
  })
  return (
    <div>
      <h1>Create Room</h1>

      <div className="flex flex-col gap-1">
        {data?.map((item) => (
          <Link key={item.id} to={`/room/${item.id}`}>
            {item.name}
          </Link>
        ))}
      </div>

      {isLoading && <p>...carregando</p>}
    </div>
  )
}

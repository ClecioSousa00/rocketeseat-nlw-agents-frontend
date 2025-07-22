import { Link } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Badge } from './ui/badge'
import { ArrowRight } from 'lucide-react'
import { dayjs } from '@/lib/dayjs'
import { useRooms } from '@/http/use-rooms'

export const RoomList = () => {
  const { data, isLoading } = useRooms()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Salas recentes</CardTitle>
        <CardDescription>
          Acesso rápido para as salas criadas recentemente
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isLoading && (
          <p className="text-muted-foreground text-sm">Carregando salas...</p>
        )}
        {!isLoading &&
          data?.map((room) => {
            return (
              <Link
                key={room.id}
                to={`/room/${room.id}`}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50"
              >
                <div className=" flex  flex-1 flex-col gap-1">
                  <h3 className="font-medium">{room.name}</h3>
                  <div className=" flex items-center gap-2">
                    <Badge variant={'secondary'}>
                      {dayjs(room.createdAt).toNow()}
                    </Badge>
                    <Badge variant={'secondary'}>
                      {room.questionsCount} pergunta(s)
                    </Badge>
                  </div>
                </div>

                <span className="flex items-center gap text-sm">
                  Entrar
                  <ArrowRight className="size-3" />
                </span>
              </Link>
            )
          })}
      </CardContent>
    </Card>
  )
}

import { Button } from '@/components/ui/button'
import { useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'

const isRecordingSupported =
  !!navigator.mediaDevices &&
  typeof navigator.mediaDevices.getUserMedia === 'function' &&
  typeof window.MediaRecorder === 'function'

type RoomParams = {
  roomId: string
}

export const RecordRoomAudio = () => {
  const params = useParams<RoomParams>()

  const [isRecording, setIsRecording] = useState(false)
  const recorder = useRef<MediaRecorder | null>(null)
  const intervalRef = useRef<NodeJS.Timeout>(null)

  const stopRecording = () => {
    setIsRecording(false)
    if (recorder.current && recorder.current.state !== 'inactive') {
      recorder.current.stop()
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const uploadAudio = async (audio: Blob) => {
    const formData = new FormData()

    formData.append('file', audio, 'audio.webm')
    const response = await fetch(
      `http://localhost:3333/rooms/${params.roomId}/audio`,
      {
        method: 'POST',
        body: formData,
      },
    )

    const result = await response.json()
    console.log(result)
  }

  const createRecorder = (audio: MediaStream) => {
    recorder.current = new MediaRecorder(audio, {
      mimeType: 'audio/webm',
      audioBitsPerSecond: 64_100,
    })

    recorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        uploadAudio(event.data)
      }
    }
    recorder.current.onstart = () => {
      console.log('gravação iniciada')
    }

    recorder.current.onstop = () => {
      console.log('Gravação encerrada/pausada ')
    }

    recorder.current.start()
  }

  const startRecording = async () => {
    if (!isRecordingSupported) {
      alert('Navegador não tem suporte a gravação')
      return
    }

    setIsRecording(true)

    const audio = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44_100,
      },
    })

    createRecorder(audio)

    intervalRef.current = setInterval(() => {
      recorder.current?.stop()

      createRecorder(audio)
    }, 5000)
  }

  if (!params.roomId) {
    return <Navigate replace to="/" />
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3">
      {isRecording && <Button onClick={stopRecording}>Pausar Gravação</Button>}
      {!isRecording && (
        <Button onClick={startRecording}>Iniciar Gravação</Button>
      )}
      {isRecording && <p>Gravando...</p>}
      {!isRecording && <p>Pausado</p>}
    </div>
  )
}

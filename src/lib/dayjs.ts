import 'dayjs/locale/pt-br'
import dayjsLib from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjsLib.locale('pt-BR')
dayjsLib.extend(relativeTime)

export const dayjs = dayjsLib

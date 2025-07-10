import { Message, Req } from './message'
import { MessageSchema } from './validator'

export const encode = (msg: Message): string => JSON.stringify(msg)

export const decode = (raw: string): Message => MessageSchema.parse(JSON.parse(raw))

export const buildReq = (data: Omit<Req, 't'>) => ({ t: 'req', ...data } as Req)
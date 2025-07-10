import { z } from 'zod';

export const RegisterSchema = z.object({
    t: z.literal('reg'),
    sub: z.string().min(1),
    version: z.literal(1)
});

export const AckSchema = z.object({
    t: z.literal('ack'),
    sub: z.string().min(1),
    publicUrl: z.string().min(1),
});

export const ReqSchema = z.object({
    t: z.literal('req'),
    id: z.string().min(1),
    method: z.string().min(1),
    path: z.string().min(1),
    headers: z.record(z.string(), z.string()),
    body: z.string().min(1),
});

export const ResSchema = z.object({
    t: z.literal('res'),
    id: z.string().min(1),
    status: z.number().int(),
    headers: z.record(z.string(), z.string()),
    body: z.string().min(1),
});

export const PingSchema = z.object({
    t: z.literal('ping'),
});

export const PongSchema = z.object({
    t: z.literal('pong'),
});

export const ErrSchema = z.object({
    t: z.literal('err'),
    id: z.string().optional(),
    code: z.string().min(1),
    msg: z.string().min(1),
});

export const MessageSchema = z.discriminatedUnion('t', [
    RegisterSchema, AckSchema, ReqSchema,
    ResSchema, PingSchema, PongSchema, ErrSchema,
])
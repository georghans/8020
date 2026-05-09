import type { Message as MessageAISDK } from "ai"
import { fetchClient } from "../../fetch"
import { readFromIndexedDB, writeToIndexedDB } from "../persist"

export interface ExtendedMessageAISDK extends MessageAISDK {
  message_group_id?: string
  model?: string
}

export async function getMessagesFromDb(
  chatId: string
): Promise<MessageAISDK[]> {
  const response = await fetchClient(
    `/api/messages?chatId=${encodeURIComponent(chatId)}`
  )
  if (!response.ok) {
    console.error("Failed to fetch messages:", await response.text())
    return []
  }

  const { messages: data } = await response.json()
  return data.map((message) => ({
    ...message,
    id: String(message.id),
    content: message.content ?? "",
    createdAt: new Date(message.created_at || ""),
    parts: (message?.parts as MessageAISDK["parts"]) || undefined,
    message_group_id: message.message_group_id,
    model: message.model,
  }))
}

export async function getLastMessagesFromDb(
  chatId: string,
  limit: number = 2
): Promise<MessageAISDK[]> {
  const response = await fetchClient(
    `/api/messages?chatId=${encodeURIComponent(chatId)}&limit=${limit}`
  )
  if (!response.ok) {
    console.error("Failed to fetch last messages:", await response.text())
    return []
  }

  const { messages: data } = await response.json()
  return data.map((message) => ({
    ...message,
    id: String(message.id),
    content: message.content ?? "",
    createdAt: new Date(message.created_at || ""),
    parts: (message?.parts as MessageAISDK["parts"]) || undefined,
    message_group_id: message.message_group_id,
    model: message.model,
  }))
}

async function insertMessageToDb(
  chatId: string,
  message: ExtendedMessageAISDK
) {
  return
}

async function insertMessagesToDb(
  chatId: string,
  messages: ExtendedMessageAISDK[]
) {
  return
}

async function deleteMessagesFromDb(chatId: string) {
  await fetchClient(`/api/messages?chatId=${encodeURIComponent(chatId)}`, {
    method: "DELETE",
  })
}

type ChatMessageEntry = {
  id: string
  messages: MessageAISDK[]
}

export async function getCachedMessages(
  chatId: string
): Promise<MessageAISDK[]> {
  const entry = await readFromIndexedDB<ChatMessageEntry>("messages", chatId)

  if (!entry || Array.isArray(entry)) return []

  return (entry.messages || []).sort(
    (a, b) => +new Date(a.createdAt || 0) - +new Date(b.createdAt || 0)
  )
}

export async function cacheMessages(
  chatId: string,
  messages: MessageAISDK[]
): Promise<void> {
  await writeToIndexedDB("messages", { id: chatId, messages })
}

export async function addMessage(
  chatId: string,
  message: MessageAISDK
): Promise<void> {
  await insertMessageToDb(chatId, message)
  const current = await getCachedMessages(chatId)
  const updated = [...current, message]

  await writeToIndexedDB("messages", { id: chatId, messages: updated })
}

export async function setMessages(
  chatId: string,
  messages: MessageAISDK[]
): Promise<void> {
  await insertMessagesToDb(chatId, messages)
  await writeToIndexedDB("messages", { id: chatId, messages })
}

export async function clearMessagesCache(chatId: string): Promise<void> {
  await writeToIndexedDB("messages", { id: chatId, messages: [] })
}

export async function clearMessagesForChat(chatId: string): Promise<void> {
  await deleteMessagesFromDb(chatId)
  await clearMessagesCache(chatId)
}

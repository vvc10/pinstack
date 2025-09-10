// Simple in-memory store for boards and pins (mock only)

export type StorePin = {
  id: string
  title: string
  image: string
  tags: string[]
  lang: string
  height: number
  code: string
}

export type Board = {
  id: string
  name: string
  pins: StorePin[]
}

type BoardsStore = {
  boards: Board[]
}

function initStore(): BoardsStore {
  return {
    boards: [
      { id: "frontend", name: "Frontend Patterns", pins: [] },
      { id: "backend", name: "Backend Snippets", pins: [] },
      { id: "ml", name: "ML & Data", pins: [] },
    ],
  }
}

// global singleton to persist across route calls in preview
const g = globalThis as unknown as { __DEV_PIN_BOARDS__?: BoardsStore }
if (!g.__DEV_PIN_BOARDS__) {
  g.__DEV_PIN_BOARDS__ = initStore()
}
const store = g.__DEV_PIN_BOARDS__!

export function listBoards() {
  return store.boards.map((b) => ({ id: b.id, name: b.name, count: b.pins.length }))
}

export function getBoard(id: string) {
  return store.boards.find((b) => b.id === id) || null
}

export function createBoard(name: string) {
  const id = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
  let uniqueId = id || `board-${Date.now()}`
  if (store.boards.some((b) => b.id === uniqueId)) {
    uniqueId = `${uniqueId}-${Math.floor(Math.random() * 1000)}`
  }
  const board: Board = { id: uniqueId, name, pins: [] }
  store.boards.unshift(board)
  return board
}

export function addPinToBoard(boardId: string, pin: StorePin) {
  const board = getBoard(boardId)
  if (!board) return null
  if (!board.pins.some((p) => p.id === pin.id)) {
    board.pins.unshift(pin)
  }
  return board
}

export function removePinFromBoard(boardId: string, pinId: string) {
  const board = getBoard(boardId)
  if (!board) return null
  board.pins = board.pins.filter((p) => p.id !== pinId)
  return board
}

export function reorderBoardPins(boardId: string, orderIds: string[]) {
  const board = getBoard(boardId)
  if (!board) return null
  const map = new Map(board.pins.map((p) => [p.id, p]))
  board.pins = orderIds.map((id) => map.get(id)).filter(Boolean) as StorePin[]
  return board
}

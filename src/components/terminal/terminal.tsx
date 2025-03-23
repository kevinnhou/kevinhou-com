"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

import type { CommandResult } from "~/terminal/commands"

import { createCommandRegistry } from "~/terminal/commands"
import { formatOutput } from "~/terminal/output"

interface HistoryItem {
  content: string
  directory?: string
  formatted?: React.ReactNode[]
  success?: boolean
  type: "input" | "output"
}

export default function Terminal() {
  const [input, setInput] = useState("")
  const [savedInput, setSavedInput] = useState("")
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [commandSuccess, setCommandSuccess] = useState(true)
  const [selectionMode, setSelectionMode] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [directory, setDirectory] = useState("~")
  const commandRegistry = useRef(createCommandRegistry())

  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const cursorRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      if (!selectionMode && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        inputRef.current?.focus()
      }
    }

    window.addEventListener("keypress", handleKeyPress)
    return () => window.removeEventListener("keypress", handleKeyPress)
  }, [selectionMode])

  async function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault()
      if (input.trim()) {
        setCommandHistory(prev => [...prev, input])
      }
      setHistoryIndex(-1)
      setSavedInput("")

      setHistory(prev => [
        ...prev,
        {
          content: input,
          directory,
          success: commandSuccess,
          type: "input",
        },
      ])

      const result = await processCommand(input)

      if (result.output || result.output === "") {
        setHistory(prev => [
          ...prev,
          {
            content: result.output,
            formatted: formatOutput(result.output),
            success: result.success,
            type: "output",
          },
        ])
      }

      setCommandSuccess(result.success)

      setInput("")
      cursorRef.current = 0
    }
    else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        if (historyIndex === -1) {
          setSavedInput(input)
        }
        const newIndex = historyIndex + 1
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex)
          const command = commandHistory[commandHistory.length - 1 - newIndex]
          setInput(command)
          cursorRef.current = command.length
        }
      }
    }
    else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > -1) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        if (newIndex === -1) {
          setInput(savedInput)
          cursorRef.current = savedInput.length
        }
        else {
          const command = commandHistory[commandHistory.length - 1 - newIndex]
          setInput(command)
          cursorRef.current = command.length
        }
      }
    }
    else if (e.key === "ArrowLeft") {
      cursorRef.current = Math.max(0, cursorRef.current - 1)
    }
    else if (e.key === "ArrowRight") {
      cursorRef.current = Math.min(input.length, cursorRef.current + 1)
    }
  }

  async function processCommand(cmd: string): Promise<CommandResult> {
    if ((cmd.trim().toLowerCase() === "clear") || cmd.trim().toLowerCase().startsWith("clear ")) {
      setTimeout(() => {
        setHistory([])
        setCommandSuccess(true)
      }, 0)
    }

    return commandRegistry.current.execute(cmd, directory)
  }

  function handleMouseDown() {
    setSelectionMode(true)
  }

  function handleMouseUp() {
    setSelectionMode(false)
    setTimeout(() => {
      if (!window.getSelection()?.toString()) {
        inputRef.current?.focus()
      }
    }, 10)
  }

  function renderDirectory(directory: string) {
    return <div className="text-[#06989A]">{directory}</div>
  }

  function renderArrow(success = true) {
    return <div className={success ? "text-green" : "text-red"}>❯</div>
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden border border-primary-bright/20 shadow-xl">
      <div
        className="h-full overflow-y-auto bg-background p-4 text-sm"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        ref={terminalRef}
      >
        {history.map((item, index) => (
          <div className="mt-1" key={index}>
            {item.type === "input"
              ? (
                  <div>
                    {renderDirectory(item.directory || "~")}
                    <div className="flex">
                      {renderArrow(item.success)}
                      <span className="ml-2 text-wrap max-w-full break-words selection: ">{item.content}</span>
                    </div>
                  </div>
                )
              : (
                  <div className="text-wrap break-words selection:bg-[#28344A]">{item.formatted || item.content}</div>
                )}
          </div>
        ))}

        <div className="mt-1">
          {renderDirectory(directory)}
          <div className="flex">
            {renderArrow(commandSuccess)}
            <span className="ml-2 text-wrap max-w-full break-words selection:bg-[#28344A]">
              {input.slice(0, cursorRef.current)}
              <span
                className={`inline-block h-[1.2em] w-[0.5em] bg-[#C0CAF5] align-bottom ${
                  cursorVisible ? "opacity-100" : "opacity-0"
                }`}
              />
              {input.slice(cursorRef.current)}
            </span>
          </div>
        </div>
      </div>

      <input
        autoFocus
        className="absolute top-0 left-0 h-0 w-0 opacity-0"
        onChange={(e) => {
          setInput(e.target.value)
          cursorRef.current = e.target.selectionStart || 0
        }}
        onKeyDown={handleKeyDown}
        onSelect={(e) => {
          cursorRef.current = (e.target as HTMLInputElement).selectionStart || 0
        }}
        ref={inputRef}
        type="text"
        value={input}
      />
    </div>
  )
}

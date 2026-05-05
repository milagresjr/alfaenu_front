'use client';

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Node = {
  title: string
  description?: string
  options?: Node[]
}

// 🌳 Árvore de decisão
const flow: Node = {
  title: "Tipo de Visto",
  options: [
    {
      title: "Visto Nacional",
      options: [
        {
          title: "Visto de Formação Profissional",
          options: [
            {
              title: "Financiado",
              options: [
                { title: "Nacional" },
                { title: "Estrangeiro" }
              ]
            },
            { title: "Auto Financiado" },
          ]
        },
        { title: "Visto de Trabalho" },
        { title: "Visto de Estudante" },
      ],
    },
    {
      title: "Visto Schengen",
      options: [
        { title: "Turismo" },
        { title: "Negócios" },
      ],
    },
  ],
}

export function StepOrganization() {
  const [currentNode, setCurrentNode] = useState<Node>(flow)
  const [history, setHistory] = useState<Node[]>([])
  const [selectedPath, setSelectedPath] = useState<string[]>([])

  function handleSelect(option: Node) {
    if(!selectedPath.includes(option.title)){
      setSelectedPath(prev => [...prev, option.title])
    }

    if (option.options) {
      setHistory(prev => [...prev, currentNode])
      setCurrentNode(option)
    } else {
      console.log("Resultado final:", option.title)
    }
  }

  function handleBack() {
    if (history.length === 0) return

    const prev = history[history.length - 1]
    setHistory(history.slice(0, -1))
    setCurrentNode(prev)
    setSelectedPath(prevPath => prevPath.slice(0, -1))
  }

  return (
    <div className="flex justify-center">
      <div className="w-[90%] max-w-5xl mt-10">

        {/*Breadcrumb */}
        <div className="mb-6 text-sm text-gray-500">
          {["Início", ...selectedPath].join(" / ")}
        </div>

        {/*Botão voltar */}
        {history.length > 0 && (
          <button
            onClick={handleBack}
            className="mb-4 text-sm text-blue-500 hover:underline"
          >
            ← Voltar
          </button>
        )}

        {/* 🎬 Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentNode.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            {currentNode.options?.map((option, index) => (
              <motion.button
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                // whileHover={{ scale: 1.05, y: -6 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelect(option)}
                className="flex-1 p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-2xl hover:shadow-black/20 transition-all cursor-pointer"
              >
                <h2 className="text-xl font-bold mb-2">
                  {option.title}
                </h2>
                {option.description && (
                  <p className="text-sm opacity-90">
                    {option.description}
                  </p>
                )}
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  )
}
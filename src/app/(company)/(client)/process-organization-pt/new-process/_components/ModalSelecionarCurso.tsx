'use client'

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, X, MapPin, DollarSign, Clock, BookOpen, GraduationCap, Sparkles, Star, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useCourses } from "@/features/course/hooks/useCourseQuery"
import { Skeleton } from "@/components/ui/skeleton"
import { formatarMoeda } from "@/lib/helpers"
import { CourseType } from "@/features/course/types"


interface ModalSelecionarCursoProps {
  isOpen: boolean
  onClose: () => void
  onSelectCourse: (course: CourseType) => void
  excludeCourseIds?: number[]
}

// Mapeamento de locais para ícones/emoji
const getLocationIcon = (local: string): string => {
  const locationMap: Record<string, string> = {
    'Turquia': '🇹🇷',
    'Emirados Árabes': '🇦🇪',
    'Reino Unido': '🇬🇧',
    'Brasil': '🇧🇷',
    'França': '🇫🇷',
    'Portugal': '🇵🇹',
    'África do Sul': '🇿🇦',
    'Espanha': '🇪🇸',
  };
  return locationMap[local] || '🌍';
};

// Dados fictícios para visualização (baseados na imagem fornecida)
const MOCK_COURSES: CourseType[] = [
  {
    id: 1,
    nome: "Istanbul",
    local: "Turquia",
    preco: 18,
    duracao: "7 dias",
    descricao: "Descubra a magia de Istambul, onde o Oriente encontra o Ocidente. Pacote inclui hospedagem e city tour. Conheça a Mesquita Azul, Santa Sofia e o Grande Bazar.",
    imagem: null
  },
  {
    id: 2,
    nome: "Dubai",
    local: "Emirados Árabes",
    preco: 18,
    duracao: "5 dias",
    descricao: "Luxo e modernidade em Dubai. Conheça o Burj Khalifa, Dubai Mall e muito mais. Inclui passeio de barco e safari no deserto.",
    imagem: null
  },
  {
    id: 3,
    nome: "Londres",
    local: "Reino Unido",
    preco: 88,
    duracao: "8 dias",
    descricao: "Explore a capital inglesa com seus museus, teatros e a famosa roda-gigante London Eye. Visite o Big Ben, Parlamento e muito mais.",
    imagem: null
  },
  {
    id: 4,
    nome: "São Paulo",
    local: "Brasil",
    preco: 25,
    duracao: "6 dias",
    descricao: "A cidade que nunca para. Gastronomia, cultura e entretenimento na maior cidade do Brasil. Conheça a Avenida Paulista e o Mercado Municipal.",
    imagem: null
  },
  {
    id: 5,
    nome: "Paris",
    local: "França",
    preco: 75,
    duracao: "7 dias",
    descricao: "A cidade do amor. Visite a Torre Eiffel, Louvre e desfrute da culinária francesa. Passeio de barco pelo Rio Sena incluso.",
    imagem: null
  },
  {
    id: 6,
    nome: "Lisboa",
    local: "Portugal",
    preco: 52,
    duracao: "6 dias",
    descricao: "Descubra as colinas de Lisboa, o Fado e os famosos pastéis de Belém. Visite o Mosteiro dos Jerônimos e a Torre de Belém.",
    imagem: null
  },
  {
    id: 7,
    nome: "Cidade do Cabo",
    local: "África do Sul",
    preco: 33,
    duracao: "8 dias",
    descricao: "Aventura na Table Mountain, praias deslumbrantes e a famosa rota dos vinhedos. Inclui visita ao Cabo da Boa Esperança.",
    imagem: null
  },
  {
    id: 8,
    nome: "Madri",
    local: "Espanha",
    preco: 72,
    duracao: "5 dias",
    descricao: "Arte, tapas e muita vida noturna na capital espanhola. Visite o Museu do Prado e o Parque do Retiro.",
    imagem: null
  },
  {
    id: 9,
    nome: "Porto",
    local: "Portugal",
    preco: 18,
    duracao: "4 dias",
    descricao: "Conheça as caves do vinho do Porto, a Ribeira e a bela arquitetura da cidade. Inclui degustação de vinhos e passeio de barco no Douro.",
    imagem: null
  },
  {
    id: 10,
    nome: "Joanesburgo",
    local: "África do Sul",
    preco: 18,
    duracao: "5 dias",
    descricao: "História e cultura sul-africana, museus e vida selvagem nas proximidades. Visite o Apartheid Museum e o Parque Kruger.",
    imagem: null
  },
  {
    id: 11,
    nome: "Barcelona",
    local: "Espanha",
    preco: 18,
    duracao: "6 dias",
    descricao: "Arquitetura única de Gaudí, praias e a animada vida noturna catalã. Visite a Sagrada Família e o Parque Güell.",
    imagem: null
  }
]

export function ModalSelecionarCurso({
  isOpen,
  onClose,
  onSelectCourse,
  excludeCourseIds = []
}: ModalSelecionarCursoProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null)
  const [hoveredCourseId, setHoveredCourseId] = useState<number | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  
  const { data: dataCourses, isLoading: isLoadingAPI } = useCourses()
  
  // Usar dados da API ou mock
  const allCourses = (dataCourses?.data || MOCK_COURSES)
  const isLoading = isLoadingAPI

  // Gerar locais únicos dos cursos para os filtros
  const featuredDestinations = useMemo(() => {
    const uniqueLocations = new Map<string, number>()
    
    allCourses.forEach((course: CourseType) => {
      const currentCount = uniqueLocations.get(course?.local) || 0
      uniqueLocations.set(course?.local, currentCount + 1)
    })
    
    return Array.from(uniqueLocations.entries()).map(([location, count]) => ({
      name: location,
      count: count,
      icon: getLocationIcon(location)
    }))
  }, [allCourses])

  // Filtrar cursos baseado no search, local e exclusão
  const filteredCourses = allCourses.filter((course: CourseType) => {
    const matchesSearch = course.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.local.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = selectedLocation === "" || course.local === selectedLocation
    const notExcluded = !excludeCourseIds.includes(Number(course.id))
    return matchesSearch && matchesLocation && notExcluded
  });

  // Resetar estado quando fechar
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("")
      setSelectedCourse(null)
      setSelectedLocation("")
    }
  }, [isOpen])

  const handleSelectCourse = () => {
    if (selectedCourse) {
      onSelectCourse(selectedCourse)
      onClose()
    }
  }

  // Obter URL da imagem
  const getImageUrl = (imagem: string | null) => {
    if (!imagem) return '/images/placeholder-course.jpg'
    if (imagem.startsWith('http')) return imagem
    return `${process.env.NEXT_PUBLIC_API_URL}/storage/${imagem}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full h-full max-w-none max-h-none sm:max-w-none sm:max-h-none md:max-w-none md:max-h-none lg:max-w-none lg:max-h-none xl:max-w-none xl:max-h-none rounded-none overflow-hidden flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                Selecionar Curso
              </DialogTitle>
              <DialogDescription className="mt-1">
                Escolha o curso desejado para sua matrícula
              </DialogDescription>
            </div>
          </div>

          {/* Barra de pesquisa */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar curso por nome ou local..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtros de localização dinâmicos */}
          {featuredDestinations.length > 0 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              <Button
                variant={selectedLocation === "" ? "default" : "outline"}
                size="sm"
                className="rounded-full gap-1"
                onClick={() => setSelectedLocation("")}
              >
                <span className="text-lg">🌎</span>
                <span>Todos</span>
                <span className="text-xs text-muted-foreground">({allCourses.length})</span>
              </Button>
              {featuredDestinations.map((dest) => (
                <Button
                  key={dest.name}
                  variant={selectedLocation === dest.name ? "default" : "outline"}
                  size="sm"
                  className="rounded-full gap-1"
                  onClick={() => setSelectedLocation(dest.name)}
                >
                  <span className="text-lg">{dest.icon}</span>
                  <span>{dest.name}</span>
                  <span className="text-xs text-muted-foreground">({dest.count})</span>
                </Button>
              ))}
            </div>
          )}
        </DialogHeader>

        {/* Lista de cursos */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Nenhum curso encontrado</p>
              {(searchTerm || selectedLocation) && (
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedLocation("")
                  }}
                  className="mt-2"
                >
                  Limpar todos os filtros
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Indicador de quantidade de resultados */}
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredCourses.length} curso(s) encontrado(s)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredCourses.map((course: CourseType) => {
                  const isSelected = selectedCourse?.id === course.id
                  const isHovered = hoveredCourseId === course.id

                  return (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      whileHover={{ scale: 1.02 }}
                      onMouseEnter={() => setHoveredCourseId(Number(course.id))}
                      onMouseLeave={() => setHoveredCourseId(null)}
                    >
                      <Card
                        className={cn(
                          "cursor-pointer transition-all duration-200 overflow-hidden h-full flex flex-col pt-0",
                          isSelected
                            ? "ring-2 ring-primary shadow-lg"
                            : "hover:shadow-md",
                          isHovered && !isSelected && "border-primary/50"
                        )}
                        onClick={() => setSelectedCourse(course)}
                      >
                        {/* Imagem do curso - agora no topo ocupando 100% width */}
                        <div className="relative w-full h-48 flex-shrink-0 bg-gradient-to-br from-primary/10 to-primary/5">
                          {course.imagem ? (
                            <img
                              src={getImageUrl(String(course.imagem))}
                              alt={course.nome}
                              className="object-cover h-full w-full"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center">
                              <GraduationCap className="h-12 w-12 text-primary/40" />
                              <span className="text-xs text-primary/40 mt-2">Em breve</span>
                            </div>
                          )}
                          
                          {/* Badge de promoção sobre a imagem */}
                          {Number(course.preco) <= 18 && (
                            <div className="absolute top-2 right-2">
                              <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full inline-flex items-center gap-1 shadow-md">
                                <TrendingUp className="h-3 w-3" />
                                Promoção
                              </span>
                            </div>
                          )}
                          
                          {/* Indicador de seleção sobre a imagem */}
                          {isSelected && (
                            <div className="absolute top-2 left-2">
                              <span className="text-xs bg-green-200 text-green-900 px-2 py-1 rounded-full inline-flex items-center gap-1 shadow-md">
                                <Sparkles className="h-3 w-3" />
                                Selecionado
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Conteúdo - agora embaixo */}
                        <CardContent className="p-4 flex-1 flex flex-col">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-semibold text-lg line-clamp-1 flex-1">
                              {course.nome}
                            </h3>
                            {!isSelected && Number(course.preco) <= 18 && (
                              <Star className="h-4 w-4 text-yellow-500 flex-shrink-0 fill-yellow-500" />
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="line-clamp-1">{course.local}</span>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="font-semibold text-green-600">
                              {formatarMoeda(Number(course.preco))}
                            </span>
                          </div>

                          {course.duracao && (
                            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 flex-shrink-0" />
                              <span>{course.duracao}</span>
                            </div>
                          )}

                          {course.descricao && (
                            <p className="text-xs text-muted-foreground line-clamp-3">
                              {course.descricao}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer com botões */}
        <div className="p-6 pt-4 border-t bg-muted/30">
          <div className="flex justify-between items-center">
            {selectedCourse && (
              <div className="text-sm text-muted-foreground">
                Curso selecionado: <span className="font-semibold text-foreground">{selectedCourse.nome} - {formatarMoeda(Number(selectedCourse.preco))}</span>
              </div>
            )}
            <div className="flex gap-3 ml-auto">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSelectCourse}
                disabled={!selectedCourse}
                className="gap-2"
              >
                <GraduationCap className="h-4 w-4" />
                Selecionar Curso
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
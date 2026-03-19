export type Evento = {
	id: number
	nome: string
	descricao: string
	data: string
	local: string
	categoria: string
}

export type ListarEventosResponse = {
	data: Evento[]
	total: number
}

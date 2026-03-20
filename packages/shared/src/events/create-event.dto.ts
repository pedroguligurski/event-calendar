export type EventFormat = 'online' | 'presential' | 'hybrid'
export type EventStatus = 'pending' | 'approved' | 'rejected'

export interface CreateLocationDTO {
	localName: string
	zipCode?: string
	street?: string
	number?: string
	neighborhood?: string
	complement?: string
	city: string
	state: string
	country: string
}

export interface CreateSpeakerDTO {
	name: string
	title?: string
	description?: string
	image?: string
	social?: string
	affiliation?: string
}

export interface CreateEventDTO {
	title: string
	resume?: string
	description?: string
	startDateAndTime: string
	endDateAndTime: string
	eventFormat: EventFormat
	transmissionLink?: string
	ticketPrice?: number
	ticketPlatform?: string
	themeIds: number[]
	location?: CreateLocationDTO
	speakers?: CreateSpeakerDTO[]
}

export interface CreateEventResponse {
	id: number
	title: string
	userId: number
	status: EventStatus
}

export interface EventThemeResponse {
	id: number
	name: string
}

export interface EventLocationResponse {
	localName: string
	zipCode: string | null
	street: string | null
	number: string | null
	neighborhood: string | null
	complement: string | null
	city: string
	state: string
	country: string
}

export interface EventSpeakerResponse {
	id: number
	name: string
	title: string | null
	description: string | null
	image: string | null
	social: string | null
	affiliation: string | null
}

export interface EventListItemResponse {
	id: number
	title: string
	resume: string | null
	startDateAndTime: string
	endDateAndTime: string
	eventFormat: EventFormat
	ticketPrice: number
	status: EventStatus
	themes: EventThemeResponse[]
}

export interface ListEventsResponse {
	events: EventListItemResponse[]
}

export interface EventDetailResponse {
	id: number
	title: string
	resume: string | null
	description: string | null
	startDateAndTime: string
	endDateAndTime: string
	eventFormat: EventFormat
	transmissionLink: string | null
	ticketPrice: number
	ticketPlatform: string | null
	status: EventStatus
	userId: number
	themes: EventThemeResponse[]
	location: EventLocationResponse | null
	speakers: EventSpeakerResponse[]
}

export interface ModerateEventResponse {
	id: number
	status: EventStatus
}
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { randomBytes, scryptSync } from 'node:crypto'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const hashPassword = (password: string): string => {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

async function main() {
  console.log('Limpando o banco de dados...')
  await prisma.speaker.deleteMany()
  await prisma.location.deleteMany()
  await prisma.eventToTheme.deleteMany()
  await prisma.event.deleteMany()
  await prisma.user.deleteMany()
  await prisma.admin.deleteMany()
  await prisma.theme.deleteMany()

  console.log('Criando temas...')
  const tech = await prisma.theme.create({ data: { name: 'Tecnologia' } })
  const design = await prisma.theme.create({ data: { name: 'Design' } })
  const business = await prisma.theme.create({ data: { name: 'Negócios' } })
  const entrepreneurship = await prisma.theme.create({ data: { name: 'Empreendedorismo' } })
  const career = await prisma.theme.create({ data: { name: 'Carreira' } })

  console.log('Criando usuários...')
  const user = await prisma.user.create({
    data: {
      name: 'João',
      surname: 'Silva',
      displayName: 'João Silva Dev',
      email: 'joao.silva@example.com',
      dateOfBirth: new Date('1995-05-15'),
    }
  })

  console.log('Criando administrador padrão...')
  await prisma.admin.create({
    data: {
      name: 'Admin CWB Connect',
      email: 'admin@cwbconnect.local',
      passwordHash: hashPassword('admin123'),
    }
  })

  console.log('Criando eventos de teste...')

  // Evento 1: Dev Summit CWB 2026 (Online)
  await prisma.event.create({
    data: {
      title: 'Dev Summit CWB 2026',
      resume: 'O maior evento de desenvolvimento de Curitiba.',
      description: 'Uma conferência completa com palestras de grandes nomes do mercado sobre IA, Web, Cloud e Arquitetura de Software.',
      eventFormat: 'Online',
      transmissionLink: 'https://youtube.com/c/cwbconnect',
      ticketPrice: 49.90,
      ticketPlatform: 'Sympla',
      startDateAndTime: new Date('2026-08-10T09:00:00Z'),
      endDateAndTime: new Date('2026-08-10T18:00:00Z'),
      userId: user.id,
      status: 'Approved',
      eventToThemes: {
        create: [
          { themeId: tech.id }
        ]
      },
      speakers: {
        create: [
          {
            name: 'Gelson Souza',
            title: 'Principal Architect na TechCorp',
            description: 'Especialista em microsserviços e computação em nuvem.',
            affiliation: 'TechCorp'
          }
        ]
      }
    }
  })

  // Evento 2: Workshop de UX/UI Design (Presencial)
  await prisma.event.create({
    data: {
      title: 'Workshop de UX/UI Design',
      resume: 'Aprenda na prática os fundamentos de design e prototipagem no Figma.',
      description: 'Um dia intenso de atividades práticas criando wireframes, fluxos de usuário e protótipos de alta fidelidade.',
      eventFormat: 'Presential',
      ticketPrice: 120.00,
      ticketPlatform: 'Eventbrite',
      startDateAndTime: new Date('2026-09-05T13:00:00Z'),
      endDateAndTime: new Date('2026-09-05T18:00:00Z'),
      userId: user.id,
      status: 'Approved',
      eventToThemes: {
        create: [
          { themeId: design.id }
        ]
      },
      location: {
        create: {
          localName: 'Espaço Coworking Central',
          zipCode: '80010-000',
          street: 'Rua das Flores',
          number: '123',
          neighborhood: 'Centro',
          city: 'Curitiba',
          state: 'PR',
          country: 'Brasil'
        }
      },
      speakers: {
        create: [
          {
            name: 'Mariana Costa',
            title: 'Senior UX Designer',
            description: 'Apaixonada por design centrado no usuário e pesquisa de usabilidade.',
            affiliation: 'Freelancer'
          }
        ]
      }
    }
  })

  // Evento 3: Startup Weekend Connect (Híbrido)
  await prisma.event.create({
    data: {
      title: 'Startup Weekend Connect',
      resume: 'Crie uma startup viável em apenas 54 horas!',
      description: 'Conecte-se com mentores, desenvolvedores, designers e entusiastas de negócios para transformar ideias em realidade.',
      eventFormat: 'Hybrid',
      transmissionLink: 'https://zoom.us/j/startup-weekend',
      ticketPrice: 0.00,
      startDateAndTime: new Date('2026-10-16T18:00:00Z'),
      endDateAndTime: new Date('2026-10-18T20:00:00Z'),
      userId: user.id,
      status: 'Pending',
      eventToThemes: {
        create: [
          { themeId: entrepreneurship.id },
          { themeId: business.id }
        ]
      },
      location: {
        create: {
          localName: 'Centro de Inovação Digital',
          zipCode: '80230-010',
          street: 'Avenida Sete de Setembro',
          number: '4500',
          neighborhood: 'Batel',
          city: 'Curitiba',
          state: 'PR',
          country: 'Brasil'
        }
      },
      speakers: {
        create: [
          {
            name: 'Roberto Mendes',
            title: 'Sócio Fundador da InovaVentures',
            description: 'Investidor-anjo e mentor de mais de 50 startups no Brasil.',
            affiliation: 'InovaVentures'
          }
        ]
      }
    }
  })

  console.log('Banco de dados populado com sucesso!')
}

main()
  .catch((e) => {
    console.error('Erro ao popular banco de dados:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create persons (actors, directors, music directors)
  const persons = await Promise.all([
    // Bollywood Actors
    prisma.person.create({
      data: { name: 'Shah Rukh Khan', nameHindi: 'शाहरुख खान', bio: 'One of the most successful actors in Indian cinema.' },
    }),
    prisma.person.create({
      data: { name: 'Kajol', nameHindi: 'काजोल', bio: 'Acclaimed Bollywood actress known for her versatile roles.' },
    }),
    prisma.person.create({
      data: { name: 'Aamir Khan', nameHindi: 'आमिर खान', bio: 'Perfectionist actor and producer.' },
    }),
    prisma.person.create({
      data: { name: 'Salman Khan', nameHindi: 'सलमान खान', bio: 'Bollywood superstar and philanthropist.' },
    }),
    // Telugu Actors
    prisma.person.create({
      data: { name: 'Prabhas', bio: 'Telugu superstar known for Bahubali.' },
    }),
    prisma.person.create({
      data: { name: 'Mahesh Babu', bio: 'Telugu cinema prince.' },
    }),
    prisma.person.create({
      data: { name: 'Jr. NTR', bio: 'Versatile Telugu actor.' },
    }),
    prisma.person.create({
      data: { name: 'Ram Charan', bio: 'Telugu mega power star.' },
    }),
    // Directors
    prisma.person.create({
      data: { name: 'Aditya Chopra', bio: 'Bollywood director and producer at Yash Raj Films.' },
    }),
    prisma.person.create({
      data: { name: 'Rajkumar Hirani', bio: 'Director known for socially relevant films.' },
    }),
    prisma.person.create({
      data: { name: 'S.S. Rajamouli', bio: 'Visionary Telugu director of Bahubali and RRR.' },
    }),
    prisma.person.create({
      data: { name: 'Sanjay Leela Bhansali', bio: 'Known for grand visual storytelling.' },
    }),
    // Music Directors
    prisma.person.create({
      data: { name: 'A.R. Rahman', nameHindi: 'ए.आर. रहमान', bio: 'Oscar-winning music composer.' },
    }),
    prisma.person.create({
      data: { name: 'Jatin-Lalit', bio: 'Legendary Bollywood music composer duo.' },
    }),
    prisma.person.create({
      data: { name: 'Pritam', bio: 'Popular Bollywood music director.' },
    }),
    prisma.person.create({
      data: { name: 'M.M. Keeravani', bio: 'Telugu music composer, Oscar winner for RRR.' },
    }),
  ])

  console.log(`Created ${persons.length} persons`)

  // Create movies
  const movies = [
    {
      title: 'Dilwale Dulhania Le Jayenge',
      titleHindi: 'दिलवाले दुल्हनिया ले जाएंगे',
      year: 1995,
      runtime: 189,
      language: 'Hindi',
      industry: 'Bollywood',
      plot: "Raj and Simran meet on a Europe trip and fall in love. But Simran's father has already fixed her marriage.",
      avgRating: 8.1,
      voteCount: 125000,
      cast: [
        { personName: 'Shah Rukh Khan', role: 'lead_actor', character: 'Raj Malhotra' },
        { personName: 'Kajol', role: 'lead_actor', character: 'Simran Singh' },
        { personName: 'Aditya Chopra', role: 'director' },
        { personName: 'Jatin-Lalit', role: 'music_director' },
      ],
    },
    {
      title: '3 Idiots',
      titleHindi: '३ इडियट्स',
      year: 2009,
      runtime: 170,
      language: 'Hindi',
      industry: 'Bollywood',
      plot: 'Two friends search for their long-lost companion who inspired them to think differently.',
      avgRating: 8.4,
      voteCount: 200000,
      cast: [
        { personName: 'Aamir Khan', role: 'lead_actor', character: 'Rancho' },
        { personName: 'Rajkumar Hirani', role: 'director' },
      ],
    },
    {
      title: 'Bahubali: The Beginning',
      titleHindi: 'बाहुबली',
      year: 2015,
      runtime: 159,
      language: 'Telugu',
      industry: 'Tollywood',
      plot: 'An adventurer discovers his royal lineage while searching for his destiny.',
      avgRating: 8.0,
      voteCount: 180000,
      cast: [
        { personName: 'Prabhas', role: 'lead_actor', character: 'Bahubali' },
        { personName: 'S.S. Rajamouli', role: 'director' },
        { personName: 'M.M. Keeravani', role: 'music_director' },
      ],
    },
    {
      title: 'RRR',
      year: 2022,
      runtime: 187,
      language: 'Telugu',
      industry: 'Tollywood',
      plot: 'A fictional story about two legendary revolutionaries and their journey away from home.',
      avgRating: 8.0,
      voteCount: 250000,
      cast: [
        { personName: 'Jr. NTR', role: 'lead_actor', character: 'Komaram Bheem' },
        { personName: 'Ram Charan', role: 'lead_actor', character: 'Alluri Sitarama Raju' },
        { personName: 'S.S. Rajamouli', role: 'director' },
        { personName: 'M.M. Keeravani', role: 'music_director' },
      ],
    },
    {
      title: 'Roja',
      year: 1992,
      runtime: 137,
      language: 'Tamil',
      industry: 'Kollywood',
      plot: 'A woman fights for her husband who is kidnapped by militants in Kashmir.',
      avgRating: 8.0,
      voteCount: 50000,
      cast: [
        { personName: 'A.R. Rahman', role: 'music_director' },
      ],
    },
    {
      title: 'Padmaavat',
      titleHindi: 'पद्मावत',
      year: 2018,
      runtime: 164,
      language: 'Hindi',
      industry: 'Bollywood',
      plot: 'The story of Rani Padmavati, the wife of Maharawal Ratan Singh.',
      avgRating: 7.0,
      voteCount: 120000,
      cast: [
        { personName: 'Sanjay Leela Bhansali', role: 'director' },
      ],
    },
    {
      title: 'Kuch Kuch Hota Hai',
      titleHindi: 'कुछ कुछ होता है',
      year: 1998,
      runtime: 185,
      language: 'Hindi',
      industry: 'Bollywood',
      plot: 'Two college friends reunite years later, rekindling old feelings.',
      avgRating: 7.6,
      voteCount: 95000,
      cast: [
        { personName: 'Shah Rukh Khan', role: 'lead_actor', character: 'Rahul Khanna' },
        { personName: 'Kajol', role: 'lead_actor', character: 'Anjali Sharma' },
        { personName: 'Jatin-Lalit', role: 'music_director' },
      ],
    },
    {
      title: 'PK',
      year: 2014,
      runtime: 153,
      language: 'Hindi',
      industry: 'Bollywood',
      plot: 'An alien on Earth loses his remote and questions religious dogmas.',
      avgRating: 8.1,
      voteCount: 150000,
      cast: [
        { personName: 'Aamir Khan', role: 'lead_actor', character: 'PK' },
        { personName: 'Rajkumar Hirani', role: 'director' },
      ],
    },
  ]

  for (const movieData of movies) {
    const { cast, ...movieInfo } = movieData
    const movie = await prisma.movie.create({ data: movieInfo })

    for (const castMember of cast) {
      const person = persons.find((p) => p.name === castMember.personName)
      if (person) {
        await prisma.moviePerson.create({
          data: {
            movieId: movie.id,
            personId: person.id,
            role: castMember.role,
            characterName: castMember.character,
          },
        })
      }
    }
    console.log(`Created movie: ${movie.title}`)
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

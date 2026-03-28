// Prisma returns camelCase field names. The useJobs composable maps
// companyName -> company, isRemote -> remote, etc. for the UI.
export const mockJobs = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    title: 'Senior Product Designer',
    companyName: 'Figma',
    companyLogo: null,
    location: 'San Francisco, CA',
    isRemote: true,
    salaryMin: 120000,
    salaryMax: 180000,
    salaryCurrency: 'USD',
    tags: ['UI', 'UX', 'Figma', 'Design Systems'],
    description: 'We are looking for a Senior Product Designer to join our team and help shape the future of design tools.',
    status: 'published',
    userId: null,
    createdAt: new Date().toISOString()
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    title: 'Motion Graphics Artist',
    companyName: 'Netflix',
    companyLogo: null,
    location: 'Los Angeles, CA',
    isRemote: false,
    salaryMin: 90000,
    salaryMax: 140000,
    salaryCurrency: 'USD',
    tags: ['After Effects', 'Cinema 4D', 'Animation'],
    description: 'Join our creative team to produce stunning motion graphics for original series marketing campaigns.',
    status: 'published',
    userId: null,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    title: 'Illustrator',
    companyName: 'Dropbox',
    companyLogo: null,
    location: 'Remote',
    isRemote: true,
    salaryMin: 80000,
    salaryMax: 120000,
    salaryCurrency: 'USD',
    tags: ['Illustration', 'Procreate', 'Brand'],
    description: 'Create beautiful illustrations that bring our brand to life across web, mobile, and print.',
    status: 'published',
    userId: null,
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
]

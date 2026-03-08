import { ref } from 'vue'

export interface Job {
    id: string;
    title: string;
    company: string;
    logo: string;
    location: string;
    remote: boolean;
    salaryMin: number;
    salaryMax: number;
    salaryCurrency: string;
    tags: string[];
    description: string;
    createdAt: string;
}

export const useJobs = () => {
    const getJobs = async (): Promise<Job[]> => {
        try {
            // Fetch dynamically from our robust Prisma ORM Nuxt API
            const data: any = await $fetch('/api/jobs');

            return data && data.length > 0 ? data.map((job: any) => ({
                id: job.id,
                title: job.title,
                company: job.companyName,
                logo: job.companyLogo || '',
                location: job.location,
                remote: job.isRemote,
                salaryMin: job.salaryMin,
                salaryMax: job.salaryMax,
                salaryCurrency: job.salaryCurrency || 'USD',
                tags: job.tags || [],
                description: job.description,
                createdAt: job.createdAt
            })) : [];
        } catch (e) {
            console.error('Error fetching jobs:', e);
            return [];
        }
    };

    const getJobById = async (id: string): Promise<Job | null> => {
        try {
            const data: any = await $fetch(`/api/jobs/${id}`);

            if (!data) return null;

            return {
                id: data.id,
                title: data.title,
                company: data.companyName,
                logo: data.companyLogo || '',
                location: data.location,
                remote: data.isRemote,
                salaryMin: data.salaryMin,
                salaryMax: data.salaryMax,
                salaryCurrency: data.salaryCurrency || 'USD',
                tags: data.tags || [],
                description: data.description,
                createdAt: data.createdAt
            };
        } catch (e) {
            console.error('Error fetching job by ID:', e);
            return null;
        }
    };

    return {
        getJobs,
        getJobById
    }
}

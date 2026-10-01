import { createMetadata } from '@/lib/metadata'
import OneObjectExperience from "./OneObjectExperience";

export const metadata = createMetadata({
  title: 'One Object From Every Country',
  description: 'Explore the world through one iconic object from every country.',
  url: '/one-object',
})

export default function OneObjectPage() {
  return <OneObjectExperience />;
}

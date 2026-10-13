export interface WorkListItem {
  name: string
  meta?: string
  tags?: string[]
  link?: string
  slug?: string
}

export interface WorkGroup {
  heading: string
  items: string[]
}

export interface WorkSection {
  id: string
  no: string
  title: string
  tagline: string
  items?: WorkListItem[]
  groups?: WorkGroup[]
  awards?: string[]
  footer?: string
}

export interface WorksLang {
  title: string
  closeLabel: string
  openLabel: string
  hint: string
  awardsLabel: string
  visitLabel: string
  detailPlaceholder: string
  phImageLabel: string
  phButtonLabel: string
  countLabel: (n: number) => string
  sections: WorkSection[]
}


const data: WorksLang = {...{"title": "Selected work", "closeLabel": "Back to work", "openLabel": "Explore project", "hint": "Keep exploring", "awardsLabel": "Awards", "visitLabel": "Visit project", "detailPlaceholder": "Project details", "phImageLabel": "Interactive narrative / MFA", "phButtonLabel": "Open project", "sections": [{"id": "product", "no": "01", "title": "Product experiences", "tagline": "From questions to useful experiences", "items": [{"name": "ReNewPath", "meta": "UI/UX · Service design", "slug": "renewpath"}, {"name": "Mirage Gazer", "meta": "Speculative design · Future experiences", "slug": "mirage"}]}, {"id": "immersive", "no": "02", "title": "Immersive stories", "tagline": "Step into a story", "items": [{"name": "Through the Fading Light", "meta": "VR · Perception", "slug": "fading-light"}, {"name": "The Last Bloom", "meta": "MFA Year 1 · Semester 2 · Major Studio", "slug": "last-bloom"}, {"name": "Ascending", "meta": "Game interaction · Spatial narrative", "slug": "ascending"}]}, {"id": "physical", "no": "03", "title": "Physical interaction", "tagline": "Bring the body into the experience", "items": [{"name": "This Little Fish Cares", "meta": "Exhibition · Ecological storytelling", "slug": "coral"}, {"name": "Heart Hourglass", "meta": "MFA Year 1 · Semester 1 · Major Studio", "slug": "heart-hourglass"}]}, {"id": "play", "no": "04", "title": "Play & experiments", "tagline": "Make meaning through play", "items": [{"name": "La Belle Vendetta", "meta": "Digital game · Interactive narrative", "slug": "other"}, {"name": "Algorithmic Odyssey", "meta": "Board game · Algorithmic bias", "slug": "algorithmic-odyssey"}]}]},countLabel: (n:number)=>`${n} projects`};
export const WORKS = {zh:data,en:data};
export const SECTION_COVERS: Record<string,string> = {"product": "/assets/work5-1.jpg", "immersive": "/assets/work4-1.jpg", "physical": "/assets/work2-1.jpg", "play": "/assets/work0-2.jpg"};
export function sectionCount(section:WorkSection):number{return section.items?.length || 0}

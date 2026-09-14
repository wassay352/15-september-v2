export interface GalleryItem {
  id: string
  type: 'photo' | 'video'
  src: string
  poster?: string
  date?: string
  title?: string
  caption?: string
}

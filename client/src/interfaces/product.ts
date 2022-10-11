interface Image {
  public_id: string
  url: string
}
export interface Review {
  _id: string
  user: string
  name: string
  rating: number
  comment: string
}
export interface Product {
  _id: string
  name: string
  price: number
  description: string
  ratings: number
  images: Image[]
  category: string
  seller: string
  stock: number
  numOfReviews: number
  reviews: Review[]
  user: string
}

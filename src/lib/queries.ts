import { groq } from 'next-sanity'

export const PHOTO_COUNT_QUERY = groq`
  count(*[_type == "photo"])
`

export const PHOTO_BY_INDEX_QUERY = groq`
  *[_type == "photo"] | order(_createdAt) [$index] {
    _id,
    title,
    image {
      ...,
      asset-> {
        ...,
        metadata {
          dimensions
        }
      }
    },
    alt,
    description
  }
`
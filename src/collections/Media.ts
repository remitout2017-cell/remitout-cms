import type { CollectionConfig } from 'payload'
import { getS3Url } from '../utils/s3Url'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: true,
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'url', // store the full S3 URL
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (data.filename) {
          data.url = getS3Url(data.filename) // populate full S3 URL before saving
        }
        return data
      },
    ],
    // ✅ ADD THIS: Generate S3 URL when reading (for old images)
    afterRead: [
      async ({ doc }) => {
        if (doc.filename) {
          doc.url = getS3Url(doc.filename) // generate S3 URL on-the-fly
        }
        return doc
      },
    ],
  },
}

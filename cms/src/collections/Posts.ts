import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'discoverable',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      admin: {
        description: 'Controls if this post will display on the learn page explorer.',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
    },
    {
      name: 'keywords',
      type: 'array',
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description:
          'Used inside the JSON-LD schema for SEO purposes. The following keywords are always included so dont need to add here: "Nouns DAO", "Nouns NFT", "web3", "Crypto"',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description:
          'The posts main image, this appears below the title, and also used as the thumbnail in the explorer.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
  ],
  hooks: {
    afterChange: [
      async (args) => {
        try {
          // Force web app to revalidate since we changed the posts
          await fetch('https://nounswap.wtf/api/revalidate/posts')
        } catch (e) {
          console.error('Error revalidating posts', e)
        }
      },
    ],
  },
}

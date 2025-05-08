import type { PageOptions } from '@graphcommerce/framer-next-pages'
import { StoreConfigDocument } from '@graphcommerce/magento-store'
import {
  type GetStaticProps,
  LayoutOverlayHeader,
  LayoutTitle,
  PageMeta,
  FullPageMessage,
} from '@graphcommerce/next-ui'
import { LayoutDocument, LayoutNavigation, type LayoutNavigationProps } from '../../components'
import { graphqlSsrClient, graphqlSharedClient } from '../../lib/graphql/graphqlSsrClient'
import { gql } from '@graphcommerce/graphql'
import { Container } from '@mui/material'
import { useEffect, useState } from 'react'

// Type definition for the getStaticProps function that extends GetStaticProps
// with LayoutNavigationProps and optional CmsPageProps
type GetPageStaticProps = GetStaticProps<LayoutNavigationProps & { cmsPage?: CmsPageProps }>

// Interface definition for CMS page data structure
type CmsPageProps = {
  title: string                  // Page title
  content: string                // HTML content of the page
  meta_title?: string | null     // Optional SEO meta title
  meta_description?: string | null // Optional SEO meta description
}

// GraphQL query to fetch CMS page data from Magento
// Takes an identifier parameter to fetch the specific page
const CmsPageQuery = gql`
  query CmsPageQuery($identifier: String!) {
    cmsPage(identifier: $identifier) {
      __typename
      title
      content
      meta_title
      meta_description
      identifier
    }
  }
`

/**
 * AboutUs component that renders the About Us page content fetched from Magento CMS
 * @param props - Component properties including layout navigation and CMS page data
 */
function AboutUs(props: LayoutNavigationProps & { cmsPage?: CmsPageProps }) {
  const { cmsPage } = props
  // State to store the plain text content extracted from HTML
  const [textContent, setTextContent] = useState('')

  // Extract plain text from HTML content when cmsPage.content changes
  useEffect(() => {
    if (cmsPage?.content) {
      // Create a temporary div element to parse HTML content
      const div = document.createElement('div')
      div.innerHTML = cmsPage.content
      // Extract text content and remove extra whitespace
      setTextContent(div.textContent?.trim() ?? '')
    }
  }, [cmsPage?.content])

  // Display an error message if CMS page data is not available
  if (!cmsPage) {
    return (
      <FullPageMessage
        title="Content not found"
        message="The about us page content could not be loaded from Magento"
      />
    )
  }

  // Render the About Us page with CMS content
  return (
    <>
      {/* Set page metadata for SEO */}
      <PageMeta
        title={cmsPage.meta_title ?? cmsPage.title}
        metaDescription={cmsPage.meta_description ?? ''}
      />

      {/* Header for the overlay layout with a smaller title */}
      <LayoutOverlayHeader>
        <LayoutTitle size="small" component="span">
          {cmsPage.title}
        </LayoutTitle>
      </LayoutOverlayHeader>

      {/* Main page title */}
      <LayoutTitle>{cmsPage.title}</LayoutTitle>

      {/* Container for the CMS content */}
      <Container maxWidth="lg" className="cmsContentContainer">
        <div className="cmsContent">
          {/* Show extracted text content or loading message */}
          {textContent}
        </div>
      </Container>
    </>
  )
}

// Configure page options for Next.js
const pageOptions: PageOptions<LayoutNavigationProps> = {
  Layout: LayoutNavigation,  // Specify the layout component to use
  sharedKey: () => 'about-us', // Unique key for page caching and identification
}
AboutUs.pageOptions = pageOptions

export default AboutUs

/**
 * getStaticProps function for Next.js Static Site Generation (SSG)
 * Fetches data at build time and passes it to the page component
 */
export const getStaticProps: GetPageStaticProps = async (context) => {
  // Initialize GraphQL clients
  const client = graphqlSharedClient(context)        // For shared data across pages
  const staticClient = graphqlSsrClient(context)     // For SSR-specific queries

  try {
    // Prepare GraphQL queries to fetch all required data
    const conf = client.query({ query: StoreConfigDocument })  // Store configuration
    const layout = staticClient.query({
      query: LayoutDocument,
      fetchPolicy: 'cache-first',  // Use cache if available
    })

    // Fetch CMS page content with the "about-us" identifier
    const cms = staticClient.query({
      query: CmsPageQuery,
      variables: { identifier: 'about-us' },
      fetchPolicy: 'cache-first',
    })

    // Execute all queries in parallel
    const [layoutResult, cmsResult] = await Promise.all([layout, cms, conf])

    // Return 404 if CMS page is not found
    if (!cmsResult.data?.cmsPage) {
      console.error('CMS page not found in Magento')
      return { notFound: true }
    }

    // Return props for the page component
    return {
      props: {
        ...layoutResult.data,               // Layout data
        cmsPage: cmsResult.data.cmsPage,    // CMS page content
        apolloState: client.cache.extract(), // Apollo cache for client-side hydration
      },
      revalidate: 60 * 20,  // Revalidate content every 20 minutes (ISR)
    }
  } catch (error) {
    // Handle errors by showing 404 page
    console.error('Error fetching data for About Us page:', error)
    return { notFound: true }
  }
}
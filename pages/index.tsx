import type { PageOptions } from '@graphcommerce/framer-next-pages'
import { cacheFirst } from '@graphcommerce/graphql'
import {
  ProductListDocument,
  ProductListQuery,
  ProductPageName,
} from '@graphcommerce/magento-product'
import { StoreConfigDocument } from '@graphcommerce/magento-store'
import type { GetStaticProps } from '@graphcommerce/next-ui'
import {
  HeroBanner,
  LayoutHeader,
  LayoutTitle,
  MetaRobots,
  PageMeta,
  breakpointVal,
} from '@graphcommerce/next-ui'
import { Button, Container, Typography } from '@mui/material'
import type { LayoutNavigationProps } from '../components'
import { LayoutDocument, LayoutNavigation } from '../components'
import { graphqlSharedClient, graphqlSsrClient } from '../lib/graphql/graphqlSsrClient'
import AdvertGrid from '../components/AdvertGrid/AdvertGrid'

type Props = {}
type RouteProps = { url: string }
type GetPageStaticProps = GetStaticProps<LayoutNavigationProps, Props, RouteProps>

function CmsPage(props: Props) {
  const {} = props

  return (
    <>
      {/* <PageMeta
      title={page?.metaTitle ?? page?.title ?? ''}
      metaDescription={page?.metaDescription ?? ''}
      metaRobots={page?.metaRobots.toLowerCase().split('_') as MetaRobots[] | undefined}
      canonical='/'
    /> */}

      <LayoutHeader floatingMd hideMd={import.meta.graphCommerce.breadcrumbs}>
        <LayoutTitle size='small' component='span'>
          Home
        </LayoutTitle>
      </LayoutHeader>

      <LayoutHeader floatingMd floatingSm />

      <HeroBanner
        pageLinks={
          <Button href='/what-is-new' variant='outlined' size='large' color='inherit' sx={{ mr: 2 }}>
            Gear up now
          </Button>
        }
        videoSrc='/home-promo.mp4'
        sx={(theme) => ({
          '& .HeroBanner-copy': {
            minHeight: { xs: 'min(80vh,600px)', md: 'min(80vh,1080px)' },
            [theme.breakpoints.up('sm')]: {
              padding: theme.spacings.xl,
              justifyItems: 'start',
              alignContent: 'center',
              textAlign: 'left',
              width: '50%',
            },
          },
        })}
      >
        {/*<Typography variant='overline' gutterBottom>
          A journey through creativity
        </Typography>*/}
        <Typography
          variant='h1'
          sx={(theme) => ({
            textTransform: 'uppercase',
            mt: 1,
            mb: theme.spacings.sm,
            ...breakpointVal('fontSize', 36, 82, theme.breakpoints.values),
            '& strong': {
              WebkitTextFillColor: 'transparent',
              WebkitTextStroke: '1.2px #fff',
            },
          })}
        >
          <strong>Chase limits</strong> own the look
        </Typography>

      </HeroBanner>

      <Typography
        variant="h2"
        gutterBottom
        sx={{
          textAlign: 'center',
          textTransform: 'capitalize',
          fontSize: { xs: 22, md: 42 },
          marginTop: { xs: -4, md: -8 },
        }}
      >
        Level up your fit
      </Typography>

      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <AdvertGrid />
      </Container>
    </>
  )
}

CmsPage.pageOptions = {
  Layout: LayoutNavigation,
} as PageOptions

export default CmsPage

export const getStaticProps: GetPageStaticProps = async (context) => {
  const client = graphqlSharedClient(context)
  const staticClient = graphqlSsrClient(context)

  const conf = client.query({ query: StoreConfigDocument })
  const layout = staticClient.query({
    query: LayoutDocument,
    fetchPolicy: cacheFirst(staticClient),
  })

  return {
    props: {
      ...(await layout).data,
      apolloState: await conf.then(() => client.cache.extract()),
    },
    revalidate: 60 * 20,
  }
}

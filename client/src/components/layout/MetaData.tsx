import Helmet from 'react-helmet'

interface Props {
  title: string
}

export const MetaData: React.FC<Props> = ({ title }) => {
  return (
    <Helmet>
      <title>{`${title} - Shope`}</title>
    </Helmet>
  )
}

import prisma from '../lib/prisma'
import queryGraphql from '../shared/query-graphql'

export default function UserProfile({ user }) {
  if (!user) {
    return <h1>User Not Found</h1>
  }
  return (
    <h1>
      {user.name} is {user.name}
    </h1>
  )
}

export async function getStaticProps(context) {
  const { params } = context
  const { username } = params
  const user = await prisma.user.findFirst({ where: { name: username } })
  return { props: { user } }
}

export async function getStaticPaths() {
  const users = await prisma.user.findMany()
  return {
    paths: users.map(({ name }) => ({
      params: { username: name },
    })),
    fallback: true,
  }
}

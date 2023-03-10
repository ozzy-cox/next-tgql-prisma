import Link from 'next/link'
import prisma from '../lib/prisma'

export default function UserListing({ users }) {
  return (
    <div>
      <h1>User Listing</h1>
      <ul>
        {users.map((user) => (
          <li key={user.username}>
            <Link href="/[username]" as={`/${user.name}`}>
              {user.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export async function getStaticProps() {
  const users = await prisma.user.findMany()
  return { props: { users } }
}

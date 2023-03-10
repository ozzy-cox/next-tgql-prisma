import { dehydrate, useQuery } from "react-query";
import { queryClient, SDK } from "../src/api";


export async function getServerSideProps() {

    await queryClient.prefetchQuery("users", () => SDK.getAllUsers())

    return {
        props: {
            dehydratedState: dehydrate(queryClient)
        }
    }
}

export default function MainPageLayout() {
    const { data } = useQuery(['users'], () => SDK.getAllUsers())
    return <div>{JSON.stringify(data)}</div>
}
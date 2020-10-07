import { GetServerSideProps } from 'next'
import React from 'react'
import ConsoleLayout from '../../../components/ConsoleLayout'
import fetcher from '../../../lib/SSRQueryFetcher'

const ItemDetail = () => {
    return (
        <ConsoleLayout>
            <div>ItemDetail</div>
        </ConsoleLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const initialApolloState = await fetcher(context, [])
    return { props: { initialApolloState } }
}


export default ItemDetail

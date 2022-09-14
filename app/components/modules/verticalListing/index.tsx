import React from 'react'
import ProductListing from "@template/productListing";
import ServiceListing from "@template/serviceListing";
import { SERVICE, PRODUCT } from '@constant/types';
import { useSelector } from 'react-redux';

function VerticalListing({ type, itemsList }) {
    const { keywords } = useSelector(state => state.store ? state.store.storeData : null);
    return (
        <>
            {type === keywords[PRODUCT] && <ProductListing productsList={itemsList} />}
            {type === keywords[SERVICE] && <ServiceListing servicesList={itemsList} />}
        </>
    )
}

export default VerticalListing

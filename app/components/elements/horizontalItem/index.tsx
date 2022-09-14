/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react'
import Link from 'next/link';
import HorizontalProductCard from '@module/horizontalProductCard';
import router from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { updatePdpItem } from '@context/actions';
import { PRODUCT, SERVICE } from '@constant/types';

function MdNavigateNext(props) {
    return <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" height="1em" width="1em" {...props}><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" /></svg>;
}

function Item({ item, config, type = '' }) {
    const { configData, keywords } = useSelector(state => state.store ? state.store.storeData : null);
    const dispatch = useDispatch();
    const baseRouteUrl = useSelector(state => state.store.baseRouteUrl);
    let openPdp = false;
    if (item.type == keywords[SERVICE]) {
        openPdp = configData.showServicesPdp;
    } else if (item.type == keywords[PRODUCT]) {
        openPdp = configData.showProductPdp;
    }
    if (item?.showOnUi) {
        let itemUrl = item.itemUrl;
        if (!itemUrl) {
            itemUrl = item.name.toLowerCase().split(" ").join("-") + '-pdp';
            itemUrl = ('pagepath' in router.query) ? router.query.pagepath && [0] + "/" + itemUrl : `/${itemUrl}`;
        }
        let price = item.price;
        let salePrice = item.salePrice;
        if (item.variations && item.variations.length != 0) {
            if (item.variations[0].variations && item.variations[0].variations.length != 0) {
                if (item.variations[0].variations[0].variations && item.variations[0].variations[0].variations.length != 0) {
                    if (item.variations[0].variations[0].variations[0].variations && item.variations[0].variations[0].variations[0].variations.length != 0) {
                        price = item.variations[0].variations[0].variations[0].variations[0].price;
                        salePrice = item.variations[0].variations[0].variations[0].variations[0].salePrice;
                    } else {
                        price = item.variations[0].variations[0].variations[0].price;
                        salePrice = item.variations[0].variations[0].variations[0].salePrice;
                    }
                } else {
                    price = item.variations[0].variations[0].price;
                    salePrice = item.variations[0].variations[0].salePrice;
                }
            } else {
                price = item.variations[0].price;
                salePrice = item.variations[0].salePrice;
            }
        }

        const onClickItem = (item: any) => {
            if (openPdp) {
                dispatch(updatePdpItem(item));
            }
        }
        // console.log("item.type?.toLowerCase()", item.type?.toLowerCase())
        // console.log("keywords[PRODUCT]", keywords[PRODUCT])
        // console.log("item.type?.toLowerCase() == keywords[PRODUCT]", item.type?.toLowerCase() == keywords[PRODUCT])

        if (item.type == keywords[SERVICE] || type == keywords[SERVICE]) {
            return (
                <>
                    {config.redirection ? <Link href={baseRouteUrl + itemUrl} shallow={true}>
                        <div className="service-cover">
                            <div className="service-name">{item.name} {item.discount ? <span className='item-discount-value'>({item.discount}% off)</span> : null}</div>
                            <div className="service-price">
                                <>
                                    {salePrice == 0 ?
                                        <div className="prod-sale-price">
                                            {configData.currencySymbol} {price}
                                        </div> :
                                        <div className="prod-sale-price">
                                            <span>{configData.currencySymbol} {price} </span>
                                            {configData.currencySymbol} {salePrice}
                                        </div>
                                    }
                                </>
                            </div>
                            {item.iTag ? <div className="service-arrow-icon onward">(On.)</div> :
                                <div className="service-arrow-icon">
                                    <MdNavigateNext />
                                </div>}
                        </div>
                    </Link> :
                        <div className="service-cover" onClick={() => onClickItem(item)}>
                            <div className="service-name">{item.name} {item.discount ? <span className='item-discount-value'>({item.discount}% off)</span> : null}</div>
                            <div className="service-price">
                                <>
                                    {salePrice == 0 ?
                                        <div className="prod-sale-price">
                                            {configData.currencySymbol} {price}
                                        </div> :
                                        <div className="prod-sale-price">
                                            <span>{configData.currencySymbol} {price}</span>
                                            {configData.currencySymbol} {salePrice}
                                        </div>
                                    }
                                </>
                            </div>
                            {item.iTag ? <div className="service-arrow-icon onward">(On.)</div> :
                                <div className="service-arrow-icon">
                                    <MdNavigateNext />
                                </div>}
                        </div>
                    }
                </>
            )
        } else if (item.type == keywords[PRODUCT] || type == keywords[PRODUCT]) {
            return <HorizontalProductCard item={item} handleClick={() => { }} config={config} />
        } else return null;
    } else return null;
}

export default Item

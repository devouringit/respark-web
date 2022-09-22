import React from 'react'
import { PRODUCT_LIST_NO_IMAGE } from "@constant/noImage";
import { useSelector, useDispatch } from 'react-redux';
import { showSuccess, updatePdpItem } from '@context/actions';
import { replaceOrderIitems } from '@context/actions/order';
import { SERVICE, PRODUCT } from '@constant/types';

const HorizontalProductCard = ({ item, handleClick, fromPage = '', config }) => {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.order.orderItems);
    const { configData, keywords } = useSelector(state => state.store ? state.store.storeData : null);
    let openPdp = false;
    if (item.type == SERVICE) {
        openPdp = configData.showServicesPdp;
    } else if (item.type == keywords[PRODUCT]) {
        openPdp = configData.showProductPdp;
    }
    const addQuantity = () => {
        const cartItemsCopy = cartItems ? [...cartItems] : [];
        const itemIndex: number = cartItemsCopy.findIndex((cartItem) => (cartItem.name == item.name && cartItem.categoryName == item.categoryName) && ((cartItem.variations) ? (cartItem.variations[0].name == item.variations[0].name) : true));
        cartItemsCopy[itemIndex].quantity = cartItemsCopy[itemIndex].quantity + 1;
        dispatch(replaceOrderIitems(cartItemsCopy));
        dispatch(showSuccess('Product Added', 2000));
    }

    const removeQuantity = () => {
        const cartItemsCopy = cartItems ? [...cartItems] : [];
        if (item.quantity == 1) {
            const itemIndex: number = cartItemsCopy.findIndex((cartItem) => (cartItem.name == item.name && cartItem.categoryName == item.categoryName) && ((cartItem.variations) ? (cartItem.variations[0].name == item.variations[0].name) : true));
            cartItemsCopy.splice(itemIndex, 1);
            dispatch(replaceOrderIitems(cartItemsCopy));
        } else {
            const itemIndex: number = cartItemsCopy.findIndex((cartItem) => (cartItem.name == item.name && cartItem.categoryName == item.categoryName) && ((cartItem.variations) ? (cartItem.variations[0].name == item.variations[0].name) : true));
            cartItemsCopy[itemIndex].quantity = cartItemsCopy[itemIndex].quantity - 1;
            dispatch(replaceOrderIitems(cartItemsCopy));
        }
        dispatch(showSuccess('Product Removed', 2000));
    }
    let itemImageUrl = PRODUCT_LIST_NO_IMAGE;
    if (item.imagePaths && item.imagePaths?.length != 0) {
        let activeImages = item.imagePaths.filter((i: any) => !i.deleted)
        itemImageUrl = activeImages?.length != 0 ? activeImages[0].imagePath : PRODUCT_LIST_NO_IMAGE;
    }

    const onClickItem = (item: any) => {
        if (openPdp && fromPage !== 'cart') {
            dispatch(updatePdpItem(item));
        }
    }
    if (item.showOnUi || fromPage == 'cart') {
        return (
            <div className="horizontal-product-card-wrap">
                <div className="product-list-cover-wrap">
                    <div className="product-cover clearfix" onClick={() => onClickItem(item)}>
                        {item.iTag && <div className="ribbon ribbon-top-right"><span>{item.iTag}</span></div>}
                        <div className="prod-left">
                            <div className="prod-img-cover">
                                <img src={itemImageUrl} alt={item.name} />
                            </div>
                        </div>
                        <div className="prod-right">
                            <div className="prod-name">
                                {item.name}  {item.discount ? <span className='item-discount-value'>({item.discount}% off)</span> : null}
                                {fromPage == 'cart' && item.variations && <>

                                    <span>{item.variations[0].name}</span>
                                </>}
                            </div>
                            {item.description && <div className="prod-desc">
                                {(item.description.split("||")).join(" ")}
                            </div>}
                            {!fromPage ?
                                <div className="prod-sizeprice">
                                    {item.variations && item.variations.length != 0 ? <>
                                        <div className="prod-size">
                                            <span>{item.variations[0].name}</span>
                                        </div>
                                        <div className="prod-sale-price">
                                            {item.variations[0].salePrice != 0 ?
                                                <>
                                                    <span>{configData.currencySymbol} {item.variations[0].price}</span>
                                                    <> {configData.currencySymbol} {item.variations[0].salePrice}</>
                                                </>
                                                :
                                                <>{configData.currencySymbol} {item.variations[0].price} </>
                                            }
                                        </div>
                                    </> :
                                        <>
                                            {item.salePrice == 0 ?
                                                <div className="prod-sale-price">
                                                    {configData.currencySymbol} {item.price}
                                                </div> :
                                                <div className="prod-sale-price">
                                                    <span>{configData.currencySymbol} {item.price}</span>
                                                    {configData.currencySymbol} {item.salePrice}
                                                </div>
                                            }
                                        </>
                                    }
                                </div>
                                :
                                <div className="quantity-price-wrap clearfix">
                                    <div className="price-wrap clearfix">
                                        <div className="prod-sale-price">
                                            <>
                                                {item.salePrice == 0 ?
                                                    <div className="prod-sale-price">
                                                        {configData.currencySymbol} {item.price * item.quantity}
                                                    </div> :
                                                    <div className="prod-sale-price">
                                                        {/* <span>{configData.currencySymbol} {item.price * item.quantity}</span> */}
                                                        {configData.currencySymbol} {item.salePrice * item.quantity}
                                                    </div>
                                                }
                                            </>
                                        </div>
                                    </div>
                                    <div className="itemcounterinner">
                                        <div className="counterbuttons">
                                            <button className="countclick" onClick={() => removeQuantity()}>-</button>
                                            <div className="countnum">
                                                {item.quantity}
                                            </div>
                                            <button className="countclick" onClick={() => addQuantity()}>+</button>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    } else return null;
}

export default HorizontalProductCard

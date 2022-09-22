/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { syncLocalStorageOrder } from "app/redux/actions/order";
import { windowRef } from '@util/window';
import { showError, updatePdpItem, updateSearchStatus } from 'app/redux/actions';
import router from "next/router";
import { useCookies } from "react-cookie";
import HorizontalProductCard from '@module/horizontalProductCard';
import { updateUserData } from '@context/actions/user';
import ConfirmationModal from '@module/confirmationModal';
import UserRegistrationModal from '@module/userRegistration';
import Backdrop from '@material-ui/core/Backdrop';
import SvgIcon from '@element/svgIcon';

function BiArrowBack(props) {
    return <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" height="1em" width="1em" {...props}><path d="M21 11L6.414 11 11.707 5.707 10.293 4.293 2.586 12 10.293 19.707 11.707 18.293 6.414 13 21 13z" /></svg>;
}

function GrFormNextLink(props) {
    return <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 512 512" height="1em" width="1em" {...props}><path d="M295.6 163.7c-5.1 5-5.1 13.3-.1 18.4l60.8 60.9H124.9c-7.1 0-12.9 5.8-12.9 13s5.8 13 12.9 13h231.3l-60.8 60.9c-5 5.1-4.9 13.3.1 18.4 5.1 5 13.2 5 18.3-.1l82.4-83c1.1-1.2 2-2.5 2.7-4.1.7-1.6 1-3.3 1-5 0-3.4-1.3-6.6-3.7-9.1l-82.4-83c-4.9-5.2-13.1-5.3-18.2-.3z" /></svg>;
}

function CartPage() {
    const [pricingBreakdown, setpricingBreakdown] = useState({ total: 0, subTotal: 0, appliedTaxes: [] });
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.order.orderItems);
    const store = useSelector(state => state.store);
    const baseRouteUrl = useSelector(state => state.store.baseRouteUrl);
    const activeGroup = useSelector(state => state.activeGroup);
    const [cookie, setCookie] = useCookies();
    const [userData, setUserCookie] = useState(cookie['user']);
    const [orderInstruction, setOrderInstruction] = useState('')
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const { configData } = useSelector(state => state.store ? state.store.storeData : null);
    const [showOrderingOff, setShowOrderingOff] = useState(false);
    const [showTotalBreakdownPopup, setShowTotalBreakdownPopup] = useState(false);

    useEffect(() => {
        if (windowRef) {
            dispatch(updateSearchStatus(false));// update redux isItemSearchActive state to hide the search component
            // dispatch(syncLocalStorageOrder());
            dispatch(updatePdpItem(null));
        }
    }, [windowRef])

    useEffect(() => {
        if (cookie['user']) {
            setUserCookie(cookie['user'])
            cookie && dispatch(updateUserData(cookie['user']));
        }
    }, [cookie]);

    useEffect(() => {
        if (cartItems && cartItems.length) {
            let total: any = 0;
            let subTotal: any = 0;
            let appliedTaxes: any[] = [];
            cartItems.map((cartItem) => {
                let applicablePrice: any = (cartItem.salePrice || cartItem.price) * cartItem.quantity;
                subTotal += parseFloat(applicablePrice);
                total += parseFloat(applicablePrice);

                if (cartItem.txchrgs) {
                    cartItem.txchrgs.map((taxData: any) => {
                        //update global total
                        total = Number((Number(total) + Number(taxData.value)).toFixed(2));
                        //update global applied taxes total
                        let isAVl = appliedTaxes.findIndex((at: any) => at.name == taxData.name);
                        if (isAVl != -1) {
                            appliedTaxes[isAVl].total = Number((Number(appliedTaxes[isAVl].total) + Number(taxData.value.toFixed(2)).toFixed(2)));
                        } else {
                            appliedTaxes.push({ name: taxData.name, value: ((100 * taxData.value) / applicablePrice).toFixed(1), total: taxData.value })
                        }
                    })
                }

            })
            setpricingBreakdown({ total, subTotal, appliedTaxes });
        }
    }, [cartItems])

    const onLoginClose = (user) => {
        if (user && user.firstName) {
            router.push({ pathname: baseRouteUrl + 'cart/checkout' }, '', { shallow: true });
        }
        setOpenLoginModal(false);
    }

    const checkout = () => {
        if (configData?.orderingOn && !configData?.storeOff && !configData?.readOnlyMenu) {
            if (configData?.minOrderValue) {
                if (pricingBreakdown.total < configData?.minOrderValue) {
                    dispatch(showError('Minimum order amount is ' + configData.currencySymbol + configData?.minOrderValue));
                    return;
                }
            }
            if (userData) {
                router.push({ pathname: baseRouteUrl + 'cart/checkout' }, '', { shallow: true });
            } else {
                setOpenLoginModal(true);
            }
        } else {
            setShowOrderingOff(true);
        }
    }
    return (
        <div className="cart-page-wrap main-wrapper">
            {cartItems && cartItems.length != 0 ?
                <>
                    <div className="page-heading">
                        <div className='icon' onClick={() => router.back()}><BiArrowBack /></div>
                        {cartItems && cartItems.length} items in cart</div>
                    <div className="itemslistcover">
                        {cartItems.map((cartItem, index) => {
                            return <div key={Math.random()} className="horizontal-product-card-wrap">
                                <HorizontalProductCard item={cartItem} handleClick={() => { }} config={{}} fromPage="cart" />
                            </div>
                        })}
                    </div>
                    <div className="checkout-btn-wrap">
                        <div className='total-wrap d-f-c'>
                            <div className='title'>Total : </div>
                            <div className='value' onClick={() => setShowTotalBreakdownPopup(true)}> {configData.currencySymbol}{pricingBreakdown.total}</div>
                            <div className='icon d-f-c' onClick={() => setShowTotalBreakdownPopup(true)}><SvgIcon icon="info" /></div>
                        </div>
                        <div className='icon-wrap' onClick={checkout}>
                            <>Checkout</>
                            <div className='icon'><GrFormNextLink /></div>
                        </div>
                    </div>
                </>
                :
                // CART IS EMPTY
                <div className="emptyCart-main-wrap">
                    <div className="emptyCart-wrap">
                        <div><img className="cart-logo" src={`/assets/images/${activeGroup}/cart.png`} alt="Respark" /></div>
                        <div className="cart-status">CART IS EMPTY</div>
                        <div className="cart-subtext">You don't have any item in cart</div>
                        <button className="cart-button empty-cart-btn" onClick={() => router.push({ pathname: baseRouteUrl + 'home' }, '', { shallow: true })}>Explore More</button>
                    </div>
                </div>
            }

            <UserRegistrationModal
                handleResponse={(e) => onLoginClose(e)}
                isApppGrpChangeOnUserGdrChange={true}
                open={openLoginModal}
                fromPage="CART_PAGE"
                heading={'Login for placing order'}
            />
            <ConfirmationModal
                openModal={showOrderingOff}
                title={'Ordering confirmation'}
                message={'Currently we are unserviceable'}
                buttonText={'OK'}
                handleClose={() => setShowOrderingOff(false)}
            />

            <Backdrop
                className="backdrop-modal-wrapper"
                open={showTotalBreakdownPopup ? true : false}
                onClick={() => setShowTotalBreakdownPopup(false)}
            >
                <div className="backdrop-modal-content"
                    style={{ height: `${showTotalBreakdownPopup ? `${140 + (pricingBreakdown?.appliedTaxes?.length * 30)}px` : '0'}` }}
                >
                    <div className="heading" >Pricing Details</div>
                    <div className="modal-close" onClick={() => setShowTotalBreakdownPopup(false)}>
                        <SvgIcon icon="close" />
                    </div>
                    <div className='pricing-details-wrap d-f-c'>
                        <div className='heading'>
                            <div className='title'>SubTotal</div>
                            {pricingBreakdown.appliedTaxes?.map((taxData: any, i: number) => {
                                return <div className='title' key={Math.random()}>{taxData.name}({taxData.value}%)</div>
                            })}
                            <div className='title grand-total'>Grand Total</div>
                        </div>
                        <div className='details'>
                            <div className='value'>{configData.currencySymbol} {pricingBreakdown.subTotal}</div>
                            {pricingBreakdown.appliedTaxes?.map((taxData: any, i: number) => {
                                return <div className='value' key={Math.random()}>{configData.currencySymbol} {taxData.total}</div>
                            })}
                            <div className='value grand-total'>{configData.currencySymbol} {pricingBreakdown.total}</div>
                        </div>
                    </div>
                </div>
            </Backdrop>
        </div>
    )
}

export default CartPage

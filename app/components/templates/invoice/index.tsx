import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import router from "next/router";
import { getOrderByOrderId } from '@storeData/order';
import { ORDER_ACCEPTED, ORDER_COMPLETED, ORDER_FIX_DISCOUNT_TYPE, ORDER_PERCENTAGE_DISCOUNT_TYPE, ORDER_REJECTED } from '@constant/order';
import { disableLoader, enableLoader } from '@context/actions';

function InvoicePage({ storeData, metaTags }) {
    const dispatch = useDispatch();
    const baseRouteUrl = useSelector(state => state.store.baseRouteUrl);
    const { configData } = storeData;
    const [orderData, setOrderData] = useState(null)
    const orderId = router.query.pagepath ? router.query.pagepath[1] : '';
    const storeMetaData = useSelector(state => state.store ? state.store.storeMetaData : null);
    const [orderStatus, setOrderStatus] = useState('')

    useEffect(() => {
        if (orderId) {
            dispatch(enableLoader());
            getOrderByOrderId(orderId).then((order: any) => {
                dispatch(disableLoader());
                if (order) {
                    setOrderStatus(orderData?.statuses[orderData?.statuses?.length - 1]?.state);
                    let settledTiming = new Date().toLocaleString();
                    if ((orderData?.statuses[orderData?.statuses?.length - 1]?.state == ORDER_COMPLETED) || (orderData?.statuses[orderData?.statuses?.length - 1]?.state == ORDER_REJECTED)) {
                        if (typeof (order.statuses[1].createdOn) == 'string') {
                            settledTiming = new Date(order?.statuses[order?.statuses?.length - 1]?.createdOn).toLocaleString();
                        } else {
                            settledTiming = order?.statuses[order?.statuses?.length - 1]?.createdOn.toLocaleString();
                        }
                    }
                    order.settledTiming = settledTiming;
                    if (order) {
                        // if (genericConfig.txchConfig && genericConfig.txchConfig.length != 0) {
                        const orderCopy = { ...order }
                        let appliedTaxes: any[] = [];
                        let subtotal = 0;
                        let total: any = 0;
                        let taxesTotal: any = 0;
                        orderCopy.products.map((product: any, i: number) => {

                            // her  variation price not considered because at the time of order booking it is set inside products object as price and salePrice
                            let applicablePrice: any = (parseFloat(product.billingPrice) || parseFloat(product.salePrice) || parseFloat(product.price)) * product.quantity;
                            if ((product.complementary?.remark)) {//if item is complimentary do not calculate price
                                applicablePrice = 0;
                            }
                            subtotal += parseFloat(applicablePrice);
                            total += parseFloat(applicablePrice);
                            if (product.txchrgs && product.txchrgs?.length != 0) {
                                product.txchrgs.map((taxData: any) => {
                                    if (applicablePrice) {
                                        let tDetails = configData?.txchConfig ? configData?.txchConfig?.filter((t: any) => t.name == taxData.name) : [];
                                        //update global total
                                        if (tDetails.length != 0) {
                                            const taxApplied = Number(((parseFloat(applicablePrice) / 100) * parseFloat(tDetails[0].value)).toFixed(2))
                                            total += taxApplied;
                                            //update global applied taxes total
                                            let isAVl = appliedTaxes.findIndex((at: any) => at.name == taxData.name);
                                            if (isAVl != -1) {
                                                appliedTaxes[isAVl].total += taxApplied;
                                            } else {
                                                appliedTaxes.push({ name: taxData.name, value: tDetails[0].value, total: taxApplied })
                                            }
                                            taxesTotal += taxApplied;
                                        }
                                    }
                                })
                            }
                            if (i == orderCopy.products.length - 1) {
                                if (!!orderCopy.discount?.value) {//if any discount applied
                                    if (orderCopy.discount?.type == ORDER_FIX_DISCOUNT_TYPE) {
                                        total = (total - orderCopy.discount?.value);
                                    } else {
                                        total = (total - (orderCopy?.discount?.value * (subtotal + taxesTotal)) / 100);
                                    }
                                }
                                orderCopy.txchrgs = appliedTaxes;
                                orderCopy.taxesTotal = taxesTotal || 0
                                orderCopy.subtotal = subtotal.toFixed(1);
                                orderCopy.total = total.toFixed(1);
                                if ((configData.txchConfig && configData.txchConfig.length != 0 && !order.txchrgs) || (order.total != orderCopy.total)) {//check for total beacause of stopping rerendering on setting order
                                    // if ((!order.txchrgs || (order.txchrgs && order.txchrgs.length == 0))) {//check for total beacause of stopping rerendering on setting order
                                    setOrderData(orderCopy);
                                }
                            }
                        })
                        // }
                    }
                    console.log(order)
                }
            }).catch((error) => {
                dispatch(disableLoader());
                console.log(error);
                setOrderData('');
            })
        }
    }, [orderId])

    const redirectToHome = () => {
        router.push({ pathname: baseRouteUrl + 'home' }, '', { shallow: true });
    }

    return (
        <div className="invoice-wrapper">
            <div className='page-heading'>Order Invoice</div>
            {orderData ? <div className="invoice-page-wrap">
                <div className='salon-details-wrap'>
                    <div className='logo-wrap'>
                        <img src={storeMetaData.logoPath} />
                    </div>
                    <div className='salon-details'>
                        <div className='name'>{storeMetaData?.name}</div>
                        <div className='address s-detail'>{storeMetaData?.address}, {storeMetaData?.area}, {storeMetaData?.city}, {storeMetaData?.state}
                            {storeMetaData?.pincode && <>, {storeMetaData?.pincode}</>}
                        </div>
                        <div className='phone s-detail'>{storeMetaData?.phone}
                            {storeMetaData?.phone1 && storeMetaData?.phone && <>, </>}
                            {storeMetaData?.phone1 && <>{storeMetaData?.phone1}</>}
                        </div>
                        <div className='email s-detail'>{storeMetaData?.email}</div>
                        {storeMetaData?.gstn && <div className='gstn s-detail'>GSTN: {storeMetaData?.gstn}</div>}
                    </div>
                </div>
                <div className='user-details-wrap'>
                    <div className='user-details'>
                        <div className='subheading'>Bill to:</div>
                        <div className='name'>{orderData?.guest}</div>
                        <div className='phone'>{orderData?.phone} {orderData?.email && <>{orderData?.email}</>}</div>
                    </div>
                    <div className='date-wrap'>
                        {/* <div className='date'><span>Created On: </span>{orderData?.createdOn?.substring(0, 10)} {`${new Date(orderData?.createdOn).getHours()}:${new Date(orderData?.createdOn).getMinutes()}`}</div>
                        <div className='time'><span>Order Date: </span>{new Date(orderData?.orderDay).toLocaleDateString()}, {new Date(orderData?.orderDay).toLocaleTimeString()}</div> */}
                        <div className='subheading'>Order Id: <div className='order-id'>{orderData?.orderId}</div></div>
                        <div className='subheading'>Date: <div className='time'>{orderData?.orderDay?.substring(0, 10)}</div></div>
                        <div className='subheading'>Time: <div className='time'>{`${new Date(orderData?.createdOn).getHours()}:${new Date(orderData?.createdOn).getMinutes()}`}</div></div>

                    </div>
                </div>
                <div className='subheading services-heading'>Services & products:</div>
                <div className='invoice-details-wrap order-invoice-details'>
                    <div className='services-list-wrap'>
                        <div className='heading-wrap d-f-c'>
                            <div className='srnumber'>Sr.</div>
                            <div className='name'>Item</div>
                            <div className='expert'>Type</div>
                            <div className='qty'>Qty.</div>
                            <div className='amt'>Amt.</div>
                        </div>
                        <div className='details-wrap'>
                            {orderData?.products?.map((itemDetails: any, i: number) => {
                                return <div key={Math.random()} className='service-details d-f-c'>
                                    <div className='srnumber'>{i + 1}</div>
                                    <div className='name'><span>{itemDetails.category}</span> - {itemDetails.name}
                                        {itemDetails.variations && itemDetails.variations.length != 0 && <div className='variations-wrap'>
                                            ({itemDetails.variations[0].name}
                                            {itemDetails.variations.length != 0 && itemDetails.variations[0]?.variations && itemDetails.variations[0]?.variations?.length != 0 &&
                                                <>-{itemDetails.variations[0]?.variations[0]?.name}</>}
                                            {itemDetails.variations.length != 0 && itemDetails.variations[0]?.variations && itemDetails.variations[0]?.variations?.length != 0 && itemDetails.variations[0]?.variations[0]?.variations?.length != 0 &&
                                                <>-{itemDetails.variations[0]?.variations[0]?.variations[0]?.name}</>})
                                        </div>}
                                    </div>
                                    <div className='expert'>{itemDetails.type}</div>
                                    <div className='qty'>{itemDetails.quantity}</div>
                                    <div className='amt'>{configData.currencySymbol} {itemDetails.complementary?.remark ? 0 : ((itemDetails.billingPrice) * itemDetails.quantity)}</div>
                                </div>
                            })}
                        </div>
                    </div>
                    <div className='invoice-total-details-wrap'>
                        <div className='total-details d-f-c'>
                            <div className='heading'>
                                <div className='head'>SubTotal</div>
                                {(!!orderData?.taxesTotal && orderData?.txchrgs?.length != 0) && orderData?.txchrgs.map((taxData: any, i: number) => {
                                    return <div className='head' key={Math.random()}>{taxData.name}({taxData.value}%)</div>
                                })}
                                {!!orderData?.discount?.value && <div className='head'>Discount{orderData?.discount?.type == ORDER_PERCENTAGE_DISCOUNT_TYPE && <>({orderData?.discount?.value}%)</>}</div>}
                                <div className='head grand-total'>Grand Total</div>
                            </div>
                            <div className='details'>
                                <div className='value'>{configData.currencySymbol} {orderData?.subtotal}</div>
                                {(!!orderData?.taxesTotal && orderData?.txchrgs?.length != 0) && orderData?.txchrgs.map((taxData: any, i: number) => {
                                    return <div className='value' key={Math.random()}>{configData.currencySymbol} {taxData.total}</div>
                                })}
                                {!!orderData?.discount?.value ? <>
                                    {orderData?.discount?.type == ORDER_FIX_DISCOUNT_TYPE ? <>
                                        <div className='value'>{configData.currencySymbol} {orderData?.discount?.value} </div>
                                    </> : <>
                                        <div className='value'>{configData.currencySymbol} {(orderData?.discount?.value * (Number(orderData?.taxesTotal) + Number(orderData?.subtotal)) / 100).toFixed(1)}</div>
                                    </>}
                                    <div className='value grand-total'>{configData.currencySymbol} {orderData?.total}</div>
                                </> :
                                    <div className='value grand-total'>{configData.currencySymbol} {orderData?.total} </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {(orderStatus == ORDER_COMPLETED || orderStatus == ORDER_ACCEPTED) && <div className='payment-wrap'>
                    <div className='payment-by d-f-c'>
                        <div className='paid-via'>
                            <span>Paid  @{orderData?.settledTiming} Via : </span>
                            {orderData?.payMode && <>{orderData?.payMode}</>}
                        </div>
                    </div>
                </div>}
                <div className='note'>
                    Thank you for visiting us
                </div>
            </div> : <>
                {orderId ? <div className='no-data card'>
                    The invoice you are looking for is not available
                </div> : <div className='no-data card'>
                    Invalid link
                </div>}
            </>}
            <div className="footer-btn-wrap">
                <button className='primary-btn' onClick={redirectToHome}>Explore More Services & Products</button>
            </div>
        </div>
    )
}

export default InvoicePage
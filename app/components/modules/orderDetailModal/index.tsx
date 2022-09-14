import React, { useEffect, useState } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { Button } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import CloseIcon from '@material-ui/icons/CloseOutlined';
import { useSelector } from 'react-redux';
import { ORDER_PERCENTAGE_DISCOUNT_TYPE, ORDER_FIX_DISCOUNT_TYPE, ORDER_COMPLETED, ORDER_ACCEPTED } from '@constant/order';


function IoIosArrowBack(props) {
    return <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 512 512" height="1em" width="1em" {...props}><path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z" /></svg>;
}

function OrderDetailModel({ orderData, handleClose }) {
    console.log("order details", orderData)
    const store = useSelector(state => state.store);
    const { storeMetaData } = store;
    const { configData } = store.storeData;
    const orderStatus = orderData?.statuses[orderData?.statuses?.length - 1]?.state;
    const [order, setOrder] = useState(null);

    useEffect(() => {
        if (orderData) {
            // if (genericConfig.txchConfig && genericConfig.txchConfig.length != 0) {
            const orderCopy = { ...orderData }
            let appliedTaxes: any[] = [];
            let subtotal = 0;
            let total: any = 0;
            let taxesTotal: any = 0;
            orderCopy.products.map((product: any, i: number) => {

                // her  variation price not considered because at the time of orderData booking it is set inside products object as price and salePrice
                let applicablePrice: any = (parseFloat(product.billingPrice) || parseFloat(product.salePrice) || parseFloat(product.price)) * product.quantity;
                if ((product.complementary?.remark)) {//if item is complimentary do not calculate price
                    applicablePrice = 0;
                }
                subtotal += parseFloat(applicablePrice);
                total += parseFloat(applicablePrice);
                if (product.txchrgs) {
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
                    if ((configData.txchConfig && configData.txchConfig.length != 0 && !orderData.txchrgs) || (orderData.total != orderCopy.total)) {//check for total beacause of stopping rerendering on setting order
                        // if ((!order.txchrgs || (order.txchrgs && order.txchrgs.length == 0))) {//check for total beacause of stopping rerendering on setting order
                        console.log(orderCopy)
                        setOrder(orderCopy);
                    }
                }
            })
            // }
        }
    }, [orderData]);

    return (
        <Backdrop
            className="backdrop-modal-wrapper"
            open={orderData ? true : false}
            onClick={handleClose}
        >
            <div className="backdrop-modal-content"
                style={{ height: orderData ? '85vh' : '0px', borderRadius: '6px 6px 0 0' }}
            >
                <div className="modal-close" onClick={handleClose}>
                    <IoIosArrowBack />
                </div>
                <div className="member-modal">
                    <div className="invoice-wrapper">
                        <div className='page-heading'>Order Invoice {orderStatus != ORDER_COMPLETED && <>({orderStatus})</>}</div>
                        <div className="invoice-page-wrap">
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
                                    <div className='name'>{order?.guest}</div>
                                    <div className='phone'>{order?.phone} {order?.email && <>{order?.email}</>}</div>
                                </div>
                                <div className='date-wrap'>
                                    {/* <div className='date'><span>Created On: </span>{order?.createdOn?.substring(0, 10)} {`${new Date(order?.createdOn).getHours()}:${new Date(order?.createdOn).getMinutes()}`}</div>
                        <div className='time'><span>Order Date: </span>{new Date(order?.orderDay).toLocaleDateString()}, {new Date(order?.orderDay).toLocaleTimeString()}</div> */}
                                    <div className='subheading'>Order Id: <div className='order-id'>{order?.orderId}</div></div>
                                    <div className='subheading'>Date: <div className='time'>{order?.orderDay?.substring(0, 10)}</div></div>
                                    <div className='subheading'>Time: <div className='time'>{`${new Date(order?.createdOn).getHours()}:${new Date(order?.createdOn).getMinutes()}`}</div></div>

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
                                        {order?.products?.map((itemDetails: any, i: number) => {
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
                                            {(!!order?.taxesTotal && order?.txchrgs?.length != 0) && order?.txchrgs.map((taxData: any, i: number) => {
                                                return <div className='head' key={Math.random()}>{taxData.name}({taxData.value}%)</div>
                                            })}
                                            {!!order?.discount?.value && <div className='head'>Discount{order?.discount?.type == ORDER_PERCENTAGE_DISCOUNT_TYPE && <>({order?.discount?.value}%)</>}</div>}
                                            <div className='head grand-total'>Grand Total</div>
                                        </div>
                                        <div className='details'>
                                            <div className='value'>{configData.currencySymbol} {order?.subtotal}</div>
                                            {(!!order?.taxesTotal && order?.txchrgs?.length != 0) && order?.txchrgs.map((taxData: any, i: number) => {
                                                return <div className='value' key={Math.random()}>{configData.currencySymbol} {taxData.total}</div>
                                            })}
                                            {!!order?.discount?.value ? <>
                                                {order?.discount?.type == ORDER_FIX_DISCOUNT_TYPE ? <>
                                                    <div className='value'>{configData.currencySymbol} {order?.discount?.value} </div>
                                                </> : <>
                                                    <div className='value'>{configData.currencySymbol} {(order?.discount?.value * (Number(order?.taxesTotal) + Number(order?.subtotal)) / 100).toFixed(1)}</div>
                                                </>}
                                                <div className='value grand-total'>{configData.currencySymbol} {order?.total}</div>
                                            </> :
                                                <div className='value grand-total'>{configData.currencySymbol} {order?.total} </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {(orderStatus == ORDER_COMPLETED || orderStatus == ORDER_ACCEPTED) && <div className='payment-wrap'>
                                <div className='payment-by d-f-c'>
                                    <div className='paid-via'>
                                        <span>Paid  @{order?.settledTiming} Via : </span>
                                        {order?.payMode && <>{order?.payMode}</>}
                                    </div>
                                </div>
                            </div>}
                            <div className='note'>
                                Thank you for visiting us
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Backdrop>
    );
}

export default OrderDetailModel;
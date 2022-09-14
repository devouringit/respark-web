import React, { useState, useEffect } from 'react'
import { useCookies } from "react-cookie";
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { getOrderByTenantIdAndGuestId } from '@storeData/order';
import OrderDetailModel from '@module/orderDetailModal';
import { disableLoader, enableLoader, showError } from '@context/actions';
import { windowRef } from '@util/window';
import { formatTimeTo12Hr } from '@util/utils';

function OrderHistoryPage() {
    const dispatch = useDispatch();
    const [cookie, setCookie] = useCookies();
    const [userData, setUserCookie] = useState(cookie['user']);
    const store = useSelector(state => state.store);
    const [orderHistoryData, setOrderHistoryData] = useState(null);
    const [activeOrder, setactiveOrder] = useState(null);
    const { configData } = useSelector(state => state.store ? state.store.storeData : null);

    useEffect(() => {
        if (windowRef) window.scrollTo(0, 0);
    }, [windowRef])

    useEffect(() => {
        dispatch(enableLoader());
        getOrderByTenantIdAndGuestId(userData.id, userData.tenantId)
            .then((order: any) => {
                if (order) {
                    order = order.filter((o) => !o.appointmentId);
                    order.sort(function (a: any, b: any) {
                        var dateA: any = new Date(a.orderDay).getTime();
                        var dateB: any = new Date(b.orderDay).getTime();
                        return dateA < dateB ? 1 : -1; // ? -1 : 1 for ascending/increasing order
                    });
                    setOrderHistoryData(order);
                    dispatch(disableLoader());
                }
            })
            .catch((e) => {
                dispatch(disableLoader());
                dispatch(showError(e.error));
            })
    }, [])
    const viewBill = (item) => {
        setactiveOrder(item);
    }
    return (
        <>
            {orderHistoryData ?
                <div className="order-history-outer">
                    <p className="heading">Order History</p>
                    {orderHistoryData?.map((item, index) => {
                        return <div className="order-card" key={Math.random()} onClick={() => viewBill(item)}>
                            <span>order #{item.orderId}</span>
                            <span className="right-align">{configData.currencySymbol} {item.total}</span>
                            <div>
                                <span className="order-type">{item.type}</span>
                                <span className="right-align order-type color">
                                    {new Date(item.orderDay).toLocaleString().split(", ")[0].split("/").join("-")} {formatTimeTo12Hr(`${new Date(item.createdOn).getHours()}:${new Date(item.createdOn).getMinutes()}`)}</span>
                            </div>
                            <div>
                                <span className="action-button">View Bill</span>
                                {/* <span className="action-button">Re Order</span> */}
                            </div>
                        </div>
                    })}
                    <OrderDetailModel
                        orderData={activeOrder}
                        handleClose={() => setactiveOrder(null)} />
                </div> :
                <div className='orders-unavailable d-f-c'>
                    Orders Unavailable
                </div>}
        </>
    )
}

export default OrderHistoryPage;

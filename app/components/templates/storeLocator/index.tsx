import { disableLoader, enableLoader } from '@context/actions';
import { getStoresByTenantId } from '@storeData/store'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';

const StoreLocator = ({ storeData }) => {

    const [storesList, setStoresList] = useState([])
    const activeGroup = useSelector(state => state.activeGroup);
    const dispatch = useDispatch();

    useEffect(() => {
        if (storeData.tenantId) {
            dispatch(enableLoader());
            getStoresByTenantId(storeData.tenantId).then((res: any) => {
                dispatch(disableLoader());
                setStoresList(res);
            }).catch((err) => {
                dispatch(disableLoader());
                console.log(err)
            })
        }
    }, [storeData])

    return (
        <div className='store-locator-wrap'>
            {storesList && storesList.length != 0 && storesList.map((storeData: any, i: number) => {
                return <div key={Math.random()} className='store-details'>
                    <div className='name'>{storeData.name}</div>
                    <div className="information-wrap">
                        <a href={`${storeData.googleMapUrl ? storeData.googleMapUrl : `https://www.google.com/maps/search/?api=1&query=${storeData.latitude},${storeData.longitude}`}`} rel="noreferrer" target="_blank">
                            <img src={`/assets/images/footer/${activeGroup}/location_icon.png`} />
                        </a>
                        <span className="containt">
                            <a href={`${storeData.googleMapUrl ? storeData.googleMapUrl : `https://www.google.com/maps/search/?api=1&query=${storeData.latitude},${storeData.longitude}`}`} rel="noreferrer" target="_blank">
                                {storeData.address}, {storeData.area}, {storeData.city}, {storeData.state}, {storeData.pincode}
                            </a>
                        </span>
                    </div>
                    <div className="information-wrap">
                        <a href={`tel:${storeData.phone?.length == 10 ? '+91 ' : ''} ${storeData.phone}`}><img src={`/assets/images/footer/${activeGroup}/call_icon.png`} /></a>
                        <span className="containt">
                            {storeData.phone && <a href={`tel:${storeData.phone?.length == 10 ? '+91 ' : ''} ${storeData.phone}`}>
                                {storeData.phone?.length == 10 ? '+91' : <>&nbsp;&nbsp;&nbsp;</>} {storeData.phone}
                            </a>}
                            {storeData.phone1 && <><br /><a href={`tel:+91 ${storeData.phone1}`}> +91 {storeData.phone1}</a></>}
                        </span>
                    </div>
                    {storeData.email && <div className="information-wrap">
                        <a href={`mailto:${storeData.email}`} rel="noreferrer" target="_blank"><img src={`/assets/images/footer/${activeGroup}/mail_icon.png`} /></a>
                        <span className="containt"> <a href={`mailto:${storeData.email}`} rel="noreferrer" target="_blank">{storeData.email}</a></span>
                    </div>}
                </div>
            })}
        </div>
    )
}

export default StoreLocator
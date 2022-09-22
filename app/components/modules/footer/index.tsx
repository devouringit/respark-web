import { formatTimeTo12Hr } from '@util/utils';
import React, { useEffect, useState } from 'react'
import { disableLoader, enableLoader } from '@context/actions';
import { getStoresByTenantId } from '@storeData/store'
import { useSelector, useDispatch } from 'react-redux';
import router from 'next/router';

function FaPhone(props) {
    return <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 512 512" height="1em" width="1em" {...props}><path d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1.6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z" /></svg>;
}

function MdEmail(props) {
    return <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" height="1em" width="1em" {...props}><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>;
}

function ImLocation(props) {
    return <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 16 16" height="1em" width="1em" {...props}><path d="M8 0c-2.761 0-5 2.239-5 5 0 5 5 11 5 11s5-6 5-11c0-2.761-2.239-5-5-5zM8 8c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" /></svg>;
}

function FacebookIcon() {
    return <svg className="facebook" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M400 32H48A48 48 0 0 0 0 80v352a48 48 0 0 0 48 48h137.25V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.27c-30.81 0-40.42 19.12-40.42 38.73V256h68.78l-11 71.69h-57.78V480H400a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48z"></path></svg>
}

function WhatsappIcon() {
    return <svg className="whatsapp" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M260.062 32C138.605 32 40.134 129.701 40.134 250.232c0 41.23 11.532 79.79 31.559 112.687L32 480l121.764-38.682c31.508 17.285 67.745 27.146 106.298 27.146C381.535 468.464 480 370.749 480 250.232 480 129.701 381.535 32 260.062 32zm109.362 301.11c-5.174 12.827-28.574 24.533-38.899 25.072-10.314.547-10.608 7.994-66.84-16.434-56.225-24.434-90.052-83.844-92.719-87.67-2.669-3.812-21.78-31.047-20.749-58.455 1.038-27.413 16.047-40.346 21.404-45.725 5.351-5.387 11.486-6.352 15.232-6.413 4.428-.072 7.296-.132 10.573-.011 3.274.124 8.192-.685 12.45 10.639 4.256 11.323 14.443 39.153 15.746 41.989 1.302 2.839 2.108 6.126.102 9.771-2.012 3.653-3.042 5.935-5.961 9.083-2.935 3.148-6.174 7.042-8.792 9.449-2.92 2.665-5.97 5.572-2.9 11.269 3.068 5.693 13.653 24.356 29.779 39.736 20.725 19.771 38.598 26.329 44.098 29.317 5.515 3.004 8.806 2.67 12.226-.929 3.404-3.599 14.639-15.746 18.596-21.169 3.955-5.438 7.661-4.373 12.742-2.329 5.078 2.052 32.157 16.556 37.673 19.551 5.51 2.989 9.193 4.529 10.51 6.9 1.317 2.38.901 13.531-4.271 26.359z"></path></svg>
}

function YoutubeIcon() {
    return <svg className="youtube" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M941.3 296.1a112.3 112.3 0 0 0-79.2-79.3C792.2 198 512 198 512 198s-280.2 0-350.1 18.7A112.12 112.12 0 0 0 82.7 296C64 366 64 512 64 512s0 146 18.7 215.9c10.3 38.6 40.7 69 79.2 79.3C231.8 826 512 826 512 826s280.2 0 350.1-18.8c38.6-10.3 68.9-40.7 79.2-79.3C960 658 960 512 960 512s0-146-18.7-215.9zM423 646V378l232 133-232 135z"></path></svg>
}

function Footer() {
    const storeMetaData = useSelector(state => state.store ? state.store.storeMetaData : null);
    const storeData = useSelector(state => state.store ? state.store.storeData : null);
    const [socialLinks, setSocialLinks] = useState([]);
    const dispatch = useDispatch();
    const [storesList, setStoresList] = useState([])
    const baseRouteUrl = useSelector(state => state.store.baseRouteUrl);
    const { configData } = useSelector(state => state.store ? state.store.storeData : null);

    useEffect(() => {
        const { configData: { socialLinks } } = storeData;
        if (socialLinks.length != 0) {
            setSocialLinks(socialLinks.filter((l: any) => l.active));
        }
    }, [storeData])

    useEffect(() => {
        if (storeData.tenantId && storesList.length == 0) {
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


    const redirectToHome = () => {
        router.push({ pathname: baseRouteUrl + 'store-locator' }, '', { shallow: true });
    }

    const onClickType = (type: any, data: any = {}) => {
        switch (type) {
            case 'facebook': case 'whatsapp': case 'instagram': case 'youtube':
                window.open(data.url, '_blank')
                break;
            case 'phone':
                window.open(`tel:${storeMetaData.phone?.length == 10 ? '+91 ' : ''}${storeMetaData.phone}`, '_self')
                break;
            case 'location':
                window.open(`${storeMetaData.googleMapUrl ? storeMetaData.googleMapUrl : `https://www.google.com/maps/search/?api=1&query=${storeMetaData.latitude},${storeMetaData.longitude}`}`, '_blank')
                break;
            case 'email':
                window.open(`mailto:${storeMetaData.email}`, '_self')
                break;

            default:
                break;
        }
    }

    return (
        <>
            {storeMetaData?.name?.length != 0 ? <div>
                < div className="footer-wrap" id="footer-wrapper"
                // style={{ backgroundImage: `url(/assets/${genericImages?.footerBg})` }} 
                >
                    <div className="social-wrap">
                        <div className="getInTouch">Get In Touch</div>
                        <div className="social-icon-wrap">
                            {socialLinks.length !== 0 && socialLinks.map((linkData, index) => {
                                return <div className="social-icon glass-card" key={Math.random()} onClick={() => onClickType(linkData.name, linkData)}>
                                    {/* {linkData.name.includes('instagram') && <SvgIcon icon="instagram" />} */}
                                    {linkData.name.includes('instagram') && <img className="insta" src="/assets/Icons/social/insta.svg" alt="Respark" />}
                                    {linkData.name.includes('facebook') && <FacebookIcon />}
                                    {linkData.name.includes('whatsapp') && <WhatsappIcon />}
                                    {linkData.name.includes('youtube') && <YoutubeIcon />}
                                </div>
                            })}
                        </div>
                    </div>
                    <div className="information-wrap">
                        <div className="icon glass-card" onClick={() => onClickType('location')}>
                            <ImLocation />
                        </div>
                        {storesList && configData.showStoreLocator && storesList.length > 1 ?
                            <span className="containt">
                                {storesList && storesList.length != 0 && storesList.map((storeData: any, i: number) => {
                                    return <div key={Math.random()} className='name' onClick={() => redirectToHome()}>{storeData.name}</div>
                                })}
                            </span> :
                            <span className="containt" style={{ textTransform: 'capitalize' }}>
                                <a href={storeMetaData.googleMapUrl} rel="noreferrer" target="_blank">
                                    {storeMetaData.address}, {storeMetaData.area}, {storeMetaData.city}, {storeMetaData.state}, {storeMetaData.pincode}
                                </a>
                            </span>
                        }
                    </div>
                    <div className="information-wrap">
                        <div className="icon glass-card" onClick={() => onClickType('phone')}>
                            <FaPhone />
                        </div>
                        <span className="containt">
                            {storeMetaData.phone && <a href={`tel:${storeMetaData.phone?.length == 10 ? '+91 ' : ''}${storeMetaData.phone}`}>
                                {storeMetaData.phone?.length == 10 ? '+91 ' : <>&nbsp;&nbsp;&nbsp;</>}{storeMetaData.phone}
                            </a>}
                            {storeMetaData.phone1 && <><br /><a style={{ paddingLeft: '10px' }} href={`tel:+91 ${storeMetaData.phone1}`}> +91 {storeMetaData.phone1}</a></>}
                        </span>
                    </div>
                    {storeMetaData.email && <div className="information-wrap">

                        <div className="icon glass-card" onClick={() => onClickType('email')}>
                            <MdEmail />
                        </div>
                        {/* <a href={`mailto:${storeMetaData.email}`} rel="noreferrer" target="_blank" className='icon glass-card'><MdEmail /></a> */}
                        <span className="containt"> <a href={`mailto:${storeMetaData.email}`} rel="noreferrer" target="_blank">{storeMetaData.email}</a></span>
                    </div>}
                    {storeData.configData?.startTime?.length != 0 && <div className="store-timing-wrap glass-card">
                        *Working Hours: {formatTimeTo12Hr(storeData.configData.startTime)} to {formatTimeTo12Hr(storeData.configData.closureTime)}
                    </div>}
                    <div className="copyright-wrp" style={{ textTransform: 'capitalize' }}>
                        <span>Copyright &copy; 2022 {storeData.tenant}, {storeMetaData.name}</span>
                    </div>
                </div >
            </div > : null
            }
        </>
    )
}

export default Footer

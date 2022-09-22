import React, { useState, useEffect } from "react";
import { PDP_NO_IMAGE } from "@constant/noImage";
import ImageSlider from "@element/imageSlider";
import { useSelector, useDispatch } from 'react-redux';
import { syncLocalStorageOrder } from "app/redux/actions/order";
import { windowRef } from "@util/window";
import { showError, showSuccess, updatePdpItem, updatePdpItemStatus } from "@context/actions";
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Slide from '@material-ui/core/Slide';
import { useRouter } from 'next/router';
import { replaceAppointmentServices } from "@context/actions/appointment";
import { SERVICE } from "@constant/types";
import SvgIcon from "@element/svgIcon";

function ServicePdpModal() {
    const router = useRouter();
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.order.orderItems);
    const appointmentItems = useSelector(state => state.appointment.appointmentServices);
    const item = useSelector(state => state.pdpItem);
    const pdpItemStatus = useSelector(state => state.pdpItemStatus);
    const [showLongDescription, setShowLongDescription] = useState(false);
    const shortDescription = item?.description ? item?.description?.substring(0, 110) : '';
    const alreadyShortDescription = item?.description <= item?.description?.substring(0, 110);
    const baseRouteUrl = useSelector(state => state.store.baseRouteUrl);
    const [isAlreadyAdded, setIsAlreadyAdded] = useState(false);
    const { configData, keywords } = useSelector(state => state.store ? state.store.storeData : null);
    const [availableWidth, setAvailableWidth] = useState(400);
    const [selectedVariationService, setSelectedVariationService] = useState<any>('');
    const [selectedVariation, setSelectedVariation] = useState<any>('');
    const storeMetaData = useSelector(state => state.store ? state.store.storeMetaData : null);
    const [descList, setDescList] = useState(item?.description ? item?.description?.split('||') : []);

    if (item && !item?.categoryName) {
        let catName: any = ('pagepath' in router.query) ? router?.query?.pagepath[0].split("-") : '';
        catName.pop();
        catName = catName.join(" ");
        item.categoryName = catName;
    }

    useEffect(() => {
        if (windowRef) {
            document.body.classList.add("o-h")
        }
        return () => {
            dispatch(updatePdpItem(null));
            document.body.classList.remove("o-h")
        }

    }, [windowRef]);

    useEffect(() => {
        if (item?.description?.includes('||')) {
            setDescList(item?.description?.split('||'))
        }
    }, [item])

    useEffect(() => {
        if (windowRef) {//set width for pdp modal depend on screen size
            setAvailableWidth(window?.screen?.availWidth > 480 ? 480 : window?.screen?.availWidth);
        }
    }, [item, windowRef]);


    useEffect(() => {
        if (appointmentItems.length && !selectedVariation) {//here selectedVariation check is for the first time page load
            const itemIndex: number = appointmentItems.findIndex((appointentItem) => (appointentItem.id == item?.id));
            if (itemIndex != -1) {
                let serviceCopy = { ...appointmentItems[itemIndex] }
                if (serviceCopy.variations?.length != 0) {
                    setSelectedVariation(getSelectedVariationObj(serviceCopy));
                    setSelectedVariationService({ ...serviceCopy });
                } else {
                    setIsAlreadyAdded(true);
                }
            }
        }
    }, [appointmentItems]);

    useEffect(() => {
        // check selected service variations already added to cart for respective variation
        if (selectedVariation && appointmentItems.length) {
            let isAlreadyAdded = false;
            appointmentItems.map((appointentItem) => {
                if (appointentItem.id == item?.id) {//get list of cart items having same service data as current pdp item
                    if (appointentItem.variations?.length != 0) {
                        const cartVariations = getSelectedVariationObj(appointentItem);
                        if (JSON.stringify(cartVariations) === JSON.stringify(selectedVariation)) {//check for item of same service and selected variations
                            isAlreadyAdded = true;
                        }
                    } else {
                        isAlreadyAdded = true;
                    }
                }
            })
            setIsAlreadyAdded(isAlreadyAdded);
        }
    }, [selectedVariation, appointmentItems]);


    const getSelectedVariationObj = (service) => {
        const selectedVariations = { variant: '', subVariant: '', subSubVariant: '', }
        if (service.variations?.length != 0) {
            let vObj = service.variations[0];
            selectedVariations.variant = vObj.name;//weekdays or weekend
            if (vObj.variations?.length != 0) {
                vObj = vObj.variations[0]
                selectedVariations.subVariant = vObj.name;//male or female
            }
            if (vObj.variations?.length != 0) {
                vObj = vObj.variations[0]
                selectedVariations.subSubVariant = vObj.name;//adult or kids
            }
        }
        return { ...selectedVariations };
    }

    const closePdpMOdal = () => {
        document.body.classList.remove("o-h")
        // document.body.style.overflow = 'unset';
        // router.push(baseRouteUrl + 'home');
        dispatch(updatePdpItem(null));
        if (pdpItemStatus) {
            router.push({ pathname: baseRouteUrl + 'home' }, '', { shallow: true });
            dispatch(updatePdpItemStatus(null));
        }

    }
    const addToAppointment = () => {
        if (item?.variations?.length !== 0 && !selectedVariationService) {
            dispatch(showError('Select service variation', 3000));
            return;
        }
        const appointmentItemsCopy = appointmentItems ? [...appointmentItems] : [];
        const serviceCopy = { ...item };
        if (item?.variations?.length !== 0) {
            appointmentItemsCopy.push(selectedVariationService);
        } else {
            serviceCopy.txchrgs = [];
            let price: any = parseFloat(serviceCopy.price);
            let salePrice: any = parseFloat(serviceCopy.salePrice);
            serviceCopy.price = price;
            serviceCopy.salePrice = salePrice;
            serviceCopy.txchrgs = calculateTaxes(salePrice || price);
            appointmentItemsCopy.push(serviceCopy);
        }
        dispatch(replaceAppointmentServices(appointmentItemsCopy));
        dispatch(showSuccess('Service Added', 2000));
        if (router.query.pagepath.includes('appointment')) {//incase of appointment after adding item to appointment close modal
            closePdpMOdal();
        } else {
            router.push({ pathname: baseRouteUrl + 'appointment' }, '', { shallow: true });
            dispatch(updatePdpItemStatus(null));
            document.body.classList.remove("o-h")
            dispatch(updatePdpItem(null));
        }
    }
    const removeFromAppointment = () => {
        const appointmentItemsCopy = appointmentItems ? [...appointmentItems] : [];
        let cartItemIndex = null;
        appointmentItems.map((appointentItem, i) => {
            if ((appointentItem.id == item?.id)) {//get list of cart items having same service data as current pdp item
                if (appointentItem.variations?.length != 0) {
                    const cartVariations = getSelectedVariationObj(appointentItem);
                    if (JSON.stringify(cartVariations) === JSON.stringify(selectedVariation)) {//check for item of same service and selected variations
                        cartItemIndex = i;
                    }
                } else {
                    cartItemIndex = i;
                }
            }
        })
        appointmentItemsCopy.splice(cartItemIndex, 1);
        dispatch(replaceAppointmentServices(appointmentItemsCopy));
        dispatch(showSuccess('Service Removed', 2000));
        setIsAlreadyAdded(false);
        if (router.query.pagepath.includes('appointment')) {//incase of appointment after adding item to appointment close modal
            closePdpMOdal();
        }
    }

    const calculateTaxes = (taxebalePrice: any) => {
        let txchrgs: any[] = [];
        if (configData.txchConfig && configData.txchConfig.length != 0) {
            configData.txchConfig.map((taxData: any) => {
                if (taxData.active) {
                    if ((taxData.applyOn == 3 || taxData.applyOn == 1) && !taxData.charge) {
                        const taxObj = {
                            name: taxData.name,
                            type: taxData.type,
                            value: parseFloat(((parseFloat(taxebalePrice) / 100) * parseFloat(taxData.value)).toFixed(2)),
                        }
                        txchrgs.push(taxObj);
                    }
                }
            })
        }
        return txchrgs;
    }

    const onSelectVariation = (variantIndex: any, subVariantIndex: any, subSubVariantIndex: any, clickedVariant: any) => {
        if (clickedVariant.price) {
            const serviceCopy = { ...item };
            serviceCopy.txchrgs = [];
            let price: any = parseFloat(serviceCopy.price);
            let salePrice: any = parseFloat(serviceCopy.salePrice);
            let vObj = serviceCopy.variations[variantIndex];
            if (variantIndex != null) {
                serviceCopy.variations = [{
                    "id": vObj.id,
                    "name": vObj.name,
                    "price": vObj.price,
                    "salePrice": vObj.salePrice,
                    "variations": []
                }]
                price = parseFloat(vObj.price);
                salePrice = parseFloat(vObj.salePrice);
                if (subVariantIndex != null) {
                    vObj = vObj.variations[subVariantIndex]
                    serviceCopy.variations[0].variations = [{
                        "id": vObj.id,
                        "name": vObj.name,
                        "price": vObj.price,
                        "salePrice": vObj.salePrice,
                        "variations": []
                    }]
                    price = parseFloat(vObj.price);
                    salePrice = parseFloat(vObj.salePrice);
                }
                if (subSubVariantIndex != null) {
                    vObj = vObj.variations[subSubVariantIndex]
                    serviceCopy.variations[0].variations[0].variations = [{
                        "id": vObj.id,
                        "name": vObj.name,
                        "price": vObj.price,
                        "salePrice": vObj.salePrice,
                        "variations": []
                    }]
                    price = parseFloat(vObj.price);
                    salePrice = parseFloat(vObj.salePrice);
                }
            }
            serviceCopy.price = price;
            serviceCopy.salePrice = salePrice;
            serviceCopy.txchrgs = calculateTaxes(salePrice || price);
            setSelectedVariation(getSelectedVariationObj(serviceCopy));
            setSelectedVariationService({ ...serviceCopy });
        }
    }

    return (
        <>
            {(item && item.type == keywords[SERVICE]) ?
                <div className="service-pdp-modal-wrap" style={{ width: `${availableWidth}px` }}>
                    <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                        <div className="pdp-cover">
                            <ClickAwayListener onClickAway={closePdpMOdal}>
                                <div>
                                    <div className="modal-close" onClick={() => closePdpMOdal()}>
                                        <SvgIcon icon="close" />
                                    </div >
                                    {/* {item?.iTag && <div className="ribbon ribbon-top-right"><span>{item?.iTag}</span></div>} */}

                                    <Paper elevation={4} className="outer"
                                    // style={{ height: `${(appointmentItems && appointmentItems.length != 0) ? 'calc(100vh - 135px)' : 'calc(100vh - 100px)'}` }}
                                    >
                                        {/* <div className="prodpdpbanner">
                                            <ImageSlider itemsList={item?.imagePaths} config={{ redirection: false }} no_image={PDP_NO_IMAGE} />
                                        </div> */}
                                        <div className="service-pdp-details clearfix">
                                            <div className="serv-pdp-details-wrap clearfix">
                                                <div className="serv-pdp-servtype">
                                                    <div className="serv-pdp-servname">{item?.categoryName}</div>
                                                    {item?.duration !== 0 && <div className="serv-pdp-servtypetime d-f-c">
                                                        <SvgIcon icon="timer" />
                                                        {item?.duration} {item?.durationType}
                                                    </div>}
                                                </div>
                                                {item?.variations && item?.variations?.length !== 0 && <div className="serv-pdp-servtype">
                                                    <div className="serv-pdp-servtypename">{item?.name}</div>
                                                </div>}

                                                {item?.variations && item?.variations?.length !== 0 ?
                                                    <>
                                                        <div className="variations-wrap clearfix">
                                                            {item?.variations?.map((variant: any, variantIndex: any) => {    //weekdays/weekends
                                                                if (('showOnUi' in variant) ? variant.showOnUi : true) {
                                                                    return <React.Fragment key={variantIndex}>
                                                                        <div className={`variation-name variant1 clearfix ${(!variant.variations || variant.variations.length == 0) && 'variation-wrap'} ${(selectedVariation?.variant == variant.name) && 'active'}`}
                                                                            onClick={() => onSelectVariation(variantIndex, null, null, variant)}
                                                                        >
                                                                            <div className='service-name'>{variant.name} </div>
                                                                            {variant.price > 0 && <div className="service-price">{configData.currencySymbol} {variant.salePrice || variant.price}</div>}
                                                                        </div>
                                                                        {variant.variations && variant.variations?.length !== 0 && variant.variations?.map((subVariant: any, subVariantIndex: any) => {    //male/female
                                                                            if (('showOnUi' in subVariant) ? subVariant.showOnUi : true) {
                                                                                return <React.Fragment key={subVariantIndex}>
                                                                                    {(subVariant.variations && subVariant.variations?.length !== 0) ?
                                                                                        <>
                                                                                            {subVariant?.variations?.map((subSubVariant: any, subSubVariantIndex: any) => {    //adult/kid
                                                                                                if (('showOnUi' in subSubVariant) ? subSubVariant.showOnUi : true) {
                                                                                                    return <div key={subSubVariantIndex}
                                                                                                        className={`variation-wrap variant3 clearfix ${(selectedVariation?.variant == variant.name && selectedVariation?.subVariant == subVariant.name && selectedVariation?.subSubVariant == subSubVariant.name) && 'active'}`}
                                                                                                        onClick={() => onSelectVariation(variantIndex, subVariantIndex, subSubVariantIndex, subSubVariant)}>
                                                                                                        {subSubVariant.name && <div className="variation-name">{subSubVariant.name}</div>}
                                                                                                        {subSubVariant.price && <div className="variation-price">{configData.currencySymbol} {subSubVariant.salePrice || subSubVariant.price}</div>}
                                                                                                    </div>
                                                                                                }
                                                                                            })}
                                                                                        </> :
                                                                                        <>
                                                                                            {subVariant.price <= 0 ?
                                                                                                <div className="variation-name variant2">{subVariant.name}</div> :
                                                                                                <div className={`variation-wrap clearfix ${(selectedVariation?.variant == variant.name && selectedVariation?.subVariant == subVariant.name) && 'active'}`}
                                                                                                    onClick={() => onSelectVariation(variantIndex, subVariantIndex, null, subVariant)}>
                                                                                                    {subVariant.name && <div className="variation-name">{subVariant.name}</div>}
                                                                                                    <div className="variation-price">{configData.currencySymbol} {subVariant.salePrice || subVariant.price}</div>
                                                                                                </div>}
                                                                                        </>
                                                                                    }
                                                                                </React.Fragment>
                                                                            }
                                                                        })}
                                                                    </React.Fragment>
                                                                }
                                                            })}
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                        <div className="serv-pdp-servtype clearfix">
                                                            <div className="serv-pdp-servtypename">{item?.name}</div>
                                                            <div className="serv-pdp-servofferforpr">{configData.currencySymbol}
                                                                {item?.salePrice || item?.price}
                                                            </div>
                                                        </div>
                                                        {item?.iTag && <div className="itag"><span>( {item?.iTag} )</span></div>}

                                                    </>
                                                }
                                                {item?.description && item?.description?.includes('||') ? <>
                                                    <div>Description</div>
                                                    {descList.map((desc: any, i: number) => {
                                                        return <div className="serv-pdp-servtypedesc serv-pdp-servtypedesc-list" key={Math.random()}><span>&#8226;</span>{desc} </div>
                                                    })}
                                                </> : <>
                                                    {item?.description && <>
                                                        {alreadyShortDescription && <>
                                                            <div className="serv-pdp-servtypedesc">{item?.description}</div>
                                                        </>}
                                                        {!alreadyShortDescription && <>
                                                            {showLongDescription && <div className="serv-pdp-servtypedesc" onClick={() => setShowLongDescription(false)}>
                                                                {item?.description}
                                                                <span>Read Less</span>
                                                            </div>}
                                                            {!showLongDescription && <div className="serv-pdp-servtypedesc" onClick={() => setShowLongDescription(true)}>
                                                                {shortDescription}...
                                                                <span >Read More</span>
                                                            </div>}
                                                        </>}
                                                    </>}
                                                </>}

                                                {configData.storeConfig?.appointmentConfig?.active ? <div className="btn-wrap">
                                                    {isAlreadyAdded ? <div className="btn added" onClick={removeFromAppointment}>Remove From Appointment</div>
                                                        : <div className="btn" onClick={addToAppointment}>Book Appointment</div>}
                                                </div> :
                                                    <div className="note">Call <a href={`tel:+91 ${storeMetaData.phone1}`}> +91 {storeMetaData.phone1}</a> for book appointment</div>
                                                }
                                            </div>
                                        </div>
                                    </Paper>
                                </div>
                            </ClickAwayListener>
                        </div>
                    </Slide>
                </div > : null
            }
        </>

    );
}

export default ServicePdpModal;

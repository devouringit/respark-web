import React, { useState, useEffect, useRef } from 'react';
// for Accordion starts
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
// for Accordion ends
import ScrollingNavigation from '@module/topScrolleingNavigation';
import SquareGrid from "@module/squareGrid";
import { SUB_CAT_NO_IMAGE } from "@constant/noImage";
import Link from 'next/link';
import Item from '@element/horizontalItem';
import ImageGallery from 'react-image-gallery';
import router from 'next/router';
import HeadMetaTags from "@module/headMetaTags";
import { getItemMetaTags } from '@util/metaTagsService';
import { PRODUCT, SERVICE } from '@constant/types';
import FilterModal from '@module/filterModal';
import { dynamicSort } from '@util/utils';
import { filterCategory, getCurrentFilters, getItemPrice, getItemsList } from '@util/dataFilterService/itemDataService';
import { useSelector, useDispatch } from 'react-redux';
import { showSuccess } from '@context/actions';
import SvgIcon from '@element/svgIcon';

function BiFilterAlt(props) {
    return <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" height="1em" width="1em" {...props}><path d="M21,3H5C4.447,3,4,3.447,4,4v2.59c0,0.523,0.213,1.037,0.583,1.407L10,13.414V21c0,0.347,0.18,0.668,0.475,0.851 C10.635,21.95,10.817,22,11,22c0.153,0,0.306-0.035,0.447-0.105l4-2C15.786,19.725,16,19.379,16,19v-5.586l5.417-5.417 C21.787,7.627,22,7.113,22,6.59V4C22,3.447,21.553,3,21,3z M14.293,12.293C14.105,12.48,14,12.734,14,13v5.382l-2,1V13 c0-0.266-0.105-0.52-0.293-0.707L6,6.59V5h14.001l0.002,1.583L14.293,12.293z" /></svg>;
}

function AllCategoryPage({ url_Segment, storeData, activeGroup, type, metaTags }) {
    const baseRouteUrl = useSelector(state => state.store.baseRouteUrl);
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeSubCategory, setActiveSubCategory] = useState(null);
    const [isThirdLevelCategoryAvl, setIsThirdLevelCategoryAvl] = useState(false);
    const [activeMmetaTags, setmetaTags] = useState(metaTags);
    const [accordianExpanded, setAccordianExpanded] = useState(true);
    const [showFilter, setShowFilter] = useState(false);
    const [activeFilters, setActiveFilters] = useState<any>()
    const { configData, keywords } = useSelector(state => state.store ? state.store.storeData : null);
    const [filterConfig, setFilterConfig] = useState<any>();
    const [availableCategories, setAvailableCategories] = useState(storeData?.categories || []);
    const dispatch = useDispatch();

    useEffect(() => {
        if (availableCategories) getActiveCategory(availableCategories)
    }, [url_Segment])

    //set initial filters list on the basis of db config 
    useEffect(() => {
        const [filterObj, filterConfigs] = getCurrentFilters(configData, type);
        if (filterConfigs && filterConfigs.active) {
            if (filterConfigs.priceRange) {
                const storeCat = JSON.parse(JSON.stringify(storeData.categories))
                const avlActiveCat = storeCat?.filter((cat) => cat.type == type);
                let allItemsList: any = [];
                avlActiveCat.map((cat: any, i: number) => {
                    allItemsList = getItemsList(allItemsList, cat);
                    if (i == avlActiveCat.length - 1 && allItemsList.length != 0) {
                        // console.log(allItemsList)
                        allItemsList.map((item: any) => {
                            let [price, salePrice] = getItemPrice(item);
                            item.billPrice = salePrice || price;
                            item.price = price;
                            item.salePrice = salePrice;
                            item.discount = salePrice ? Number((((price - salePrice) / price) * 100).toFixed(1)) : 0;
                            // console.log(item.billPrice)
                        })
                        allItemsList = allItemsList.sort(dynamicSort("billPrice", 1)); //1 == 0 1 2 3  || -1 == 3 2 1 0
                        // allItemsList.map((item: any) => {
                        //     console.log(item.billPrice)
                        // })
                        filterConfigs.maxPrice = allItemsList[allItemsList.length - 1].billPrice;
                        filterConfigs.minPrice = 0;
                        // filterConfigs.minPrice = allItemsList[0].billPrice < (filterConfigs.maxPrice / 100) ? (filterConfigs.maxPrice / 100) : allItemsList[0].billPrice;
                        setActiveFilters({ ...filterObj, minPrice: 0, maxPrice: 100 });
                        setFilterConfig({ ...filterConfigs });
                    }
                })
            } else {
                setFilterConfig({ ...filterConfigs });
                setActiveFilters({ ...filterObj });
            }
        }
    }, [configData])

    useEffect(() => {
        const element = document.getElementById('scrolling-div');
        window.scrollTo(0, element?.offsetTop);
    }, [activeSubCategory, activeCategory])

    useEffect(() => {
        if (activeFilters && activeFilters.active) {
            const storeCat = JSON.parse(JSON.stringify(storeData.categories))
            const avlActiveCat = storeCat?.filter((cat) => cat.type == type);
            // console.log(activeFilters)
            avlActiveCat.map((cat: any, cati: number) => {
                if (cat.showOnUi) {
                    cat.originalItemList = cat.itemList;
                    cat = filterCategory(cat, activeFilters, filterConfig);
                }
                if (cati == avlActiveCat.length - 1) {
                    // console.log(avlActiveCat)
                    setAvailableCategories(avlActiveCat);
                    getActiveCategory(avlActiveCat)
                }
            })
        }
    }, [activeFilters, storeData])

    const getActiveCategory = (categories: any) => {
        setActiveSubCategory(null);
        setIsThirdLevelCategoryAvl(null);
        setActiveCategory(null);
        let categoryDataFromUrl = null;
        categories?.map((categoryData, categoryIndex) => {
            if (categoryData.name.toLowerCase() == url_Segment && categoryData.showOnUi) {
                categoryData.isSelected = true;
                categoryDataFromUrl = categoryData;
                setActiveCategory(categoryData);
                setmetaTags(getItemMetaTags(categoryData));
                if (categoryData.hasSubcategory) {
                    const isAnySubCatWithSubCat = categoryData.categoryList?.filter((cat) => cat.hasSubcategory);
                    if (isAnySubCatWithSubCat?.length != 0) setIsThirdLevelCategoryAvl(true);
                    else setIsThirdLevelCategoryAvl(false)
                } else setIsThirdLevelCategoryAvl(false)
            }
            if (categoryIndex == categories?.length - 1 && !categoryDataFromUrl) {
                // active category not found by url name
                // console.log('category not found');
                const avlActiveCat = categories?.filter((cat) => cat.showOnUi && cat.type == type);
                if (avlActiveCat?.length != 0) {
                    // console.log('first category set');
                    setmetaTags(getItemMetaTags(avlActiveCat[0]));
                    setActiveCategory(avlActiveCat[0]);
                } else if (!activeFilters?.active) {
                    router.push({ pathname: baseRouteUrl + 'home' }, '', { shallow: true });
                } else {
                    const avlActiveCat = categories?.filter((cat) => cat.showOnUi && cat.type == type);

                }
            }
        })
    }

    const handleCategoryClick = (category) => {
        setAccordianExpanded(false);
        setActiveSubCategory(category);
    }

    const getPromotionalBanner = (category) => {
        if (category.type == keywords[SERVICE]) {
            let imagePathsArray = [];

            if (category && category.imagePaths && category.imagePaths != null && category.imagePaths.length != 0) {
                category.imagePaths = category.imagePaths.filter((i: any) => !i.deleted)
                imagePathsArray = [...imagePathsArray, ...category.imagePaths];
            }
            if (category && category.hasSubcategory && category.categoryList.length != 0) {
                category.categoryList?.map((catData, catIndex) => {
                    catData.imagePaths = (catData && catData.imagePaths && catData.imagePaths != null && catData.imagePaths.length != 0) ? catData.imagePaths : []
                    catData.imagePaths = catData.imagePaths.filter((i: any) => !i.deleted)
                    imagePathsArray = [...imagePathsArray, ...catData.imagePaths];
                })
            }
            if (category && category.itemList) {
                category.itemList?.map((itemData, catIndex) => {
                    if (itemData.imagePaths && itemData.imagePaths?.length != 0) {
                        itemData.imagePaths = itemData.imagePaths.filter((i: any) => !i.deleted)
                        imagePathsArray = [...imagePathsArray, ...itemData.imagePaths];
                    }
                })
            }
            if (imagePathsArray.length != 0) {
                const categoriesPromotionBannerArray = [];
                imagePathsArray?.map((imagObj) => {
                    (imagObj.active && imagObj.imagePath) && categoriesPromotionBannerArray.push({ original: imagObj.imagePath, thumbnail: imagObj.imagePath, alt: 'Promotional', bulletClass: 'slider-bullet' })
                })
                const settings = {
                    showThumbnails: false,
                    showPlayButton: false,
                    showBullets: (categoriesPromotionBannerArray && categoriesPromotionBannerArray?.length) > 1 ? true : false,
                    autoPlay: true,
                    slideDuration: 800,
                    slideInterval: 3000,
                    startIndex: 0,
                    showNav: false,
                    showFullscreenButton: false
                }
                return <div className="promotional-banner spacing-banner " id="promotional-banner">
                    <ImageGallery items={categoriesPromotionBannerArray} {...settings} />
                </div>
            } else return null;
        } else return null;
    }

    const onSubCategoryClick = (category) => {
        setAccordianExpanded(false);
        category.categoryList && category.categoryList?.map((cat) => {
            if (cat.name === category.name) cat.isSelected = true;
            else cat.isSelected = false;
        })
        setActiveSubCategory(category);
    }

    const renderItems = (itemList: any) => {
        if (itemList && itemList?.length != 0) {
            itemList = JSON.parse(JSON.stringify(itemList))
            return <>
                {itemList?.map((item, itemIndex) => {
                    let [price, salePrice] = getItemPrice(item);
                    item.billPrice = salePrice || price;
                    item.price = price;
                    item.salePrice = salePrice;
                    item.discount = salePrice ? Number((((price - salePrice) / price) * 100).toFixed(1)) : 0;
                    if (item.variations && item?.variations?.length != 0) {
                        let activeVariations = [];
                        item.variations.map((v: any) => {
                            let isValidGroup = false;
                            if (('group' in v) && v.group) {
                                isValidGroup = (v.group.toLowerCase() === 'both' || activeGroup.toLowerCase() === 'both') ? true : (v.group.toLowerCase() === activeGroup.toLowerCase());
                            } else isValidGroup = true;
                            if (isValidGroup) activeVariations.push(v);
                        })
                        item.variations = activeVariations;
                    }
                    return <React.Fragment key={Math.random()}>
                        {item.showOnUi && <div className=' service-list-cover pd-t-10'>

                            <Item item={item} type={item.type} config={{ onClickAction: configData.showServicesPdp }} />
                        </div>}
                    </React.Fragment>
                })}
            </>
        } else return null;
    }

    const renderCategory = (category: any) => {
        if (category && category.showOnUi && category.active) {
            return <React.Fragment>
                {category.hasSubcategory ? <>
                    {/* <div id="scrolling-div" className="scrolling-div"></div> */}
                    {getPromotionalBanner(category)}
                    <div className='services-list-wrapper'>
                        {category?.categoryList?.map((category, index) => {
                            return <React.Fragment key={Math.random()} >
                                {category.showOnUi && category.active ? <div className="service-list-cover subsubcat-wrap">
                                    <div className="ser-list-title">{category.name}</div>
                                    {category?.itemList && renderItems(category?.itemList)}
                                </div> : null}
                            </React.Fragment>
                        })}
                    </div>
                </> :
                    <div className="fullwidth horizontal-product-card-wrap">
                        {getPromotionalBanner(category)}
                        <div className='services-list-wrapper'>
                            {category?.itemList && renderItems(category?.itemList)}
                        </div>
                    </div>
                }
            </React.Fragment>
        } else return null;
    }

    const handleFilterModalRes = (filters: any) => {
        if (filters) {
            setActiveFilters(filters);
            dispatch(showSuccess("Filter applied successfully"))
        }
        setShowFilter(false)
    }

    return (
        <>
            <HeadMetaTags title={activeMmetaTags.title} siteName={activeMmetaTags.siteName} description={activeMmetaTags.description} image={activeMmetaTags.image} storeData={storeData} />
            <div className="categorypageContainer">
                {filterConfig && filterConfig.active ? <>
                    <div className='filter-nav-wrap'>
                        <ScrollingNavigation items={availableCategories} config={{ from: 'all', type }} handleClick={(item) => setActiveCategory(item)} activeCategory={activeCategory} />
                        <div className='filter-icon-wrap'>
                            <div className='filter-icon' onClick={() => setShowFilter(true)}>
                                <BiFilterAlt />
                            </div>
                        </div>
                    </div>
                </> : <>
                    <ScrollingNavigation items={availableCategories} config={{ from: 'all', type }} handleClick={(item) => setActiveCategory(item)} activeCategory={activeCategory} />
                </>}
                {activeCategory ? <>
                    {isThirdLevelCategoryAvl ?
                        <div className="fullwidth accordian-wrap">
                            {activeSubCategory ?
                                <>
                                    <Accordion expanded={accordianExpanded} onChange={() => setAccordianExpanded(accordianExpanded ? false : true)}>
                                        <AccordionSummary
                                            expandIcon={<SvgIcon icon="expand" />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <div className="accor-title">{activeSubCategory.name}</div>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <div className="boxlayout">
                                                <SquareGrid noImage={SUB_CAT_NO_IMAGE} items={activeCategory.categoryList} config={{ withShadow: false }}
                                                    handleClick={(category) => handleCategoryClick(category)} />
                                            </div>
                                        </AccordionDetails>
                                    </Accordion>
                                    <>
                                        {renderCategory(activeSubCategory)}
                                    </>
                                </>
                                :
                                <div className="subcat-cover clearfix">
                                    <div className="boxlayout">
                                        <SquareGrid noImage={SUB_CAT_NO_IMAGE} items={activeCategory.categoryList} config={{ withShadow: false }} handleClick={(category) => onSubCategoryClick(category)} />
                                    </div>
                                </div>
                            }
                        </div> :
                        <>
                            {renderCategory(activeCategory)}
                        </>
                    }
                </> : <>
                    <div className='unavailable-data'>
                        <div className='heading'>Whoops ...</div>
                        <div className=''>We're unable to find the data that you're looking for</div>
                    </div>
                </>}
                <FilterModal
                    frompage="All-Categories"
                    filterConfig={filterConfig}
                    openModal={showFilter}
                    type={type}
                    activeFilters={activeFilters}
                    handleClose={(filters: any) => handleFilterModalRes(filters)}
                />
            </div>
        </>
    );
}

export default AllCategoryPage;

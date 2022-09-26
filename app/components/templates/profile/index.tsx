import React, { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";
import AddressModal from '@module/addressModal';
import UserRegistrationModal from '@module/userRegistration';
import { windowRef } from '@util/window';

function ProfilePage() {

    const [openUserUpdationModal, setOpenUserUpdationModal] = useState(false);
    const [cookie, setCookie] = useCookies();
    const [userData, setUserCookie] = useState(cookie['user']);
    const [activeGroup, setActiveGroup] = useState(cookie['grp']);
    const [selectedAddress, setSelectedAddress] = useState<any>('');
    const [selectedAddressType, setSelectedAddressType] = useState('Home');
    const [openAddressModal, setOpenAddressModal] = useState(false);
    const [selectedAddressToEdit, setSelectedAddressToEdit] = useState(null);
    const [userAddresses, setUserAddresses] = useState([
        { type: 'Home', value: null, isNew: false, isEdited: false, activeImg: `/assets/images/checkout/${activeGroup}/home_sel.png`, inactiveImg: '/assets/images/checkout/home.png' },
        { type: 'Work', value: null, isNew: false, isEdited: false, activeImg: `/assets/images/checkout/${activeGroup}/work_sel.png`, inactiveImg: '/assets/images/checkout/work.png' },
        { type: 'Other', value: null, isNew: false, isEdited: false, activeImg: `/assets/images/checkout/${activeGroup}/other_sel.png`, inactiveImg: '/assets/images/checkout/other.png' },
    ])

    useEffect(() => {
        if (windowRef) window.scrollTo(0, 0);
    }, [windowRef])

    useEffect(() => {
        setUserCookie(cookie['user']);
        setActiveGroup(cookie['grp'])
    }, [cookie])

    useEffect(() => {
        if (userData) {

            if (userData?.addressList) {
                const userAddressesCopy = [...userAddresses];
                userAddressesCopy.map((userAdd) => {
                    userData.addressList.map((data) => {
                        if (userAdd.type == data.type) {
                            userAdd.value = data;
                        }
                    })
                })
                const isAnyAddAvl = userAddressesCopy.filter((data) => data.value);
                if (isAnyAddAvl.length != 0) {
                    setSelectedAddressType(isAnyAddAvl[0].type);
                    setSelectedAddress(isAnyAddAvl[0].value)
                }
                setUserAddresses(userAddressesCopy);
            }
            console.log(userData)
        }
    }, [userData])


    const handleAddressModalResponse = (address) => {
        if (address) {
            console.log(address)
            const newAddress = { ...address };
            const userAddressesCopy = [...userAddresses];
            userAddressesCopy.map((userAdd) => {
                if (userAdd.type == newAddress.type) {
                    userAdd.value = address;
                }
            })
            setSelectedAddressType(address.type);
            setUserAddresses(userAddressesCopy);
            setSelectedAddress(newAddress)
        }
        setSelectedAddressToEdit(null);
        setOpenAddressModal(false)
    }

    const setActiveAddressType = (address) => {
        if (address.value) {
            setSelectedAddressType(address.type);
        } else {
            setSelectedAddressToEdit({ type: address.type })
            setOpenAddressModal(true);
        }
    }

    const editAddress = (address) => {
        setSelectedAddressToEdit(address);
        setOpenAddressModal(true);
    }
    return (
        <div className="wrapper">
            <img className="prof-img" src="/assets/images/profile_banner_image.png" />
            <div className="wrap-content">
                {userData && <div>
                    <div className="name">{userData.firstName} {userData.lastName}
                        <div className="edit-icon" onClick={(e) => setOpenUserUpdationModal(true)}>
                            <img src={`/assets/Icons/edit_icon.png`} />
                        </div>
                    </div>
                    <div className="usernumber">{userData.mobileNo}</div>
                    <div className="usernumber">{userData.email}</div>

                </div>}
            </div>
            <div className="address-wrap">
                <div className="heading-wrap clearfix">
                    <div className="heading">Delivery Addresses</div>
                    <div className="add-type-wrap clearfix">
                        {userAddresses.map((address, index) => {
                            return <div className="add-type-details" key={Math.random()} onClick={() => setActiveAddressType(address)}>
                                <div className="type-img-wrap clearfix">
                                    <div className="image-wrap">
                                        {address.type === selectedAddressType && <img src={`/assets/images/checkout/${activeGroup}/${address.type}_sel.png`} />}
                                        {address.type !== selectedAddressType && <img src={`/assets/images/checkout/${address.type}.png`} />}
                                    </div>
                                    <div className="type-name">{address.type}</div>
                                </div>
                                {address.type == selectedAddressType && <>
                                    {address.value ? <div className="add-details">
                                        <div className="title">{address.value.line}</div>
                                        <div className="desc">
                                            {address.value.area && <>{address.value.area},</>}
                                            {address.value.city && <>{address.value.city},</>}
                                            {address.value.code && <>{address.value.code}</>}
                                        </div>
                                        <div className="edit-address" onClick={() => editAddress(address.value)} >Edit address</div>
                                    </div> :
                                        <div className="add-details">
                                            <div>No address saved yet</div>
                                            <div className="edit-address" onClick={() => setOpenAddressModal(true)} >Add address</div>
                                        </div>
                                    }
                                </>}
                            </div>
                        })}
                    </div>
                </div>
            </div>

            {openUserUpdationModal && <UserRegistrationModal
                handleResponse={(e) => setOpenUserUpdationModal(false)}
                isApppGrpChangeOnUserGdrChange={true}
                open={true}
                heading={'Update Profile Details'}
            />}
            <AddressModal
                open={openAddressModal}
                handleClose={(res) => handleAddressModalResponse(res)}
                addressToEdit={selectedAddressToEdit}
                userId={userData?.id}
            />
        </div>
    )
}


export default ProfilePage;

import Backdrop from '@material-ui/core/Backdrop'
import React from 'react'
import CloseIcon from '@material-ui/icons/CloseOutlined';

function PWAPrompt({ showPrompt, type, handlePromptClose }) {
    return (
        <div className="confirmation-modal-wrap">
            <Backdrop
                className="backdrop-modal-wrapper confirmation-modal-wrap"
                open={showPrompt ? true : false}
            // onClick={() => handleClose(false)}
            >
                <div className="backdrop-modal-content confirmation-modal" style={{ height: showPrompt ? '200px' : '0px' }}>
                    <div className="heading">Install</div>
                    <div className="modal-close" onClick={() => handlePromptClose(false)}>
                        <CloseIcon />
                    </div>
                    <div className="member-modal">
                        <div className='body-text'>ghgvjvj</div>
                        <div className="form-btn-wrap">
                            <button className="primary-btn rounded-btn" onClick={() => handlePromptClose(true)}>installll</button>
                        </div>
                    </div>
                </div>
            </Backdrop>
        </div>
    )
}

export default PWAPrompt
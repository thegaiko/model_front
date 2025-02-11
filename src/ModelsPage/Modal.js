import React from 'react';

const Modal = ({ selectedItem, currentImageIndex, goToNextImage, goToPreviousImage, closeModal }) => {
    return (
        <div className="modal" onClick={closeModal}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                <button className="carouselBtn prev" onClick={goToPreviousImage}>‹</button>
                <img src={selectedItem.other_photos[currentImageIndex]} alt="Selected" className="modalImage" />
                <button className="carouselBtn next" onClick={goToNextImage}>›</button>
            </div>
        </div>
    );
};

export default Modal;
import { useState } from "react"

const ImageGallery = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const handleThumbnailClick = (index) => {
    setSelectedImage(index)
    setIsZoomed(false)
  }

  const handleMainImageClick = () => {
    setIsZoomed(!isZoomed)
  }

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const handleNext = () => {
    setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  return (
    <div className="image-gallery">
      <div className="main-image-container">
        <div className={`main-image ${isZoomed ? "zoomed" : ""}`}>
          <img
            src={images[selectedImage] || "/placeholder.svg"}
            alt={`${productName} - View ${selectedImage + 1}`}
            onClick={handleMainImageClick}
          />

          {images.length > 1 && (
            <>
              <button className="nav-btn prev" onClick={handlePrevious}>
                ‹
              </button>
              <button className="nav-btn next" onClick={handleNext}>
                ›
              </button>
            </>
          )}

          <div className="zoom-hint">{isZoomed ? "Click to zoom out" : "Click to zoom in"}</div>
        </div>
      </div>

      {images.length > 1 && (
        <div className="thumbnail-container">
          {images.map((image, index) => (
            <button
              key={index}
              className={`thumbnail ${selectedImage === index ? "active" : ""}`}
              onClick={() => handleThumbnailClick(index)}
            >
              <img src={image || "https://i.pinimg.com/1200x/5f/d3/e6/5fd3e652a974f58818692cef0804415d.jpg"} alt={`${productName} - Thumbnail ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery

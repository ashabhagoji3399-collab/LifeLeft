import { useState } from "react";

function Scanner() {
  const [image, setImage] = useState(null);

  const handleImage = (event) => {
    const file = event.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="scanner-page">

      <h1>Give your item a second look.</h1>

      <p>
        Upload a photo and LifeLeft will help you discover
        what you can do with it.
      </p>

      <label className="upload-box">

        {image ? (
          <img src={image} alt="Uploaded item" />
        ) : (
          <>
            <div className="upload-icon">📸</div>

            <h3>Upload an item</h3>

            <span>
              JPG, PNG or WEBP
            </span>
          </>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          hidden
        />

      </label>

      {image && (
        <button className="analyze-btn">
          ✨ Analyze My Item
        </button>
      )}

    </div>
  );
}

export default Scanner;
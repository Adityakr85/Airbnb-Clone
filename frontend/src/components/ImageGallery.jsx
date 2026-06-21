function ImageGallery({ image }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <img
        src={image}
        alt="Property"
        className="w-full h-[450px] object-cover rounded-l-xl"
      />

      <div className="grid grid-rows-2 gap-2">
        <img
          src={image}
          alt="Property"
          className="w-full h-[220px] object-cover rounded-tr-xl"
        />

        <img
          src={image}
          alt="Property"
          className="w-full h-[220px] object-cover rounded-br-xl"
        />
      </div>
    </div>
  );
}

export default ImageGallery;
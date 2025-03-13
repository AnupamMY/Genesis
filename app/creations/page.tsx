import Image from "next/image";
import logo from "../../public/logo.jpeg";
export default function Creations() {
  let imageArray = [logo, logo, logo, logo, logo];

  return (
    <div className="max-w-7xl mx-auto p-12 mt-12 mb-12">
      <div className="flex flex-col items-center justify-center">
        <div className="creations-heading flex justify-start  w-full">
          <h1 className="text-5xl font-bold mb-4 ">Your creations</h1>
        </div>
      </div>
      <div className="grid border-2 mt-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {imageArray.map((image, index) => {
          return (
            <div key={index} className="grid rounded-lg shadow-md p-8">
              <Image
                key={image.src}
                src={image}
                alt="Genesis Logo"
                className="rounded mb-8 mt-8"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
